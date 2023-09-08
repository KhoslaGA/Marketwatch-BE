
const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
const app = express();
const router = express.Router();
const stocksRoute = require('./Routes/stocks')
const axios = require('axios')
const db = require('./db/connection')


// app.set('view engine', 'ejs'); // Set the view engine to EJS
app.use(express.urlencoded({ extended: true }));
// app.use(passport.session());
app.use(express.json())
app.use('/stocks', stocksRoute)

// User Registration
app.get('/', (req, res) => {
  // once we create a sign up form prob sigUp.ejs
  return res.status(200).send({
    message: "Welcome Stock Market Watcher",
    date: new Date()
  })
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
