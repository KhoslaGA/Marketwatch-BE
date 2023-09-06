const express = require('express');
const passport = require('passport');
const app = express();
const router = express.Router();
const axios = require('axios')


app.use(express.urlencoded({ extended: true }));



// News and Analysis (assumes use of external API)
router.get('/news/:symbol', async(req, res) => {
  // Fetch relevant news and analysis for a specific stock symbol and send it to the client
  try {
    const symbol = req.params.symbol;
    const apiKey = 'our_api_key'; // Replace with our actual API key
    const apiUrl = `https://api.example.com/news/${symbol}?apiKey=${apiKey}`; // Replace with the actual API URL

    // Fetch news and analysis data from the external API
    const response = await axios.get(apiUrl);

    // Send the fetched data to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching news and analysis data.');
  }

});


module.exports = router;
