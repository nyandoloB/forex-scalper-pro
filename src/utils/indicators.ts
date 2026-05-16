/**
 * Technical Indicators Calculations
 * EMA 200, RSI 14, Fibonacci, Williams' Alligator
 */

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface IndicatorValues {
  ema200: number;
  rsi14: number;
  fibonacciLevels: FibonacciLevel[];
  alligator: AlligatorIndicator;
  atr: number;
  trendLine: TrendLine;
  projectedTrendLength: number;
}

export interface FibonacciLevel {
  level: number;
  value: number;
  label: string;
}

export interface AlligatorIndicator {
  jaw: number;
  teeth: number;
  lips: number;
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface TrendLine {
  slope: number;
  intercept: number;
  trend: 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS';
  angle: number;
}

/**
 * Calculate Exponential Moving Average (EMA)
 */
export function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];

  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;

  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }

  return ema;
}

/**
 * Calculate Relative Strength Index (RSI)
 */
export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const gains = changes.filter(c => c > 0).slice(-period);
  const losses = changes.filter(c => c < 0).slice(-period).map(c => Math.abs(c));

  const avgGain = gains.reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

/**
 * Calculate Fibonacci Retracement Levels
 */
export function calculateFibonacciLevels(candles: Candle[]): FibonacciLevel[] {
  if (candles.length < 2) return [];

  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const maxHigh = Math.max(...highs);
  const minLow = Math.min(...lows);
  const range = maxHigh - minLow;

  const levels = [0.236, 0.382, 0.5, 0.618, 0.786];
  const fibLevels: FibonacciLevel[] = [];

  levels.forEach(level => {
    fibLevels.push({
      level,
      value: maxHigh - range * level,
      label: `${(level * 100).toFixed(1)}%`,
    });
  });

  return fibLevels;
}

/**
 * Calculate Williams' Alligator
 * Alligator Jaw = SMA(13, offset by 8 bars)
 * Alligator Teeth = SMA(8, offset by 5 bars)
 * Alligator Lips = SMA(5, offset by 3 bars)
 */
export function calculateAlligator(candles: Candle[]): AlligatorIndicator {
  if (candles.length < 13) {
    return { jaw: 0, teeth: 0, lips: 0, signal: 'NEUTRAL' };
  }

  const closes = candles.map(c => c.close);
  const jaw = simpleMovingAverage(closes, 13);
  const teeth = simpleMovingAverage(closes, 8);
  const lips = simpleMovingAverage(closes, 5);

  let signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';

  if (lips > teeth && teeth > jaw) {
    signal = 'BULLISH';
  } else if (lips < teeth && teeth < jaw) {
    signal = 'BEARISH';
  }

  return { jaw, teeth, lips, signal };
}

/**
 * Calculate Simple Moving Average (SMA)
 */
function simpleMovingAverage(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b) / period;
}

/**
 * Calculate Average True Range (ATR)
 */
export function calculateATR(candles: Candle[], period: number = 14): number {
  if (candles.length < period) return 0;

  let trueRanges: number[] = [];

  for (let i = 0; i < candles.length; i++) {
    const current = candles[i];
    const previous = i > 0 ? candles[i - 1] : current;

    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - previous.close),
      Math.abs(current.low - previous.close)
    );
    trueRanges.push(tr);
  }

  return trueRanges.slice(-period).reduce((a, b) => a + b) / period;
}

/**
 * Calculate Trend Line
 */
export function calculateTrendLine(candles: Candle[]): TrendLine {
  if (candles.length < 2) {
    return { slope: 0, intercept: 0, trend: 'SIDEWAYS', angle: 0 };
  }

  const closes = candles.map(c => c.close);
  const n = closes.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  // Linear regression
  const xMean = indices.reduce((a, b) => a + b) / n;
  const yMean = closes.reduce((a, b) => a + b) / n;

  const numerator = indices.reduce(
    (sum, x, i) => sum + (x - xMean) * (closes[i] - yMean),
    0
  );
  const denominator = indices.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;
  const angle = Math.atan(slope) * (180 / Math.PI);

  let trend: 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS';
  if (slope > 0.0001) {
    trend = 'UPTREND';
  } else if (slope < -0.0001) {
    trend = 'DOWNTREND';
  } else {
    trend = 'SIDEWAYS';
  }

  return { slope, intercept, trend, angle };
}

/**
 * Calculate Projected Trend Length (bars until reversal)
 */
export function calculateProjectedTrendLength(
  candles: Candle[],
  atr: number
): number {
  if (candles.length < 5) return 0;

  const volatility = atr / candles[candles.length - 1].close;
  const projectedLength = Math.round(20 / (volatility + 0.001));

  return Math.max(5, Math.min(projectedLength, 100));
}

/**
 * Get all indicator values
 */
export function getAllIndicators(candles: Candle[]): IndicatorValues {
  const closes = candles.map(c => c.close);
  const ema200 = calculateEMA(closes, 200);
  const rsi14 = calculateRSI(closes, 14);
  const fibonacciLevels = calculateFibonacciLevels(candles);
  const alligator = calculateAlligator(candles);
  const atr = calculateATR(candles, 14);
  const trendLine = calculateTrendLine(candles);
  const projectedTrendLength = calculateProjectedTrendLength(candles, atr);

  return {
    ema200,
    rsi14,
    fibonacciLevels,
    alligator,
    atr,
    trendLine,
    projectedTrendLength,
  };
}
