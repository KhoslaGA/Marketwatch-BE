const express = require('express');
// const app = express();
const router = express.Router();
const axios = require('axios');
const Watchlist = require('../models/Watchlist');
const db = require('../db/connection')


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
    console.log("test session", req.session)
    const userWatchlist = Watchlist.getUserWatchlist(req.session.user.id); // Authentication middleware might be needed, not sure
    
    res.json({watchlist: userWatchlist})
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the watchlist');
  }
});

// router.post('/watchlist/add', async (req, res) => {
//   try {
//     const { userId, stockSymbol } = req.body;



//     // Validate input (userId should be taken from the authenticated user)
//     if (!userId || !stockSymbol) {
//       return res.status(400).send('User ID and stock symbol are required.');
//     }

//     // Attempt to add the stock to the watchlist
//     const added = await Watchlist.addToWatchlist(userId, stockSymbol);

//     if (added) {
//       res.status(201).send('Stock added to watchlist successfully.');
//     } else {
//       res.status(400).send('Stock is already in the watchlist.');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while adding the stock to the watchlist.');
//   }
// })

// router.delete('/watchlist/:stockSymbol/:id', async (req, res) => {
//   try {
//     console.log("req.body", req.body)
//     console.log("req.params", req.params)
//     console.log("req.query", req.query)

//     const userId = req.params.id; // Get the user ID from authentication
//     const stockSymbol = req.params.stockSymbol;

//     // Attempt to remove the stock from the watchlist
//     const removed = Watchlist.removeFromWatchlist(userId, stockSymbol);

//     if (removed) {
//       res.status(200).send('Stock removed from watchlist successfully.');
//     } else {
//       res.status(404).send('Stock not found in the watchlist.');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while removing the stock from the watchlist.');
//   }
// });

// Add stock to user watchlist
router.post('/watchlist/add', async (req, res) => {
  try {
    const { user_id, symbol } = req.body; 

    // Check if the stock exists in the stocks table
    const stockExists = await db.query('SELECT id FROM stocks WHERE symbol = $1', [symbol]);

    if (stockExists.rowCount === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    // Check if the stock is already in the user's watchlist
    const watchlistItemExists = await db.query('SELECT id FROM user_watchlist WHERE user_id = $1 AND stock_id = $2', [user_id, stockExists.rows[0].id]);

    if (watchlistItemExists.rowCount > 0) {
      return res.status(400).json({ error: 'Stock is already in the watchlist' });
    }

    // Insert the stock into the user's watchlist
    await db.query('INSERT INTO user_watchlist (user_id, stock_id) VALUES ($1, $2)', [user_id, stockExists.rows[0].id]);

    res.status(201).json({ message: 'Stock added to watchlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the stock to the watchlist' });
  }
});





// Remove stock from user watchlist
router.delete('/watchlist/remove/:user_id/:stock_id', async (req, res) => {
  try {
    const { user_id, stock_id } = req.params;

    // Check if the stock is in the user's watchlist
    const watchlistItemExists = await db.query('SELECT id FROM user_watchlist WHERE user_id = $1 AND stock_id = $2', [user_id, stock_id]);

    if (watchlistItemExists.rowCount === 0) {
      return res.status(404).json({ error: 'Stock not found in the watchlist' });
    }

    // Remove the stock from the user's watchlist
    await db.query('DELETE FROM user_watchlist WHERE user_id = $1 AND stock_id = $2', [user_id, stock_id]);

    res.status(200).json({ message: 'Stock removed from watchlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while removing the stock from the watchlist' });
  }
});


// Real-time Stock Data (assuming we have an external API)
router.get('/:symbol', async(req, res) => {
  // Fetch real-time stock data for a specific symbol and send it to the client
  try {
    const symbol = req.params.symbol;
    console.log("testing", symbol)
    const apiKey = 'Z4PLTHRx0WsPbfphqaCpPHlA3rombvDJ'; 
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`

    // Fetch real-time stock data from the external API
    const response = await axios.get(apiUrl);

    // Send the fetched data to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching real-time stock data.');
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


module.exports = router;