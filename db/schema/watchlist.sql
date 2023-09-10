-- Table to associate users with stocks in their watchlist
CREATE TABLE user_watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  stock_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (stock_id) REFERENCES stocks(id)
);