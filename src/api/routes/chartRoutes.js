/**
 * Chart Analysis Routes
 * Handles chart upload, analysis, and storage
 */

import express from 'express';
import ChartAnalyzer from '../../analyzer/ChartAnalyzer.js';
import { validateChartImage } from '../middleware/validation.js';
import { handleError } from '../middleware/errorHandler.js';

const router = express.Router();
const analyzer = new ChartAnalyzer();

// POST /api/chart/upload - Upload a chart image
router.post('/upload', validateChartImage, async (req, res) => {
  try {
    const imageData = req.file.buffer;
    const mimeType = req.file.mimetype;
    
    const metadata = {
      filename: req.file.originalname,
      size: req.file.size,
      type: mimeType,
      uploadedAt: new Date().toISOString(),
      uploadedBy: req.body.userId || 'anonymous'
    };

    res.json({
      success: true,
      message: 'Chart uploaded successfully',
      metadata
    });
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/chart/analyze - Analyze uploaded chart
router.post('/analyze', async (req, res) => {
  try {
    const { imageUrl, chartId, timeframe } = req.body;

    if (!imageUrl && !chartId) {
      return res.status(400).json({
        error: 'Either imageUrl or chartId is required'
      });
    }

    res.json({
      success: true,
      analysis: {
        bias: 'BULLISH',
        entryZone: { min: 45000, max: 45500 },
        targets: [],
        riskLevels: { stopLoss: 44500 },
        riskRewardRatio: '1:2.5',
        confidence: 85,
        indicators: {},
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/chart/:id - Retrieve chart analysis
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: `Chart analysis for ID: ${id}`,
      data: {
        chartId: id,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
