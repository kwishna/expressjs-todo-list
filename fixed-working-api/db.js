const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Sync models with the database
(async () => {
  try {
    await sequelize.sync(); // This will create tables if they don't exist
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();

module.exports = sequelize;
