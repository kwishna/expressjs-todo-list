const { Sequelize } = require('sequelize');


/**
* Creates a new Sequelize instance with a SQLite database connection.
* The database file is stored in the 'database.sqlite' file.
*/
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Sync models with the database
/**
* Synchronizes the database by creating tables if they don't already exist.
* This function is executed immediately when the module is loaded.
* If an error occurs during synchronization, it will be logged to the console.
*/
(async () => {
  try {
    await sequelize.sync(); // This will create tables if they don't exist
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();

/**
* Truncates all tables in the database by looping through all models and calling the `truncate` method on each one.
* This will delete all data from the database and reset any auto-incrementing IDs.
* Use this function with caution, as it will permanently delete all data.
*/
async function truncateDatabase() {
  try {
    // Get all models from your Sequelize instance
    const models = Object.values(sequelize.models);

    // Loop through each model and truncate its table
    for (const model of models) {
      await model.truncate({ cascade: true, restartIdentity: true });
    }

    console.log('Database truncated successfully');
  } catch (error) {
    console.error('Error truncating database:', error);
  }
}

// truncateDatabase().then();


module.exports = sequelize;
