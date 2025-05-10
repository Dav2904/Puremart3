import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fix the formData initialization
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',  // Fixed the OR operator
    lastName: user?.name?.split(' ')[1] || '',   // Fixed the OR operator
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'credit',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'address', 'city', 'state', 'zipCode'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Payment method validation
    if (formData.paymentMethod === 'credit') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!formData.cardName) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please use MM/YY format';
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Fix the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const orderData = {
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        userId: user?.id || 'guest',
        email: formData.email,  // Add this line to include email
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
          quantity: item.quantity
        })),
        totalAmount: getCartTotal(),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        status: 'pending',
        orderDate: new Date().toISOString()
      };
  
      // Save order to database
      const response = await fetch('http://localhost:9000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to save order');
      }
  
      // Clear cart and navigate to success page
      clearCart();
      navigate('/order-success', { 
        state: { 
          orderId: orderData.id,
          orderDetails: orderData 
        }
      });
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToShopping = () => {
    navigate('/products');
  };
  
  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="order-success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order has been received.</p>
        <p className="order-id">Order ID: <span>{orderId}</span></p>
        <p>We've sent a confirmation email with your order details.</p>
        <button 
          className="back-to-shopping-btn"
          onClick={handleBackToShopping}
        >
          Continue Shopping
        </button>
      </div>
    );
  }
  
  if (cart.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Your cart is empty</h2>
        <p>Please add some products to your cart before proceeding to checkout.</p>
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
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      
      <div className="checkout-content">
        <div className="checkout-form-container">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., 1234567890"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
            <h2>Shipping Address</h2>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <div className="error-message">{errors.address}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <div className="error-message">{errors.city}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <div className="error-message">{errors.state}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={errors.zipCode ? 'error' : ''}
                  />
                  {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                <div className="payment-method">
                  <input
                    type="radio"
                    id="credit"
                    name="paymentMethod"
                    value="credit"
                    checked={formData.paymentMethod === 'credit'}
                    onChange={handleChange}
                  />
                  <label htmlFor="credit">Credit Card</label>
                </div>
                <div className="payment-method">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                  />
                  <label htmlFor="paypal">PayPal</label>
                </div>
                <div className="payment-method">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>
              </div>
              
              {formData.paymentMethod === 'credit' && (
                <div className="credit-card-details">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cardName">Name on Card</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={errors.cardName ? 'error' : ''}
                    />
                    {errors.cardName && <div className="error-message">{errors.cardName}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={errors.expiryDate ? 'error' : ''}
                      />
                      {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        className={errors.cvv ? 'error' : ''}
                      />
                      {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="order-items">
            {cart.map(item => {
              const itemPrice = item.discount 
                ? item.price * (1 - item.discount / 100) 
                : item.price;
              const itemTotal = itemPrice * item.quantity;
              
              return (
                <div className="order-item" key={item.id}>
                  <div className="order-item-info">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="order-item-price">
                    ${itemTotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="order-totals">
            <div className="order-total-row">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="order-total-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="order-total-row total">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
