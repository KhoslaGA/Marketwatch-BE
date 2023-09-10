const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// RapidAPI Key (replace with your RapidAPI key)
const apiKey = 'YOUR_RAPIDAPI_KEY';

// Route to get stock data by ticker symbol
app.get('/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    // Fetch stock data from Yahoo Finance API
    const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/yahoo/quote/${symbol}`, {
      headers: {
        'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com',
        'X-RapidAPI-Key': "976181ede8msh8db849df77064aep11246cjsn64c186ae1e1a",
      },
    });

    const stockData = response.data;

    if (!stockData || !stockData.symbol) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }

    // Extract relevant data (e.g., price, price change, 52-week high/low, market cap)
    const price = stockData.regularMarketPrice;
    const priceChange = stockData.regularMarketChange;
    const week52High = stockData.fiftyTwoWeekHigh;
    const week52Low = stockData.fiftyTwoWeekLow;
    const marketCap = stockData.marketCap;

    // Return the stock data
    res.json({
      symbol,
      price,
      priceChange,
      week52High,
      week52Low,
      marketCap,
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});

