const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const WebSocket = require('websocket').server;
const dotenv = require('dotenv');
const axios = require('axios');
const crypto = require('crypto');

dotenv.config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket({ httpServer: server });

app.use(cors());
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// WebSocket connections
const clients = [];

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  clients.push(connection);

  connection.on('close', () => {
    const index = clients.indexOf(connection);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

const broadcast = (message) => {
  clients.forEach((client) => {
    client.sendUTF(message);
  });
};

global.broadcast = broadcast;

// PayU webhook handler
app.post('/payu-webhook', async (req, res) => {
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
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
