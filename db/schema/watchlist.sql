-- Table to associate users with stocks in their watchlist
CREATE TABLE user_watchlist (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  stock_id INT REFERENCES stocks(id)
);