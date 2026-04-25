/**
 * Technical Analysis Routes
 * Calculates indicators and identifies trading levels
 */

import express from 'express';
import TechnicalAnalysis from '../../analysis/TechnicalAnalysis.js';
import { handleError } from '../middleware/errorHandler.js';

const router = express.Router();

// POST /api/analysis/technical - Perform technical analysis
router.post('/technical', async (req, res) => {
  try {
    const { prices, pair, timeframe } = req.body;

    if (!prices || !Array.isArray(prices) || prices.length < 20) {
      return res.status(400).json({
        error: 'Prices array required with at least 20 data points'
      });
    }

    // Calculate indicators
    const ma20 = TechnicalAnalysis.calculateMA(prices, 20);
    const ma50 = TechnicalAnalysis.calculateMA(prices, 50);
    const ema12 = TechnicalAnalysis.calculateEMA(prices, 12);
    const rsi = TechnicalAnalysis.calculateRSI(prices, 14);
    const macd = TechnicalAnalysis.calculateMACD(prices);
    const bollingerBands = TechnicalAnalysis.calculateBollingerBands(prices, 20, 2);
    const { support, resistance } = TechnicalAnalysis.identifyLevels(prices);

    res.json({
      success: true,
      pair,
      timeframe,
      analysis: {
        movingAverages: {
          ma20: ma20[ma20.length - 1],
          ma50: ma50[ma50.length - 1],
          ema12: ema12[ema12.length - 1]
        },
        rsi: {
          value: rsi[rsi.length - 1],
          overbought: rsi[rsi.length - 1] > 70,
          oversold: rsi[rsi.length - 1] < 30
        },
        macd: {
          line: macd.macd[macd.macd.length - 1],
          signal: macd.signal[macd.signal.length - 1],
          histogram: macd.histogram[macd.histogram.length - 1]
        },
        bollingerBands: {
          upper: bollingerBands[bollingerBands.length - 1].upper,
          middle: bollingerBands[bollingerBands.length - 1].middle,
          lower: bollingerBands[bollingerBands.length - 1].lower
        },
        support,
        resistance,
        currentPrice: prices[prices.length - 1]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/analysis/indicators - Calculate specific indicators
router.post('/indicators', async (req, res) => {
  try {
    const { prices, indicators } = req.body;

    if (!prices || !Array.isArray(prices)) {
      return res.status(400).json({
        error: 'Prices array is required'
      });
    }

    const results = {};

    // Calculate requested indicators
    if (indicators.includes('MA')) {
      results.ma20 = TechnicalAnalysis.calculateMA(prices, 20);
      results.ma50 = TechnicalAnalysis.calculateMA(prices, 50);
    }
    if (indicators.includes('RSI')) {
      results.rsi = TechnicalAnalysis.calculateRSI(prices, 14);
    }
    if (indicators.includes('MACD')) {
      results.macd = TechnicalAnalysis.calculateMACD(prices);
    }
    if (indicators.includes('BB')) {
      results.bollingerBands = TechnicalAnalysis.calculateBollingerBands(prices);
    }
    if (indicators.includes('LEVELS')) {
      results.levels = TechnicalAnalysis.identifyLevels(prices);
    }

    res.json({
      success: true,
      indicators: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/analysis/levels - Get support/resistance levels
router.get('/levels', async (req, res) => {
  try {
    const { prices } = req.query;

    if (!prices) {
      return res.status(400).json({
        error: 'Prices parameter is required'
      });
    }

    const priceArray = JSON.parse(prices);
    const { support, resistance } = TechnicalAnalysis.identifyLevels(priceArray);

    res.json({
      success: true,
      support,
      resistance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
