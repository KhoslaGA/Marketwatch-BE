const db = require("../db/connection");

async function addToWatchlist(userId, stockSymbol) {
  try {
    // First, find the stock_id for the given stockSymbol from the stocks table
    const stockQuery = 'SELECT id FROM stocks WHERE symbol = $1';
    const stockValues = [stockSymbol];
    const stockResult = await db.query(stockQuery, stockValues);

    if (stockResult.rows.length === 0) {
      throw new Error('Stock not found');
    }

    const stockId = stockResult.rows[0].id;

    // Now, insert the stock into the user's watchlist
    const query = 'INSERT INTO user_watchlist (user_id, stock_id) VALUES ($1, $2) RETURNING *';
    const values = [userId, stockId];

    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error('Error adding stock to watchlist: ' + error.message);
  }
}

async function removeFromWatchlist(userId, stockSymbol) {
  try {
    // First, find the stock_id for the given stockSymbol from the stocks table
    const stockQuery = 'SELECT id FROM stocks WHERE symbol = $1';
    const stockValues = [stockSymbol];
    const stockResult = await db.query(stockQuery, stockValues);

    if (stockResult.rows.length === 0) {
      throw new Error('Stock not found');
    }

    const stockId = stockResult.rows[0].id;

    // Now, delete the stock from the user's watchlist
    const query = 'DELETE FROM user_watchlist WHERE user_id = $1 AND stock_id = $2';
    const values = [userId, stockId];

    const result = await db.query(query, values);
    return result.rowCount > 0; // Return true if a row was deleted, false if not found
  } catch (error) {
    throw new Error('Error removing stock from watchlist: ' + error.message);
  }
}

async function getUserWatchlist(userId) {
  try {
    // Fetch the list of stock symbols in the user's watchlist
    const query = `
      SELECT s.symbol
      FROM user_watchlist uw
      JOIN stocks s ON uw.stock_id = s.id
      WHERE uw.user_id = $1
    `;
    const values = [userId];

    const result = await db.query(query, values);
    return result.rows.map((item) => item.symbol);
  } catch (error) {
    throw new Error('Error fetching user watchlist: ' + error.message);
  }
}

module.exports = {
  addToWatchlist,
  removeFromWatchlist,
  getUserWatchlist,
};
