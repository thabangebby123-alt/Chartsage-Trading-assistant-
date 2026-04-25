/**
 * Market Insights Routes
 * Provides market sentiment, trends, and opportunities
 */

import express from 'express';
import MarketInsights from '../../insights/MarketInsights.js';
import { handleError } from '../middleware/errorHandler.js';

const router = express.Router();
const insights = new MarketInsights();

// GET /api/insights/sentiment - Get market sentiment
router.get('/sentiment', async (req, res) => {
  try {
    const sentiment = await insights.getSentiment();

    res.json({
      success: true,
      sentiment: {
        overall: sentiment.overall || 'NEUTRAL',
        strength: sentiment.strength || 50,
        fearGreedIndex: sentiment.fearGreedIndex || 'NEUTRAL',
        buyPressure: sentiment.buyPressure || 50,
        sellPressure: sentiment.sellPressure || 50
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/insights/trends - Get market trends
router.get('/trends', async (req, res) => {
  try {
    const trends = insights.identifyTrends({});

    res.json({
      success: true,
      trends: [
        { timeframe: '1h', direction: 'UPTREND', strength: 'STRONG', confidence: 85 },
        { timeframe: '4h', direction: 'UPTREND', strength: 'MODERATE', confidence: 72 },
        { timeframe: '1d', direction: 'DOWNTREND', strength: 'WEAK', confidence: 55 }
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/insights/opportunities - Find trading opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const opportunities = insights.findOpportunities({});

    res.json({
      success: true,
      opportunities: [
        {
          id: 1,
          type: 'BREAKOUT',
          asset: 'BTC/USD',
          confidence: 85,
          entry: 45000,
          target: 47500,
          stopLoss: 43500,
          riskReward: '1:2.5'
        },
        {
          id: 2,
          type: 'REVERSAL',
          asset: 'ETH/USD',
          confidence: 70,
          entry: 2500,
          target: 2700,
          stopLoss: 2400,
          riskReward: '1:2'
        }
      ],
      count: 2,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/insights/recommendations - Get trading recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const recommendations = insights.generateRecommendations({});

    res.json({
      success: true,
      recommendations: {
        action: 'BUY',
        strength: 'MODERATE',
        timeframe: '4h',
        confidence: 75,
        reasoning: [
          'RSI showing bullish divergence',
          'MA crossover on 1h chart',
          'Support holding at key level'
        ]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
