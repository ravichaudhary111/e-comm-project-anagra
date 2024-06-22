const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM products');
  return result.rows;
};

module.exports = {
  getAllProducts,
};
