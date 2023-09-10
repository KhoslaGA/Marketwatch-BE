-- Table for stock data
CREATE TABLE stocks (
  id INT SERIAL PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL UNIQUE,
);
