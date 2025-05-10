import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { useOrders } from '../../context/OrderContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch('http://localhost:9000/products');
        const products = await productsResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:9000/categories');
        const categories = await categoriesResponse.json();

        // Fetch orders
        const ordersResponse = await fetch('http://localhost:9000/orders');
        const orders = await ordersResponse.json();

        // Calculate statistics
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          pendingOrders: pendingOrders,
          totalRevenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon products"></div>
          <h3>Total Products</h3>
          <div className="stat-value">{stats.totalProducts}</div>
          <Link to="/admin/products" className="view-all">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon categories"></div>
          <h3>Categories</h3>
          <div className="stat-value">{stats.totalCategories}</div>
          <Link to="/admin/categories" className="view-all">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders"></div>
          <h3>Total Orders</h3>
          <div className="stat-value">{stats.totalOrders}</div>
          <Link to="/admin/orders" className="view-all">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending"></div>
          <h3>Pending Orders</h3>
          <div className="stat-value">{stats.pendingOrders}</div>
          <Link to="/admin/orders" className="view-all">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue"></div>
          <h3>Total Revenue</h3>
          <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
          <Link to="#" className="view-details">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;