import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductForm.css';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    discount: '',
    inStock: true,
    featured: false
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:9000/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
    
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:9000/products/${id}`);
          if (!response.ok) {
            throw new Error('Product not found');
          }
          const data = await response.json();
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price.toString(),
            category: data.category,
            image: data.image,
            discount: data.discount ? data.discount.toString() : '',
            inStock: data.inStock,
            featured: data.featured || false
          });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching product:', error);
          navigate('/admin/products');
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }
    
    if (formData.discount && (isNaN(formData.discount) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      newErrors.discount = 'Discount must be a number between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      discount: formData.discount ? parseFloat(formData.discount) : 0,
      inStock: formData.inStock,
      featured: formData.featured
    };
    
    try {
      const url = isEditMode 
        ? `http://localhost:9000/products/${id}`
        : 'http://localhost:9000/products';
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save product');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('An error occurred while saving the product');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading product data...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-product-form">
      <div className="admin-header">
        <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <div className="error-message">{errors.category}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <div className="error-message">{errors.price}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="discount">Discount (%) - Optional</label>
              <input
                type="text"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className={errors.discount ? 'error' : ''}
                placeholder="0"
              />
              {errors.discount && <div className="error-message">{errors.discount}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={errors.image ? 'error' : ''}
              />
              {errors.image && <div className="error-message">{errors.image}</div>}
            </div>
            
            <div className="form-group checkbox-group">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                />
                <label htmlFor="inStock">In Stock</label>
              </div>
              
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <label htmlFor="featured">Featured Product</label>
              </div>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          
          {formData.image && (
            <div className="image-preview">
              <h3>Image Preview</h3>
              <img src={formData.image} alt="Product preview" />
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;