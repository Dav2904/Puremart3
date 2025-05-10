import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderDetails } = location.state || {};

  const handleBackToShopping = () => {
    navigate('/products');
  };

  if (!orderId || !orderDetails) {
    return (
      <div className="order-success error">
        <h2>Order Information Not Found</h2>
        <button 
          className="back-to-shopping-btn"
          onClick={handleBackToShopping}
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="order-success">
      <div className="order-success-icon">✓</div>
      <h2>Order Placed Successfully!</h2>
      <p>Thank you for your purchase. Your order has been received.</p>
      <p className="order-id">Order ID: <span>{orderId}</span></p>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="order-items">
          {orderDetails.items.map((item) => (
            <div key={item.productId} className="order-item">
              <span>{item.name} x {item.quantity}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="order-total">
          <strong>Total Amount: ${orderDetails.totalAmount.toFixed(2)}</strong>
        </div>
      </div>
      <p>We've sent a confirmation email with your order details.</p>
      <button 
        className="back-to-shopping-btn"
        onClick={handleBackToShopping}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccess;