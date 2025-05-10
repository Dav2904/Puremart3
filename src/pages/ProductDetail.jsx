import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:9000/products/${id}`);
        const data = await response.json();
        setProduct(data);

        // Fetch related products (same category)
        const relatedResponse = await fetch(`http://localhost:9000/products?category=${data.category}&_limit=4`);
        const relatedData = await relatedResponse.json();
        // Filter out the current product
        setRelatedProducts(relatedData.filter(item => item.id !== parseInt(id)));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
    // Scroll to top when component mounts or id changes
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="back-to-products">
          Back to Products
        </Link>
      </div>
    );
  }

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <div className="product-detail-container">
      <div className="product-detail-wrapper">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
          {product.discount > 0 && (
            <span className="product-discount">{product.discount}% OFF</span>
          )}
        </div>
        
        <div className="product-detail-info">
          <h1 className="product-name">{product.name}</h1>
          
          <div className="product-category">
            <span>Category: </span>
            <Link to={`/products?category=${product.category}`}>
              {product.category}
            </Link>
          </div>
          
          <div className="product-price">
            {product.discount > 0 ? (
              <>
                <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
                <span className="original-price">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span>${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-availability">
            <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <div className="quantity-selector">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={handleQuantityChange}
              />
              <button 
                className="quantity-btn" 
                onClick={incrementQuantity}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="product-actions">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => (
              <div className="related-product-card" key={relatedProduct.id}>
                <Link to={`/products/${relatedProduct.id}`}>
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                  <h3>{relatedProduct.name}</h3>
                  <div className="related-product-price">
                    {relatedProduct.discount > 0 ? (
                      <>
                        <span className="discounted-price">
                          ${(relatedProduct.price * (1 - relatedProduct.discount / 100)).toFixed(2)}
                        </span>
                        <span className="original-price">${relatedProduct.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span>${relatedProduct.price.toFixed(2)}</span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;