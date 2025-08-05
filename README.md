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

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with your MongoDB connection string:
```
MONGO_URI=mongodb://localhost:27017/store-management
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/alerts/low-stock` - Get low stock products

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `GET /api/sales/:id` - Get sale by ID

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/role/:role` - Get employees by role

## Usage Guide

### Adding Products
1. Navigate to the Products page
2. Click "Add Product"
3. Fill in product details including name, description, price, quantity, and category
4. Set a low stock threshold (default: 5)
5. Click "Add" to save

### Creating Sales
1. Navigate to the Sales page
2. Click "New Sale"
3. Select an employee
4. Add products to the sale with quantities
5. Apply discounts and taxes if needed
6. Choose payment method
7. Click "Complete Sale"

### Managing Employees
1. Navigate to the Employees page
2. Click "Add Employee"
3. Fill in employee details including name, email, phone, role, and salary
4. Click "Add" to save

### Monitoring Low Stock
1. Check the Alerts page for low stock items
2. The navigation bar shows the count of low stock items
3. Click "Update Stock" on any item to replenish inventory

## Database Schema

### Product Schema
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  quantity: Number (required),
  category: String (required),
  lowStockThreshold: Number (default: 5),
  isLowStock: Boolean (default: false)
}
```

### Sale Schema
```javascript
{
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  discount: Number,
  tax: Number,
  finalAmount: Number,
  employeeId: ObjectId (ref: Employee),
  customerName: String,
  saleDate: Date,
  paymentMethod: String
}
```

### Employee Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  role: String (required, enum),
  salary: Number (required),
  hireDate: Date,
  isActive: Boolean,
  address: String,
  emergencyContact: String
}
```

## Features in Detail

### Real-time Low-stock Alerts
- Products are automatically flagged when stock falls below the threshold
- Visual indicators in the products table
- Dedicated alerts page with color-coded severity levels
- Quick stock update functionality
- Dashboard integration with alert counts

### Sales Processing
- Multi-item sales with automatic price calculation
- Stock validation to prevent overselling
- Automatic stock updates after successful sales
- Employee assignment for accountability
- Flexible payment methods

### Employee Management
- Complete employee profiles with contact information
- Role-based system with different access levels
- Salary tracking and management
- Active/inactive status tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 