-- Table for stock data
CREATE TABLE stocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  price_change DECIMAL(10, 2) NOT NULL,
  week52_high DECIMAL(10, 2) NOT NULL,
  week52_low DECIMAL(10, 2) NOT NULL
);
