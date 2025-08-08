# Store Management System

A comprehensive MERN stack application for managing store operations including product inventory, sales transactions, employee management, and real-time low-stock alerts.

## Features

### 1. Product Management
- **Add/Update/Delete Products**: Full CRUD operations for product management
- **Low Stock Threshold**: Set custom thresholds for each product
- **Real-time Stock Tracking**: Automatic stock updates during sales
- **Category Management**: Organize products by categories

### 2. Sales Transactions
- **Create Sales**: Add multiple products to a sale with quantities
- **Employee Assignment**: Assign sales to specific employees
- **Discount & Tax**: Apply percentage-based discounts and taxes
- **Payment Methods**: Support for Cash, Card, and Mobile Payment
- **Automatic Stock Updates**: Stock levels update automatically after sales

### 3. Real-time Low-stock Alerts
- **Automatic Detection**: Products below threshold are flagged automatically
- **Visual Alerts**: Color-coded alerts based on stock levels
- **Quick Stock Updates**: Update stock levels directly from alerts page
- **Dashboard Integration**: Alert count displayed in navigation

### 4. Employee Management
- **Employee Profiles**: Complete employee information including salary and role
- **Role-based System**: Cashier, Sales Associate, Manager, Store Owner
- **Salary Tracking**: Manage employee salaries
- **Contact Information**: Store employee contact and emergency details

## Technology Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Additional**: Axios for API calls, React Router for navigation
