import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <img src="/PureMartNBG.png" alt="PureMart" className="footer-logo" />
          <p className="footer-description">
            Your one-stop shop for fresh groceries and household essentials.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Categories</h3>
          <ul className="footer-links">
            <li><Link to="/products?category=Fruits">Fruits</Link></li>
            <li><Link to="/products?category=Vegetables">Vegetables</Link></li>
            <li><Link to="/products?category=Dairy">Dairy</Link></li>
            <li><Link to="/products?category=Bakery">Bakery</Link></li>
            <li><Link to="/products?category=Meat">Meat</Link></li>
            <li><Link to="/products?category=Seafood">Seafood</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <address className="footer-contact">
            <p>123 Grocery Street</p>
            <p>Foodville, FV 12345</p>
            <p>Email: info@puremart.com</p>
            <p>Phone: (123) 456-7890</p>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} PureMart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;