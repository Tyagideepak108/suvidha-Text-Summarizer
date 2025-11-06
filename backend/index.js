// Express library  import
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const config = require('./config/config.json');
const db = require('./models');
const authRoutes = require('./routes/auth');
const summariesRoutes = require('./routes/summaries');

// Get environment
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Sequelize instance
let sequelize;
if (env === 'production' && process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      logging: false
    }
  );
}

// Express app 
const app = express();

// CORS enable 
app.use(cors());
app.use(express.json());

// Port set 
const PORT = process.env.PORT || 3002;

//Auth routes
app.use('/auth', authRoutes);

// Summaries routes
app.use('/summaries', summariesRoutes);

// /health route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running!' });
});

//Database connection test
app.get('/db-test', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'OK', message: 'Database connected!' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed!' });
  }
});



// start the server
app.listen(PORT, async () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  
  // Database connection test
  try {
    await sequelize.authenticate();
    console.log(`✅ Connection successful - PostgreSQL database connected! (${dbConfig.database})`);
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
  }
});