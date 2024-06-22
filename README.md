
### README.md

---

# E-commerce Angara Project Backend API

This repository contains the backend API for an E-commerce application built with Node.js, Express, and PostgreSQL. It includes endpoints for managing products, orders, and integrating with PayU payment gateway.

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ravichaudhary111/angaraProject.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following variables:

   ```plaintext
   DB_USER=your_db_user
   DB_HOST=your_db_host
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   PAYU_KEY=your_payu_key
   PAYU_SALT=your_payu_salt
   PORT=5000
   ```

   Replace `your_db_user`, `your_db_host`, `your_db_name`, `your_db_password` with your PostgreSQL database credentials. `your_payu_key` and `your_payu_salt` should be replaced with your PayU API credentials.

4. **Initialize the database:**

   - Create a PostgreSQL database and run the `init.sql` script located in `db/init.sql` to set up the necessary tables and initial data.

5. **Start the server:**

   ```bash
   npm start
   ```

   The server will start running on `http://localhost:5000` (or another port specified in your `.env` file).

## API Endpoints

### Products

- **GET /products**
  - Fetch all products.

### Orders

- **POST /orders**
  - Create a new order with PayU payment integration.

- **GET /orders**
  - Fetch all orders.

### PayU Integration

- **POST /payu-webhook**
  - Webhook endpoint to handle PayU payment status updates.

## Example API Usage

### Fetch all products

```bash
curl http://localhost:5000/products
```

### Create a new order

```bash
curl -X POST http://localhost:5000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2,
    "firstname": "John",
    "email": "john@example.com",
    "phone": "1234567890"
  }'
```

### Fetch all orders

```bash
curl http://localhost:5000/orders
```

### PayU Webhook (example payload)

```bash
curl -X POST http://localhost:5000/payu-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "mihpayid": "1234567890",
    "status": "success",
    "txnid": "TXN1234567890",
    "hash": "hash_generated_by_payu"
  }'
```

---
