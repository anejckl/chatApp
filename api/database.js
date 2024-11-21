/*const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// TODO: Remove for production
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log('✅ Successfully connected to the MySQL database.');
    connection.release();
  } catch (error) {
    console.error('❌ Failed to connect to the MySQL database:', error.message);
    process.exit(1);
  }
};

testConnection();
module.exports = pool;*/