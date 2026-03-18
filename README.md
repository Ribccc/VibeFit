# VibeFit – AI Outfit Stylist & Virtual Try-On

VibeFit is a modern AI-powered fashion stylist application that helps users discover their style and virtually try on outfits.

## Project Structure

- `/client`: React + Vite frontend with TailwindCSS and Framer Motion.
- `/server`: Node.js + Express API for handling uploads and styling logic.
- `/ai`: Python FastAPI microservice for image analysis.
- `/uploads`: Folder for storing user photos.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Run All Services**
   ```bash
   npm run dev
   ```

## Features

- **AI Style Analysis**: Upload a photo to detect your fashion vibe and recommended palette.
- **Virtual Try-On Model**: Toggle between male/female models and see outfit overlays in real-time.
- **Outfit Stylist**: Browse clothing categories and apply them to the model.
- **Smart Recommendations**: Personalized suggestions based on AI analysis.
- **Premium UI**: Clean, minimal, and modern design with smooth animations.
