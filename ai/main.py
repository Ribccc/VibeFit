import os
import io
import base64
import json
import time
import logging
import traceback
from typing import Optional

from PIL import Image, UnidentifiedImageError
from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from dotenv import load_dotenv
from groq import Groq

# ─────────────────────────────────────────────
#  CONFIG
# ─────────────────────────────────────────────
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("vibefit")

GROQ_API_KEY        = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL          = os.getenv("GROQ_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
MAX_IMAGE_SIZE_MB   = int(os.getenv("MAX_IMAGE_SIZE_MB", "10"))
MAX_IMAGE_BYTES     = MAX_IMAGE_SIZE_MB * 1024 * 1024
IMAGE_MAX_DIMENSION = 1024
ALLOWED_MIME_TYPES  = {"image/jpeg", "image/png", "image/webp", "image/gif"}
RETRY_ATTEMPTS      = 3
RETRY_DELAY_SECS    = 1.5

# ─────────────────────────────────────────────
#  GROQ CLIENT
# ─────────────────────────────────────────────
if not GROQ_API_KEY:
    logger.warning("⚠️  GROQ_API_KEY not set in .env — calls to /analyze-style will fail.")

groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# ─────────────────────────────────────────────
#  FASTAPI APP
# ─────────────────────────────────────────────
app = FastAPI(
    title="VibeFit AI Backend",
    description="AI-powered personal styling via Groq Vision",
    version="3.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
#  SYSTEM PROMPT
# ─────────────────────────────────────────────
SYSTEM_PROMPT = """\
You are VibeFit, an expert AI personal stylist with deep knowledge of body 
proportions, fashion styling, and color theory. You give honest, personalized, 
and encouraging style advice like a best friend who happens to be a professional 
stylist.

The user provides TWO images:
- Image 1: Their full body photo
- Image 2: An outfit they want to check

Measurements provided by user:
- Shoulder width : {shoulder}
- Waist          : {waist}
- Hips           : {hips}

── STEP 1 — BODY SHAPE ─────────────────────────────────────────────────────
Carefully inspect Image 1. Classify into ONE of:
  HOURGLASS | RECTANGLE | PEAR/TRIANGLE | INVERTED TRIANGLE | APPLE/ROUND
Rules:
• NEVER classify as Apple/Round without clear midsection width evidence.
• If the full body is not visible, set bodyShape.name = "UNCLEAR".
• State confidence (Low / Medium / High). Use measurements to raise confidence.

── STEP 2 — SKIN TONE ──────────────────────────────────────────────────────
Sample from AT LEAST 3 areas (face, neck, arms). Classify on Monk Scale:
  1-2 Fair | 3-4 Light | 5-6 Medium/Olive | 7-8 Tan/Brown | 9-10 Deep

── STEP 3 — OUTFIT ANALYSIS ────────────────────────────────────────────────
Analyze Image 2 for: silhouette type, neckline, waist definition, hemline,
colors/print, and fabric weight.

── STEP 4 — COMPATIBILITY SCORING ─────────────────────────────────────────
Score 0-100 across:
• PROPORTION BALANCE  — 40 pts
• COLOR HARMONY       — 25 pts
• STRUCTURE & FIT     — 20 pts
• STYLE COHESION      — 15 pts
Do NOT inflate. Bad match = below 50.

── STEP 5 — OUTPUT ─────────────────────────────────────────────────────────
Return ONLY a raw valid JSON object with absolutely NO markdown, NO prose outside JSON.
Use this exact schema (replace angle-bracket values):

{{
  "score": <integer 0-100>,
  "verdictLine": "<punchy honest one-liner>",
  "bodyShape": {{
    "name": "<shape>",
    "confidence": "<Low|Medium|High>",
    "why": "<2 sentences with specific visual evidence>"
  }},
  "skinTone": {{
    "monkScaleAndLabel": "<e.g. Monk 5 — Medium/Olive>",
    "sampledFrom": "<e.g. face, neck, forearm>"
  }},
  "outfitBreakdown": {{
    "silhouette": "<type>",
    "neckline": "<type>",
    "waistDefinition": "<type>",
    "hemline": "<type>",
    "colorsAndPrint": "<description>"
  }},
  "scoreBreakdown": {{
    "proportionBalance": <0-40>,
    "colorHarmony": <0-25>,
    "structureAndFit": <0-20>,
    "styleCohesion": <0-15>
  }},
  "whatsGiving": ["<positive 1>", "<positive 2>", "<positive 3>"],
  "whatsNotHitting": ["<honest issue 1>", "<issue 2>"],
  "suggestions": ["<actionable tip 1>", "<tip 2>", "<tip 3>"],
  "betterOutfits": ["<outfit idea 1>", "<outfit idea 2>", "<outfit idea 3>"]
}}

CRITICAL: Output ONLY the JSON object. No commentary, no markdown, no code fences.\
"""

# ─────────────────────────────────────────────
#  BODY TYPE PROMPT (measurements only, no images)
# ─────────────────────────────────────────────
BODY_TYPE_PROMPT = """\
You are VibeFit, a professional body-type analyst and fashion stylist.
The user has provided their body measurements and wants to know their body type and styling advice.
You do NOT have any images — work purely from the numbers provided.

Measurements:
  Shoulder width : {shoulder} cm
  Waist          : {waist} cm
  Hips           : {hips} cm
  Height         : {height} cm

── CLASSIFICATION RULES ────────────────────────────────────────────────────
1. Calculate key ratios:
   • Shoulder-to-hip ratio (SHR)   = shoulder / hips
   • Waist-to-hip ratio (WHR)      = waist / hips
   • Waist-to-shoulder ratio (WSR) = waist / shoulder

2. Classify into ONE of:
   HOURGLASS         : SHR 0.90–1.05, WHR < 0.80, balanced shoulders and hips
   RECTANGLE/COLUMN  : SHR 0.90–1.05, WHR > 0.80 (less defined waist)
   PEAR/TRIANGLE     : SHR < 0.90 (hips noticeably wider than shoulders)
   INVERTED TRIANGLE : SHR > 1.05 (shoulders noticeably wider than hips)
   APPLE/ROUND       : WHR > 0.85 AND WSR > 0.85 (full midsection vs hips)

3. Confidence:
   • High   — all three measurements provided and ratios clearly point to one shape
   • Medium — two measurements or borderline ratios
   • Low    — only one measurement or data conflicts
   If height is missing set it to null, do not let it affect confidence much.

4. Give 4 specific style tips tailored to this body type. Each tip should be
   one actionable sentence (e.g. "Opt for A-line skirts to accentuate your waist.").

── OUTPUT ───────────────────────────────────────────────────────────────────
Return ONLY a raw valid JSON object, no markdown, no prose outside JSON:

{{
  "bodyShape": {{
    "name": "<HOURGLASS|RECTANGLE|PEAR/TRIANGLE|INVERTED TRIANGLE|APPLE/ROUND>",
    "confidence": "<Low|Medium|High>",
    "why": "<2 sentences explaining which ratios led to this classification>",
    "ratios": {{
      "shoulderToHip": <float or null>,
      "waistToHip": <float or null>,
      "waistToShoulder": <float or null>
    }}
  }},
  "styleTips": ["<tip1>", "<tip2>", "<tip3>", "<tip4>"]
}}


CRITICAL: Output ONLY the JSON object. No commentary, no markdown, no code fences.\
"""

# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def validate_upload(file: UploadFile, content: bytes, label: str) -> None:
    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(413, f"{label} exceeds max {MAX_IMAGE_SIZE_MB}MB.")
    mime = file.content_type or ""
    if mime not in ALLOWED_MIME_TYPES:
        raise HTTPException(415, f"{label} type '{mime}' not supported. Use JPEG/PNG/WebP.")


def preprocess_image(content: bytes, label: str) -> str:
    """Decode, resize, and return as base64 JPEG string."""
    try:
        img = Image.open(io.BytesIO(content))
    except UnidentifiedImageError:
        raise HTTPException(422, f"{label} could not be decoded as an image.")

    img = img.convert("RGB")
    w, h = img.size
    if max(w, h) > IMAGE_MAX_DIMENSION:
        scale = IMAGE_MAX_DIMENSION / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
        logger.info(f"{label}: resized {w}x{h} → {img.size[0]}x{img.size[1]}")

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    logger.info(f"{label}: base64 size = {len(b64) // 1024}KB")
    return b64


def validate_response(data: dict) -> None:
    required = {"score", "verdictLine", "bodyShape", "skinTone",
                "whatsGiving", "suggestions", "betterOutfits"}
    missing = required - data.keys()
    if missing:
        raise ValueError(f"Missing keys in response: {missing}")
    score = data.get("score")
    if not isinstance(score, (int, float)) or not (0 <= score <= 100):
        raise ValueError(f"Invalid score: {score!r}")


def strip_markdown(text: str) -> str:
    """Remove accidental ```json ... ``` fences from model output."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        # drop first and last fence lines
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    return text


def call_groq_with_retry(
    prompt: str,
    user_b64: str,
    outfit_b64: str
) -> dict:
    if groq_client is None:
        raise HTTPException(503, "Groq client not configured. Set GROQ_API_KEY in ai/.env")

    last_error = None
    for attempt in range(1, RETRY_ATTEMPTS + 1):
        try:
            logger.info(f"Groq call attempt {attempt}/{RETRY_ATTEMPTS} (model={GROQ_MODEL})")
            t0 = time.time()

            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": prompt
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Image 1 — Full body photo of the user:"
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{user_b64}"
                                }
                            },
                            {
                                "type": "text",
                                "text": "Image 2 — Outfit photo to evaluate:"
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{outfit_b64}"
                                }
                            },
                            {
                                "type": "text",
                                "text": "Analyze both images and return the VibeFit JSON styling report only."
                            }
                        ]
                    }
                ],
                temperature=0.4,
                max_tokens=2048,
                response_format={"type": "json_object"}
            )

            elapsed = round(time.time() - t0, 2)
            logger.info(f"Groq responded in {elapsed}s | tokens used: {response.usage.total_tokens}")

            raw = response.choices[0].message.content
            raw = strip_markdown(raw)

            data = json.loads(raw)
            validate_response(data)
            return data

        except (json.JSONDecodeError, ValueError) as e:
            last_error = e
            logger.warning(f"Attempt {attempt} — Bad JSON from Groq: {e}")
        except HTTPException:
            raise
        except Exception as e:
            last_error = e
            logger.warning(f"Attempt {attempt} — Groq API error: {e}")

        if attempt < RETRY_ATTEMPTS:
            sleep = RETRY_DELAY_SECS * attempt
            logger.info(f"Retrying in {sleep}s...")
            time.sleep(sleep)

    raise RuntimeError(f"Groq failed after {RETRY_ATTEMPTS} attempts. Last: {last_error}")


# ─────────────────────────────────────────────
#  GLOBAL ERROR HANDLER
# ─────────────────────────────────────────────

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled: {exc}\n{traceback.format_exc()}")
    return JSONResponse(status_code=500, content={"error": "Internal server error", "detail": str(exc)})


# ─────────────────────────────────────────────
#  ROUTES
# ─────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "model": GROQ_MODEL,
        "version": "3.0.0",
        "api_key_configured": bool(GROQ_API_KEY)
    }


@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "groq_client": "ready" if groq_client else "not configured",
        "model": GROQ_MODEL,
        "max_image_size_mb": MAX_IMAGE_SIZE_MB,
        "retry_attempts": RETRY_ATTEMPTS,
    }


@app.post("/analyze-style", tags=["Analysis"])
async def analyze_style(
    user_photo:   UploadFile = File(...),
    outfit_photo: UploadFile = File(...),
    shoulder: Optional[str] = Form(None),
    waist:    Optional[str] = Form(None),
    hips:     Optional[str] = Form(None),
):
    """
    POST two images → get a full VibeFit styling report powered by Groq Vision.
    """
    request_id = f"req-{int(time.time() * 1000)}"
    logger.info(f"[{request_id}] New /analyze-style request")

    # 1. Read
    user_content   = await user_photo.read()
    outfit_content = await outfit_photo.read()

    # 2. Validate
    validate_upload(user_photo,   user_content,   "User photo")
    validate_upload(outfit_photo, outfit_content, "Outfit photo")

    # 3. Preprocess → base64
    user_b64   = preprocess_image(user_content,   "User photo")
    outfit_b64 = preprocess_image(outfit_content, "Outfit photo")

    # 4. Build prompt
    measurements = {
        "shoulder": shoulder or "Not provided",
        "waist":    waist    or "Not provided",
        "hips":     hips     or "Not provided",
    }
    prompt = SYSTEM_PROMPT.format(**measurements)
    logger.info(f"[{request_id}] Measurements: {measurements}")

    # 5. Call Groq
    try:
        result = call_groq_with_retry(prompt, user_b64, outfit_b64)
    except HTTPException:
        raise
    except RuntimeError as e:
        logger.error(f"[{request_id}] {e}")
        raise HTTPException(502, str(e))
    except Exception as e:
        logger.error(f"[{request_id}] Unexpected: {e}\n{traceback.format_exc()}")
        raise HTTPException(500, "Unexpected server error.")

    logger.info(f"[{request_id}] ✅ Done — score={result.get('score')}")
    return result


# ─────────────────────────────────────────────
#  BODY TYPE FROM MEASUREMENTS (no images needed)
# ─────────────────────────────────────────────

@app.post("/analyze-body-type", tags=["Analysis"])
async def analyze_body_type(
    shoulder: Optional[str] = Form(None),
    waist:    Optional[str] = Form(None),
    hips:     Optional[str] = Form(None),
    height:   Optional[str] = Form(None),
):
    """
    POST body measurements → get body shape classification + style tips.
    No images required. Works with as few as 2 measurements.
    """
    if groq_client is None:
        raise HTTPException(503, "Groq client not configured. Set GROQ_API_KEY in ai/.env")

    # Require at least shoulder + hips OR waist + hips
    provided = [x for x in [shoulder, waist, hips] if x]
    if len(provided) < 2:
        raise HTTPException(
            400,
            "Please provide at least 2 of: shoulder, waist, hips measurements."
        )

    request_id = f"bt-{int(time.time() * 1000)}"
    logger.info(f"[{request_id}] /analyze-body-type: shoulder={shoulder} waist={waist} hips={hips} height={height}")

    prompt = BODY_TYPE_PROMPT.format(
        shoulder=shoulder or "Not provided",
        waist=waist    or "Not provided",
        hips=hips      or "Not provided",
        height=height  or "Not provided",
    )

    last_error = None
    for attempt in range(1, RETRY_ATTEMPTS + 1):
        try:
            logger.info(f"[{request_id}] Body type call attempt {attempt}/{RETRY_ATTEMPTS}")
            t0 = time.time()

            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user",   "content": "Analyze my measurements and return the body type JSON report only."}
                ],
                temperature=0.3,
                max_tokens=1024,
                response_format={"type": "json_object"}
            )

            elapsed = round(time.time() - t0, 2)
            logger.info(f"[{request_id}] Responded in {elapsed}s")

            raw = strip_markdown(response.choices[0].message.content)
            data = json.loads(raw)

            # Basic validation
            if "bodyShape" not in data or "styleTips" not in data:
                raise ValueError(f"Missing required keys. Got: {list(data.keys())}")

            logger.info(f"[{request_id}] ✅ Body type = {data.get('bodyShape', {}).get('name')}")
            return data

        except (json.JSONDecodeError, ValueError) as e:
            last_error = e
            logger.warning(f"[{request_id}] Attempt {attempt} — bad JSON: {e}")
        except Exception as e:
            last_error = e
            logger.warning(f"[{request_id}] Attempt {attempt} — API error: {e}")

        if attempt < RETRY_ATTEMPTS:
            time.sleep(RETRY_DELAY_SECS * attempt)

    raise HTTPException(502, f"Body type analysis failed after {RETRY_ATTEMPTS} attempts. Last error: {last_error}")


# ─────────────────────────────────────────────
#  ENTRY
# ─────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
