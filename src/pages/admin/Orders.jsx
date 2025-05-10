import { useState, useEffect } from 'react';
import './Orders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add refresh interval
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:9000/orders');
        const data = await response.json();
        setOrders(data);
        // Update total orders count in dashboard
        const totalOrdersElement = document.querySelector('.total-orders');
        if (totalOrdersElement) {
          totalOrdersElement.textContent = data.length;
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrders();

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchOrders, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="admin-orders">
      <h2>Customer Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <span className={`status-badge ${order.status}`}>{order.status}</span>
            </div>
            <div className="order-details">
              <div className="customer-info">
                <h4>Customer Details</h4>
                <p>Name: {order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>Email: {order.email}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
                <p>Address: {order.shippingAddress.address}</p>
                <p>City: {order.shippingAddress.city}</p>
                <p>State: {order.shippingAddress.state}</p>
                <p>ZIP: {order.shippingAddress.zipCode}</p>
              </div>
              <div className="order-items">
                <h4>Order Items</h4>
                {order.items.map((item) => (
                  <div key={item.productId} className="order-item">
                    <p>{item.name} x {item.quantity}</p>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                ))}
                <div className="order-total">
                  <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                </div>
              </div>
            </div>
            <div className="order-footer">
              <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p>Payment Method: {order.paymentMethod}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;