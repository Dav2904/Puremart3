import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:9000/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch products and select a few for featured section
        const productsResponse = await fetch('http://localhost:9000/products');
        const productsData = await productsResponse.json();
        
        // Get 4 random products for featured section
        const shuffled = [...productsData].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 4));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading fresh groceries...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
          alt="Fresh groceries" 
          className="hero-image"
        />
        <div className="hero-content">
          <h1 className="hero-title">Fresh Groceries Delivered to Your Door</h1>
          <p className="hero-subtitle">Quality products at affordable prices</p>
          <Link to="/products" className="hero-button">Shop Now</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <Link 
              to={`/products?category=${category.name}`} 
              className="category-card" 
              key={category.id}
            >
              <img src={category.image} alt={category.name} className="category-image" />
              <div className="category-overlay">
                <h3 className="category-name">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div className="product-card" key={product.id}>
              <Link to={`/products/${product.id}`}>
                <img src={product.image} alt={product.name} className="product-image" />
                {product.discount > 0 && (
                  <span className="product-discount">{product.discount}% OFF</span>
                )}
              </Link>
              <div className="product-info">
                <h3 className="product-title">
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="product-price">
                  {product.discount > 0 ? (
                    <>
                      <span className="discounted-price">
                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                      <span className="original-price">${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>${product.price.toFixed(2)}</span>
                  )}
                </div>
                <p className="product-category">{product.category}</p>
                <Link to={`/products/${product.id}`} className="view-product-btn">
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/products" className="view-all-btn">View All Products</Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefit-card">
          <div className="benefit-icon">🚚</div>
          <h3>Free Delivery</h3>
          <p>On orders over $50</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">🌱</div>
          <h3>Fresh Products</h3>
          <p>Locally sourced items</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">💰</div>
          <h3>Best Prices</h3>
          <p>Affordable quality</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">🔄</div>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
      </section>
    </div>
  );
};

export default Home;