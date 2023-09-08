const express = require("express");
const passport = require("passport");
const router = express.Router();
const axios = require("axios");

// News and Analysis (assumes use of external API)
router.get("/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  // Fetch relevant news and analysis for a specific stock symbol and send it to the client
  const options = {
    method: "GET",
    url: `https://yahoo-finance15.p.rapidapi.com/api/yahoo/ne/news/${symbol}`,
    headers: {
      "X-RapidAPI-Key": "976181ede8msh8db849df77064aep11246cjsn64c186ae1e1a",
      "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data.item.slice(0,3))
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
