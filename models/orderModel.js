const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createOrder = async (product_id, quantity, total_price, txnid) => {
  await pool.query('INSERT INTO orders (product_id, quantity, total_price, txnid) VALUES ($1, $2, $3, $4)', [product_id, quantity, total_price, txnid]);
};

const getAllOrders = async () => {
  const result = await pool.query('SELECT * FROM orders');
  return result.rows;
};

const updateOrderStatus = async (txnid, status) => {
  await pool.query('UPDATE orders SET status = $1 WHERE txnid = $2', [status, txnid]);
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
};
