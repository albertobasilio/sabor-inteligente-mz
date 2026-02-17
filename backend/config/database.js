const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sabor_inteligente',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('✅ Base de dados MySQL conectada com sucesso!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar à base de dados:', err.message);
  });

module.exports = pool;
