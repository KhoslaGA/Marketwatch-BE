const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
const router = express.Router();
const axios = require('axios')


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
    return res.render('signup', { error: 'All fields are required' });
    // res.json({})
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

router.post('/login', (req, res) => {
  // Handle user login logic
  const { email, password } = req.body;

  //Validate the input fields
  if (!email || !password) {
    res.json({error: 'Email and password are required'})
  }

  // Simulate user authentication
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Successful login
    // should we use a session or token here to indicate that the user is authenticated?
    req.session.user = user; // not sure if this is necessary, cuz i might need to a package for this 
    // Redirect to user dashboard or desired or homepage, depends on what we decide
    return res.redirect('/dashboard'); 
  } else {
    // Failed login
    res.json({ error: 'Invalid email or password' })

  }
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
