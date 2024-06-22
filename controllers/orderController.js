const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const crypto = require('crypto');
const axios = require('axios');

const generateHash = (data, salt) => {
  const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
};

const createOrder = async (req, res) => {
  const { product_id, quantity, firstname, email, phone } = req.body;
  try {
    const productResult = await productModel.getAllProducts();
    const product = productResult.find((p) => p.id == product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const price = product.price;
    const total_price = price * quantity;

    const orderData = {
      key: process.env.PAYU_KEY,
      txnid: crypto.randomBytes(16).toString('hex'),
      amount: total_price.toString(),
      productinfo: product.name,
      firstname,
      email,
      phone,
    };
    orderData.hash = generateHash(orderData, process.env.PAYU_SALT);

    // PayU payment request
    const response = await axios.post('https://secure.payu.in/_payment', null, {
      params: orderData,
    });

    await orderModel.createOrder(product_id, quantity, total_price, orderData.txnid);
    res.status(201).json({ message: 'Order created', paymentUrl: response.request.res.responseUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const handlePayUWebhook = async (req, res) => {
  const { mihpayid, status, txnid, hash } = req.body;

  const hashString = `${process.env.PAYU_SALT}|${status}|${mihpayid}|${txnid}`;
  const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

  if (calculatedHash !== hash) {
    return res.status(400).json({ error: 'Invalid hash' });
  }

  if (status === 'success') {
    // Update order status in the database
    await orderModel.updateOrderStatus(txnid, 'completed');
  } else {
    await orderModel.updateOrderStatus(txnid, 'failed');
  }

  res.status(200).json({ message: 'Webhook received' });
};

module.exports = {
  createOrder,
  getAllOrders,
  handlePayUWebhook,
};
