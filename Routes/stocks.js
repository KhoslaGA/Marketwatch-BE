const express = require('express');
// const app = express();
const router = express.Router();
const axios = require('axios');
const Watchlist = require('../models/Watchlist');


router.get('/', (req, res) => {
  // once we create a sign up form prob sigUp.ejs
  return res.status(200).send({
    message: "Stock Api", 
    date: new Date()})
});

router.post('/', (req, res) => {
  const payload = req.body
  console.log('payLoad+++', payload)
  return res.status(200).send({
    message: "Stock Api", 
    payload,
    date: new Date()})
});


// Personalized Watchlist
router.get('/watchlist', async(req, res) => {
  try {
    // Fetch the user's watchlist data from the database 
    const userWatchlist = Watchlist.getUserWatchlist(req.session.user.id); // Authentication middleware might be needed, not sure
    
    // we should ender the watchlist view and pass the watchlist data to it
    // res.render('watchlist', { watchlist: userWatchlist });
    // res.render('watchlist', { watchlist: userWatchlist });
    res.json({watchlist: userWatchlist})
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the watchlist');
  }
});

router.post('/watchlist/add', async (req, res) => {
  try {
    const { userId, stockSymbol } = req.body;

    // Validate input (userId should be taken from the authenticated user)
    if (!userId || !stockSymbol) {
      return res.status(400).send('User ID and stock symbol are required.');
    }

    // Attempt to add the stock to the watchlist
    const added = Watchlist.addToWatchlist(userId, stockSymbol);

    if (added) {
      res.status(201).send('Stock added to watchlist successfully.');
    } else {
      res.status(400).send('Stock is already in the watchlist.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while adding the stock to the watchlist.');
  }
})

router.delete('/watchlist/:stockSymbol', async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from authentication
    const stockSymbol = req.params.stockSymbol;

    // Attempt to remove the stock from the watchlist
    const removed = Watchlist.removeFromWatchlist(userId, stockSymbol);

    if (removed) {
      res.status(200).send('Stock removed from watchlist successfully.');
    } else {
      res.status(404).send('Stock not found in the watchlist.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while removing the stock from the watchlist.');
  }
});

// Real-time Stock Data (assuming we have an external API)
router.get('/stocks/:symbol', async(req, res) => {
  // Fetch real-time stock data for a specific symbol and send it to the client
  try {
    const symbol = req.params.symbol;
    const apiKey = 'Z4PLTHRx0WsPbfphqaCpPHlA3rombvDJ'; 
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2023-07-17/2023-09-07?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

    // Fetch real-time stock data from the external API
    const response = await axios.get(apiUrl);

    // Send the fetched data to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching real-time stock data.');
  }
});

// Historical Data (assumes use of external API)
router.get('/history/:symbol', async(req, res) => {
  // Fetch historical stock data for a specific symbol and send it to the client
  try {
    const symbol = req.params.symbol;
    const apiKey = 'Z4PLTHRx0WsPbfphqaCpPHlA3rombvDJ'; 
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2023-07-17/2023-09-07?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`; 

    // Fetch historical stock data from the external API
    const response = await axios.get(apiUrl);

    // Send the fetched data to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching historical stock data.');
  }
});

// Performance Comparisons (assumes watchlist comparison feature)
router.get('/compare/:symbols', async(req, res) => {
  // Compare performance of stocks based on provided symbols and time frame
  try {
    const symbolList = req.params.symbols.split(','); // Split the symbols into an array
    const apiKey = 'Z4PLTHRx0WsPbfphqaCpPHlA3rombvDJ'; 
    const baseUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2023-07-17/2023-09-07?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`; 
    
    // Fetch historical data for each symbol
    const historicalDataPromises = symbolList.map(symbol => {
      const apiUrl = `${baseUrl}/${symbol}?apiKey=${apiKey}`; // Adjust the URL structure based on our API
      return axios.get(apiUrl);
    });

    // Wait for all requests to complete
    const historicalDataResponses = await Promise.all(historicalDataPromises);

    // Process and calculate performance metrics (e.g., compare stock prices)

    // Send the comparison results to the client
    res.json({ comparisonData: "Our Comparison Data should be here" });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while comparing stock performance.');
  }
});

// app.listen(7001, () => {
//   console.log('Server is running on port 7001');
// });
module.exports = router;