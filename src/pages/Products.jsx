import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const { addToCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:9000/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch products
        const productsResponse = await fetch('http://localhost:9000/products');
        const productsData = await productsResponse.json();
        setProducts(productsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === 'price-low') {
      setSortBy('price');
      setSortOrder('asc');
    } else if (value === 'price-high') {
      setSortBy('price');
      setSortOrder('desc');
    } else if (value === 'name') {
      setSortBy('name');
      setSortOrder('asc');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show a toast or notification here
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (selectedCategory ? product.category === selectedCategory : true) &&
      (searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    )
    .sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' 
          ? a.price - b.price 
          : b.price - a.price;
      } else {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Browse our selection of fresh groceries</p>
      </div>

      <div className="products-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-options">
          <div className="category-filter">
            <label>Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-filter">
            <label>Sort By:</label>
            <select onChange={handleSortChange}>
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found. Try changing your filters.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div className="product-card" key={product.id}>
              <Link to={`/products/${product.id}`} className="product-image-container">
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
                <div className="product-actions">
                  <Link to={`/products/${product.id}`} className="view-details-btn">
                    View Details
                  </Link>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;