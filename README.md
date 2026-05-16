# 📊 Forex Scalper Pro

A professional-grade **forex scalping application** with precision trading signals powered by multiple technical indicators and audio alerts.

## ✨ Features

### 🎯 Technical Indicators
- **EMA 200** - Exponential Moving Average for trend confirmation
- **RSI 14** - Relative Strength Index (0-100) for overbought/oversold detection
- **Fibonacci Retracement** - 5 automatic support/resistance levels (23.6%, 38.2%, 50%, 61.8%, 78.6%)
- **Williams' Alligator** - Three-line indicator (Jaw, Teeth, Lips) for bullish/bearish trend confirmation
- **ATR** - Average True Range for volatility measurement

### 📈 Advanced Analysis
- **Trend Line Detection** - Automatic identification of UPTREND, DOWNTREND, or SIDEWAYS
- **Trend Angle Measurement** - Calculate the slope angle of current trend
- **Projected Trend Length** - Estimate bars until trend reversal based on volatility
- **Multi-Indicator Signal Confirmation** - Confidence scoring (0-100%)

### 🎛️ User Interface
- **Market Pair Selector** - 6 major forex pairs (EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD, NZDUSD)
- **Timeframe Picker** - 1m, 5m, 15m, 1h, 4h, 1d options
- **Professional Candlestick Chart** - Real-time charting with all indicators overlay
- **Signal Display Panel** - BUY/SELL signals with confidence levels and detailed reasons
- **Live Indicator Dashboard** - Real-time values for all technical indicators
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### 🔊 Audio & Vibration Alerts
- **BUY Alert** - Ascending tone (800Hz → 1200Hz) with haptic feedback
- **SELL Alert** - Descending tone (1200Hz → 800Hz) with haptic feedback
- **High Probability Alert** - Triple beep pattern for high-confidence signals (≥70%)
- **Audio Toggle** - Enable/disable from control panel
- **Device Vibration** - Haptic feedback on compatible devices
- **Web Audio API** - Cross-browser compatible

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/nyandoloB/forex-scalper-pro.git
cd forex-scalper-pro

# Install dependencies
npm install

# Start the development server
npm start

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
npm run build
```

## 📊 How to Use

1. **Select Market Pair** - Choose from 6 major forex pairs
2. **Choose Timeframe** - Pick your desired time interval (1m to 1d)
3. **Click Refresh** - Load market data and generate signals
4. **Enable Audio Alerts** - Toggle 🔊 to receive audio notifications
5. **Auto-Refresh** - Enable ▶ for continuous 1-minute monitoring
6. **Monitor Signals** - Watch for BUY/SELL signals with confidence percentages
7. **Review Analysis** - Read detailed indicator explanations

## 📊 Signal Generation

### Signal Strength Calculation

Signals are generated when multiple indicators align:

- **EMA 200 Position** (±15 points)
- **RSI Conditions** (±10-25 points)
  - Oversold (<30): +25 points
  - Overbought (>70): -25 points
- **Williams' Alligator** (±30 points)
  - Bullish alignment: +30 points
  - Bearish alignment: -30 points
- **Trend Direction** (±15 points)
  - Uptrend: +15 points
  - Downtrend: -15 points
- **Fibonacci Levels** (±12 points)
  - Near support: +12 points
  - Near resistance: -12 points

### Confidence Levels

- **HIGH** (70-100%) - Strong multi-indicator confirmation, high probability trade
- **MEDIUM** (50-69%) - Moderate confirmation, proceed with caution
- **LOW** (<50%) - Weak signals, wait for better setup

## 🔌 API Integration

The app uses **mock data by default** for immediate testing. To integrate real forex data:

### Supported APIs
- **Alpha Vantage** - Free tier: 5 calls/min
- **OANDA** - Professional broker with excellent API
- **IQFeed** - Premium market data
- **Tradingview** - Community data feeds
- Any REST API with historical OHLCV data

### Configuration

Update `.env` file:

```
REACT_APP_API_URL=https://your-api-endpoint.com/v1
REACT_APP_API_KEY=your-api-key-here
```

Update `src/utils/forexApi.ts` and modify the `fetchCandleData()` function:

```typescript
export async function fetchCandleData(
  pair: string,
  timeframe: string,
  limit: number = 100
): Promise<Candle[]> {
  // Implement your API call here
  const response = await fetch(
    `https://your-api.com/candles?symbol=${pair}&timeframe=${timeframe}&limit=${limit}`
  );
  const data = await response.json();
  return data.candles;
}
```

## 📁 Project Structure

```
forex-scalper-pro/
├── src/
│   ├── components/
│   │   ├── Chart.tsx          # Interactive candlestick chart
│   │   └── Chart.css          # Chart styling
│   ├── utils/
│   │   ├── indicators.ts      # EMA, RSI, Fibonacci, Alligator calculations
│   │   ├── signals.ts         # Signal generation engine
│   │   ├── audioAlert.ts      # Audio/vibration alert system
│   │   └── forexApi.ts        # Data fetching & forex pair management
│   ├── App.tsx                # Main application component
│   ├── App.css                # App styling
│   ├── index.tsx              # React entry point
│   └── index.css              # Global styles
├── public/
│   └── index.html             # HTML template
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🛠️ Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Lightweight Charts** - Professional charting library
- **Web Audio API** - Audio alert generation
- **Vibration API** - Device haptic feedback
- **CSS Grid/Flexbox** - Responsive design

## ⚠️ Disclaimer

This application is for **educational and testing purposes only**. It is **not financial advice**. 

**Important:**
- Always use proper risk management (1-2% per trade)
- Set stop losses on every trade
- Test strategies on demo accounts first
- Never risk more than you can afford to lose
- Consult with a financial advisor before trading with real money
- Past performance does not guarantee future results

## 📝 License

MIT License - feel free to use this project for educational and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for forex traders**

**Forex Scalper Pro** - Precision Trading Signals with Confidence
