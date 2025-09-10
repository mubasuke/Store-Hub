const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send("Server is running!");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on port ${PORT}`)
        })
    })
    .catch((err) => console.log('MongoDB connection error:',err))

// Routes
const authRoutes = require('./routes/AuthRoute');
const storeRoutes = require('./routes/StoreRoute');
const productRoutes = require('./routes/ProductRoute');
const saleRoutes = require('./routes/SaleRoute');
const employeeRoutes = require('./routes/EmployeeRoute');
const customerRoutes = require('./routes/CustomerRoute');
const supplierRoutes = require('./routes/SupplierRoute');

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Store routes
app.use('/api/stores', storeRoutes);

// Protected routes
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);