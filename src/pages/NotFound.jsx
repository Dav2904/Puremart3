import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          <Link to="/" className="home-btn">
            Back to Home
          </Link>
          <Link to="/products" className="products-btn">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;