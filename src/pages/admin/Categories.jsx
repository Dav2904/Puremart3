import { useState, useEffect } from 'react';
import './Categories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:9000/categories');
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        [name]: value
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: value
      });
    }
  };
  
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      alert('Category name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:9000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });
      
      if (response.ok) {
        const addedCategory = await response.json();
        setCategories([...categories, addedCategory]);
        setNewCategory({ name: '', description: '' });
      } else {
        alert('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('An error occurred while adding the category');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditClick = (category) => {
    setEditingCategory(category);
  };
  
  const handleCancelEdit = () => {
    setEditingCategory(null);
  };
  
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    
    if (!editingCategory.name.trim()) {
      alert('Category name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:9000/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingCategory)
      });
      
      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(categories.map(cat => 
          cat.id === updatedCategory.id ? updatedCategory : cat
        ));
        setEditingCategory(null);
      } else {
        alert('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('An error occurred while updating the category');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:9000/categories/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setCategories(categories.filter(cat => cat.id !== id));
        } else {
          alert('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('An error occurred while deleting the category');
      }
    }
  };
  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-categories">
      <div className="admin-header">
        <h1>Manage Categories</h1>
      </div>
      
      <div className="categories-content">
        <div className="categories-form-container">
          <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editingCategory ? editingCategory.name : newCategory.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={editingCategory ? editingCategory.description : newCategory.description}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}
              </button>
              
              {editingCategory && (
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="categories-list-container">
          <div className="categories-list-header">
            <h2>Categories List</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {filteredCategories.length === 0 ? (
            <p className="no-categories">No categories found.</p>
          ) : (
            <div className="categories-list">
              {filteredCategories.map(category => (
                <div className="category-item" key={category.id}>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{category.description || 'No description'}</p>
                  </div>
                  <div className="category-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditClick(category)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;