

// Simulated database to store watchlist data
const watchlistDatabase = [];//it needs to be the real datbase 

// Function to add a stock to the watchlist
function addToWatchlist(userId, stockSymbol) {
  // Check if the stock is already in the watchlist
  const existingItem = watchlistDatabase.find(
    (item) => item.userId === userId && item.stockSymbol === stockSymbol
  );

  if (existingItem) {
    return false; // Stock already in the watchlist
  }

  // Add the stock to the watchlist
  watchlistDatabase.push({ userId, stockSymbol });
  return true; // Stock added to the watchlist
}

// Function to remove a stock from the watchlist
function removeFromWatchlist(userId, stockSymbol) {
  // Find the index of the stock in the watchlist
  const index = watchlistDatabase.findIndex(
    (item) => item.userId === userId && item.stockSymbol === stockSymbol
  );

  if (index === -1) {
    return false; // Stock not found in the watchlist
  }

  // Remove the stock from the watchlist
  watchlistDatabase.splice(index, 1);
  return true; // Stock removed from the watchlist
}

// Function to get the user's watchlist
function getUserWatchlist(userId) {
  // Filter watchlist items by user ID
  const userWatchlist = watchlistDatabase.filter((item) => item.userId === userId);
  return userWatchlist.map((item) => item.stockSymbol);
}

module.exports = {
  addToWatchlist,
  removeFromWatchlist,
  getUserWatchlist,
};
