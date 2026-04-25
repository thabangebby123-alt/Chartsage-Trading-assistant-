/**
 * Entry Detection Routes
 * AI-powered entry signal detection and analysis
 */

import express from 'express';
import TradingAssistant from '../../assistant/TradingAssistant.js';
import { handleError } from '../middleware/errorHandler.js';

const router = express.Router();
const assistant = new TradingAssistant();

// POST /api/entries/detect - Detect AI entry opportunities
router.post('/detect', async (req, res) => {
  try {
    const { chartData, prices, pair, timeframe } = req.body;

    if (!chartData && !prices) {
      return res.status(400).json({
        error: 'Either chartData or prices is required'
      });
    }

    const entries = assistant.detectAIEntries(chartData || { prices });

    res.json({
      success: true,
      signals: [
        {
          id: 1,
          pair: pair || 'BTC/USD',
          timeframe: timeframe || '4h',
          bias: 'BULLISH',
          entryZone: {
            min: 45000,
            max: 45500,
            optimal: 45250
          },
          targets: [
            { level: 46500, profit: 2.78, confidence: 95 },
            { level: 47500, profit: 5.56, confidence: 80 },
            { level: 49000, profit: 8.89, confidence: 60 }
          ],
          riskLevels: {
            stopLoss: 44500,
            riskAmount: 750
          },
          riskRewardRatio: '1:2.5',
          confidence: 85,
          strength: 'STRONG'
        }
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/entries/signals - Get active trading signals
router.get('/signals', async (req, res) => {
  try {
    const { pair, timeframe, limit = 10 } = req.query;

    res.json({
      success: true,
      signals: [
        {
          id: 1,
          pair: pair || 'BTC/USD',
          timeframe: timeframe || '4h',
          status: 'ACTIVE',
          bias: 'BULLISH',
          confidence: 85
        }
      ],
      totalActive: 1
    });
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/entries/:id - Get detailed signal information
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      signal: {
        id: parseInt(id),
        pair: 'BTC/USD',
        timeframe: '4h',
        bias: 'BULLISH',
        confidence: 85,
        status: 'ACTIVE'
      }
    });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
