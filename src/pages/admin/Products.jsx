import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch('http://localhost:9000/products');
        const productsData = await productsResponse.json();
        setProducts(productsData);
        
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:9000/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };
  
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`http://localhost:9000/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setProducts(products.filter(product => product.id !== id));
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('An error occurred while deleting the product');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || product.category === selectedCategory)
    );
  });
  
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <Link to="/admin/products/new" className="add-new-btn">
          Add New Product
        </Link>
      </div>
      
      <div className="admin-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="category-filter">
          <select value={selectedCategory} onChange={handleCategoryFilter}>
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {currentProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found. Try changing your filters or add a new product.</p>
          <Link to="/admin/products/new" className="add-new-btn">
            Add New Product
          </Link>
        </div>
      ) : (
        <>
          <div className="products-table">
            <div className="table-header">
              <div className="header-cell">Image</div>
              <div className="header-cell">Name</div>
              <div className="header-cell">Category</div>
              <div className="header-cell">Price</div>
              <div className="header-cell">Discount</div>
              <div className="header-cell">Stock</div>
              <div className="header-cell">Actions</div>
            </div>
            
            {currentProducts.map(product => (
              <div className="table-row" key={product.id}>
                <div className="cell">
                  <img src={product.image} alt={product.name} className="product-thumbnail" />
                </div>
                <div className="cell">{product.name}</div>
                <div className="cell">{product.category}</div>
                <div className="cell">${product.price.toFixed(2)}</div>
                <div className="cell">
                  {product.discount > 0 ? `${product.discount}%` : '-'}
                </div>
                <div className="cell">
                  <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="cell actions">
                  <Link to={`/admin/products/edit/${product.id}`} className="edit-btn">
                    Edit
                  </Link>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProducts;