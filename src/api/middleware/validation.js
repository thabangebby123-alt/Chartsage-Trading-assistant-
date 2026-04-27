/**
 * Validation Middleware
 * Validates incoming requests and data
 */

import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPG, PNG, WebP'));
    }
  }
});

export const validateChartImage = upload.single('chart');

export const validatePriceArray = (req, res, next) => {
  const { prices } = req.body;
  
  if (!Array.isArray(prices)) {
    return res.status(400).json({ error: 'Prices must be an array' });
  }
  
  if (prices.length < 20) {
    return res.status(400).json({ error: 'At least 20 price points required' });
  }
  
  next();
};
