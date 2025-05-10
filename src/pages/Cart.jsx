import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleApplyCoupon = () => {
    // This is a mock coupon validation
    // In a real app, you would validate this against a backend
    if (couponCode.toLowerCase() === 'save10') {
      setCouponApplied(true);
      setCouponDiscount(10);
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  };

  const subtotal = getCartTotal();
  const discount = couponApplied ? (subtotal * couponDiscount / 100) : 0;
  const total = subtotal - discount;

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any products to your cart yet.</p>
        <Link to="/products" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-header">
            <div className="cart-header-product">Product</div>
            <div className="cart-header-price">Price</div>
            <div className="cart-header-quantity">Quantity</div>
            <div className="cart-header-total">Total</div>
            <div className="cart-header-actions">Actions</div>
          </div>
          
          {cart.map(item => {
            const itemPrice = item.discount 
              ? item.price * (1 - item.discount / 100) 
              : item.price;
            const itemTotal = itemPrice * item.quantity;
            
            return (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-product">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-category">{item.category}</p>
                    {item.discount > 0 && (
                      <span className="cart-item-discount">{item.discount}% OFF</span>
                    )}
                  </div>
                </div>
                
                <div className="cart-item-price">
                  {item.discount > 0 ? (
                    <>
                      <span className="discounted-price">${itemPrice.toFixed(2)}</span>
                      <span className="original-price">${item.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>${item.price.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="cart-item-quantity">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    />
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="cart-item-total">
                  ${itemTotal.toFixed(2)}
                </div>
                
                <div className="cart-item-actions">
                  <button 
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          
          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          {couponApplied && (
            <div className="summary-row discount">
              <span>Discount ({couponDiscount}%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div className="coupon-section">
            <h3>Apply Coupon</h3>
            <div className="coupon-input">
              <input 
                type="text" 
                placeholder="Enter coupon code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
              />
              <button 
                onClick={handleApplyCoupon}
                disabled={couponApplied || !couponCode}
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <div className="coupon-applied">
                Coupon applied successfully!
              </div>
            )}
          </div>
          
          <button 
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
          
          <div className="secure-checkout">
            <i className="fas fa-lock"></i>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;