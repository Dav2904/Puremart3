import { Link } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          <i className="fas fa-lock"></i>
        </div>
        <h1>Access Denied</h1>
        <p>Sorry, you don't have permission to access this page.</p>
        <p>Please log in with an account that has the required permissions.</p>
        <div className="unauthorized-actions">
          <Link to="/" className="home-btn">
            Back to Home
          </Link>
          <Link to="/login" className="login-btn">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;