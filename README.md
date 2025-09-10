# Store Management System

A comprehensive MERN stack application for managing store operations including product inventory, sales transactions, employee management, customer loyalty programs, and real-time analytics.

## Features

### 1. Product Management
- **Add/Update/Delete Products**: Full CRUD operations for product management
- **Product Search**: Search products by name, description, category, or supplier
- **Low Stock Threshold**: Set custom thresholds for each product
- **Real-time Stock Tracking**: Automatic stock updates during sales
- **Category Management**: Organize products by categories
- **Supplier Integration**: Link products to suppliers

### 2. Real-time Low-stock Alerts
- **Automatic Detection**: Products below threshold are flagged automatically
- **Visual Alerts**: Color-coded alerts based on stock levels (Critical, Warning, Info)
- **Quick Stock Updates**: Update stock levels directly from alerts page
- **Dashboard Integration**: Alert count displayed in navigation
- **Severity Levels**: Different alert types based on stock levels

### 3. Store Employee Information
- **Employee Profiles**: Complete employee information including salary and role
- **Role-based System**: Cashier, Sales Associate, Manager, Store Owner
- **Salary Tracking**: Manage employee salaries and payroll
- **Contact Information**: Store employee contact and emergency details
- **Employee Directory**: Search and manage all store employees

### 4. Create and Process Sales
- **Create Sales**: Add multiple products to a sale with quantities
- **Customer Selection**: Choose from loyalty program customers or walk-in customers
- **Discount & Tax**: Apply percentage-based discounts and taxes
- **Payment Methods**: Support for Cash, Card, and Mobile Payment
- **Automatic Stock Updates**: Stock levels update automatically after sales
- **Loyalty Integration**: Automatic point calculation and redemption

### 5. Customer Database with Loyalty Tracking
- **Customer Profiles**: Complete customer information management
- **Loyalty Points System**: Earn points based on purchase amount and membership level
- **Membership Tiers**: Bronze, Silver, Gold, Platinum based on total spending
- **Discount Eligibility**: Threshold-based discounts (100, 250, 500, 1000 points)
- **Point Redemption**: Customers can redeem points for percentage discounts
- **Purchase History**: Track all customer transactions and spending patterns

### 6. Supplier Management
- **Supplier Directory**: Complete supplier information management
- **Payment Terms**: Track different payment arrangements (Net 15, Net 30, etc.)
- **Supplier Search**: Find suppliers by name, contact, or payment terms
- **Product Integration**: Link products to suppliers
- **Active Status**: Manage active/inactive suppliers

### 7. Visual Analytics Dashboard
- **Revenue Chart**: Interactive line chart showing last 7 days of sales
- **Key Metrics**: Total revenue, sales count, daily breakdowns
- **Summary Cards**: Visual representation of key business metrics
- **Real-time Updates**: Dashboard updates with new sales data
- **Responsive Design**: Works on all screen sizes

### 8. User Roles: Store Owner and Employee
- **Role-based Access Control**: Different permissions for owners vs employees
- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: Middleware protects routes based on user roles
- **Store Association**: Employees must belong to a store, owners create stores
- **Permission Matrix**: 
  - **Store Owners**: Full access to all features
  - **Employees**: Limited access (can make sales, view products, but restricted from admin functions)

### 9. Store Notes
- **Text Area**: Large multiline input for writing store notes
- **Dashboard Integration**: Located beside the revenue chart
- **Auto-save Ready**: Prepared for automatic note saving functionality
- **User-friendly**: Helpful placeholder text with suggestions

### 10. Dark Mode
- **System Detection**: Automatically detects user's system preference
- **LocalStorage Persistence**: Saves user's choice across sessions
- **CSS Variables**: Uses custom properties for consistent theming
- **Material-UI Integration**: Dynamic theme creation based on mode
- **Smooth Transitions**: CSS transitions for theme changes
- **Complete Coverage**: All components support both light and dark themes

## Technology Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Additional**: Axios for API calls, React Router for navigation
