-- Table for user data
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

-- Table for stock data
CREATE TABLE stocks (
  id INT SERIAL PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL UNIQUE,
);

-- Table to associate users with stocks in their watchlist
CREATE TABLE user_watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  stock_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (stock_id) REFERENCES stocks(id)
);