'use client';

import { useEffect, useState } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';

const CategoryManagementModal = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllCategories();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setFormData({ name: '', description: '' });
    setShowCreateModal(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await AdminService.createCategory(formData);
      toast.success('Category created successfully');
      setShowCreateModal(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
      toast.error(err?.response?.data?.detail || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await AdminService.updateCategory(selectedCategory.id, formData);
      toast.success('Category updated successfully');
      setShowEditModal(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
      toast.error(err?.response?.data?.detail || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await AdminService.deleteCategory(deleteId);
      toast.success('Category deleted successfully');
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Main Modal Overlay */}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content main-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Manage Categories</h3>
            <button className="close-btn" onClick={onClose}>
              <span className="la la-times"></span>
            </button>
          </div>

          <div className="modal-body">
            <div className="categories-header">
              <p className="subtitle">Manage service categories for your platform</p>
              <button className="btn-create-category" onClick={handleCreateClick}>
                <span className="la la-plus"></span>
                Add Category
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading categories...</p>
              </div>
            ) : (
              <div className="categories-grid">
                {categories.length === 0 ? (
                  <div className="empty-state">
                    <span className="la la-tag" style={{ fontSize: '48px', color: '#d1d5db' }}></span>
                    <p>No categories yet</p>
                    <small>Create your first category to get started</small>
                  </div>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="category-card">
                      <div className="category-info">
                        <h4>{category.name}</h4>
                        {category.description && <p>{category.description}</p>}
                      </div>
                      <div className="category-actions">
                        <button
                          className="btn-edit-small"
                          onClick={() => handleEditClick(category)}
                          title="Edit"
                        >
                          <span className="la la-edit"></span>
                        </button>
                        <button
                          className="btn-delete-small"
                          onClick={() => handleDeleteClick(category.id)}
                          title="Delete"
                        >
                          <span className="la la-trash"></span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="modal-overlay nested" onClick={() => !submitting && setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-header">
                <h3>Create Category</h3>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowCreateModal(false)}
                  disabled={submitting}
                >
                  <span className="la la-times"></span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Residential Cleaning"
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe this category..."
                    rows="3"
                    disabled={submitting}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className="modal-overlay nested" onClick={() => !submitting && setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-header">
                <h3>Edit Category</h3>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowEditModal(false)}
                  disabled={submitting}
                >
                  <span className="la la-times"></span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Residential Cleaning"
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe this category..."
                    rows="3"
                    disabled={submitting}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay nested" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <span className="la la-times"></span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this category? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-overlay.nested {
          z-index: 1001;
          background: rgba(0, 0, 0, 0.7);
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content.main-modal {
          max-width: 800px;
        }

        .modal-content.small {
          max-width: 400px;
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f3f4f6;
          border-radius: 6px;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 18px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #e5e7eb;
        }

        .close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-body {
          padding: 24px;
        }

        .categories-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .btn-create-category {
          height: 40px;
          padding: 0 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transition: all 0.2s;
        }

        .btn-create-category:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-state p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .category-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: all 0.2s;
        }

        .category-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .category-info {
          flex: 1;
        }

        .category-info h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .category-info p {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        .category-actions {
          display: flex;
          gap: 8px;
          margin-left: 12px;
        }

        .btn-edit-small,
        .btn-delete-small {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 16px;
          transition: all 0.2s;
        }

        .btn-edit-small {
          background: #eff6ff;
          color: #2563eb;
        }

        .btn-edit-small:hover {
          background: #dbeafe;
        }

        .btn-delete-small {
          background: #fef2f2;
          color: #dc2626;
        }

        .btn-delete-small:hover {
          background: #fee2e2;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .empty-state p {
          font-size: 16px;
          color: #6b7280;
          margin: 12px 0 4px 0;
        }

        .empty-state small {
          font-size: 13px;
          color: #9ca3af;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-group input:disabled,
        .form-group textarea:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-secondary,
        .btn-primary,
        .btn-danger {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-danger {
          background: #dc2626;
          color: white;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }

        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }

          .categories-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .btn-create-category {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default CategoryManagementModal;
