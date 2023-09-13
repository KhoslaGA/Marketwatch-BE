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

router.post('/signup', async (req, res) => {
  // Extract user registration data from the request body
  const { username, email, password } = req.body;

  // Validation logic to ensure all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if the user with the provided email already exists
  const queryStr = 'SELECT * FROM users WHERE email = $1;';
  const params = [email];

  try {
    const { rows } = await Db.query(queryStr, params);
    const existingUser = rows[0];

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // If the email is unique, proceed to create a new user
    const insertQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;';

    const newUser = [username, email, password];
    const { rows: insertedUserRows } = await Db.query(insertQuery, newUser);
    const registeredUser = insertedUserRows[0];

    // You can send a success message or redirect to a login page
    return res.status(201).json({ message: 'User registered successfully', user: registeredUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// User Login
router.get('/login', (req, res) => {
  // Render the login form once it's created
  res.render('login');
});

router.post('/login', async(req, res) => {
  // Handle user login logic
  const { username, password } = req.body;
  console.log(username)
  console.log(password)


  //Validate the input fields
  if (!username || !password) {
    res.json({error: 'Username and password are required'})
  }

  // Simulate user authentication
  const queryStr = `Select * from users WHERE username = $1;`;
  const params = [username];
  
  const {rows} = await Db.query(queryStr, params);
  const user = rows[0]
console.log(user)
  if (!user) {
    return res.json({ error: 'Invalid username or password' })
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
