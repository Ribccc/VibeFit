require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
app.get('/api/clothes', (req, res) => {
  // Mock data for now
  const clothes = [
    { id: 1, name: 'Minimalist Tee', category: 'Tops', gender: 'female', image: 'female_top_1.jpg', color: 'White', style: 'Casual' },
    { id: 2, name: 'Wide Leg Trousers', category: 'Bottoms', gender: 'female', image: 'female_bottom_1.jpg', color: 'Beige', style: 'Minimalist' },
    { id: 3, name: 'Leather Jacket', category: 'Jackets', gender: 'male', image: 'male_jacket_1.jpg', color: 'Black', style: 'Streetwear' },
    // More will be added
  ];
  res.json(clothes);
});

app.post('/api/upload-photo', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Since we use memory storage on Vercel, we can't return a local path.
  // The frontend should ideally send this file to the AI service or cloud storage.
  res.json({ 
      filename: req.file.originalname, 
      mimetype: req.file.mimetype,
      size: req.file.size
  });
});

app.post('/api/analyze-style', (req, res) => {
  // Logic to call Python microservice would go here
  // For now, returning mock analysis
  res.json({
    gender: 'female',
    style: 'Streetwear',
    colors: ['Black', 'Beige', 'Olive'],
    score: 85,
    recommendedOutfits: [
      { id: 101, name: 'Oversized Hoodie', category: 'Tops', image: 'hoodie.jpg' },
      { id: 102, name: 'Cargo Pants', category: 'Bottoms', image: 'cargo.jpg' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
