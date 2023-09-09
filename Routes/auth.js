const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
const router = express.Router();
const axios = require('axios')
const Db = require("../db/connection")


app.use(express.urlencoded({ extended: true }));
app.use(passport.session());


// User Registration
router.get('/signup', (req, res) => {
  // once we create a sign up form prob sigUp.ejs
  res.render('signup');
});

router.post('/signup', (req, res) => {
  // for user registration logic
  const { username, email, password } = req.body;
// validation logic
  if (!username || !email || !password) {
    // If any required field is missing, display an error message to the user
    // return res.render('signup', { error: 'All fields are required' });
    res.json({error: 'All fields are required'})
  }

  const newUser = {
    username,
    email,
    password
  };
  
  res.redirect('/dashboard');
});

const users = [
  { email: 'user1@example.com', password: 'password123' },
  { email: 'user2@example.com', password: 'secret456' },
  { email: 'user3@example.com', password: 'mysecurepass' }
];
// User Login
router.get('/login', (req, res) => {
  // Render the login form once it's created
  res.render('login');
});

router.post('/login', async(req, res) => {
  // Handle user login logic
  const { email, password } = req.body;

  //Validate the input fields
  if (!email || !password) {
    res.json({error: 'Email and password are required'})
  }

  // Simulate user authentication
  //const user = users.find(u => u.email === email && u.password === password);
  const queryStr = `Select * from users WHERE email = $1;`;
  const params = [email];
  
  const {rows} = await Db.query(queryStr, params);
  const user = rows[0]
  if (!user) {
    return res.json({ error: 'Invalid email or password' })
  }
  return res.status(200).json(user)
});

// User Logout
router.get('/logout', (req, res) => {
  // Handle user logout logic
  req.session.destroy(); 
  // Redirect to the login page after logout
  res.redirect('/login');
});

const Watchlist = require('../models/Watchlist'); // Roy replace withwhatever our watchlist route and file will be


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
