
const express = require('express');
const cors = require('cors');
var cookieSession = require('cookie-session')

// const session = require('express-session');
// const passport = require('passport');
const app = express();
const router = express.Router();
const stocksRoute = require('./Routes/stocks')
const authRoute = require('./Routes/auth')
const axios = require('axios')
const db = require('./db/connection')
app.use(cors());
app.use(cookieSession({
  name: 'session',
  keys: ['hello'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


// app.set('view engine', 'ejs'); // Set the view engine to EJS
app.use(express.urlencoded({ extended: true }));
// app.use(passport.session());
app.use(express.json());
app.use('/stocks', stocksRoute);
app.use('/auth', authRoute);


// User Registration
app.get('/', (req, res) => {
  // once we create a sign up form prob sigUp.ejs
  return res.status(200).send({
    message: "Welcome Stock Market Watcher",
    date: new Date()
  })
});

app.get('/123', (req, res) => {
  console.log(req, "Request logged")
  return res.status(200)
});

app.get('/db', async (req, res) => {
  const queryStr = `SELECT * FROM USERS;`
  const { rows } = await db.query(queryStr)
  return res.status(200).send({
    message: "Stock Market users",
    date: new Date(),
    users: rows
  })
});

// const setDB = (req, res, next) => {
//   req.db = db;
//   next()
// }

// app.use(setDB())

app.post('/signup', (req, res) => {
  // for user registration logic
  const { username, email, password } = req.body;
  // validation logic
  if (!username || !email || !password) {
    // If any required field is missing, display an error message to the user
    return res.render('signup', { error: 'All fields are required' });
  }

  const newUser = {
    username,
    email,
    password
  };

  res.redirect('/dashboard');
});

app.get('/stock/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const stock = stockData[symbol];

  if (stock) {
    res.json(stock);
  } else {
    res.status(404).json({ error: 'Stock not found' });
  }
});

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



// const users = [
//   { email: 'user1@example.com', password: 'password123' },
//   { email: 'user2@example.com', password: 'secret456' },
//   { email: 'user3@example.com', password: 'mysecurepass' }
// ];
// User Login
// app.get('/login', (req, res) => {
//   // Render the login form once it's created
//   res.render('login');
// });

// app.post('/login', (req, res) => {
//   // Handle user login logic
//   const { email, password } = req.body;

//   //Validate the input fields
//   if (!email || !password) {
//     return res.render('login', { error: 'Email and password are required' });
//   }

//   // Simulate user authentication
//   const user = users.find(u => u.email === email && u.password === password);

//   if (user) {
//     // Successful login
//     // should we use a session or token here to indicate that the user is authenticated?
//     req.session.user = user; // not sure if this is necessary, cuz i might need to a package for this 
//     // Redirect to user dashboard or desired or homepage, depends on what we decide
//     return res.redirect('/dashboard');
//   } else {
//     // Failed login
//     return res.render('login', { error: 'Invalid email or password' });
//   }
// });



app.listen(7050, () => {
  console.log('Server is running on port 7050');
});
// module.exports = router;
