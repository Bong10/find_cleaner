'use client';

import { useEffect, useState } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';
import CategoryManagementModal from './components/CategoryManagementModal';
import ServicesList from './components/ServicesList';
import CreateServiceModal from './components/CreateServiceModal';
import EditServiceModal from './components/EditServiceModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_hourly_rate: '',
    min_hours_required: 2,
    category: '',
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await AdminService.getAllCategories();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      toast.error('Failed to load categories');
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllServices();
      setServices(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateClick = () => {
    setFormData({ 
      name: '', 
      description: '', 
      min_hourly_rate: '', 
      min_hours_required: 2,
      category: '',
      active: true 
    });
    setShowCreateModal(true);
  };

  const handleEditClick = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      min_hourly_rate: service.min_hourly_rate || '',
      min_hours_required: service.min_hours_required || 2,
      category: service.category || '',
      active: service.active !== undefined ? service.active : true,
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
      await AdminService.createService(formData);
      toast.success('Service created successfully');
      setShowCreateModal(false);
      fetchServices();
    } catch (err) {
      console.error('Failed to create service:', err);
      toast.error(err?.response?.data?.detail || 'Failed to create service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await AdminService.updateService(selectedService.id, formData);
      toast.success('Service updated successfully');
      setShowEditModal(false);
      fetchServices();
    } catch (err) {
      console.error('Failed to update service:', err);
      toast.error(err?.response?.data?.detail || 'Failed to update service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await AdminService.deleteService(deleteId);
      toast.success('Service deleted successfully');
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchServices();
    } catch (err) {
      toast.error('Failed to delete service');
    }
  };

  const filteredServices = services.filter((service) => {
    const search = searchTerm.toLowerCase();
    return (
      service.name?.toLowerCase().includes(search) ||
      service.description?.toLowerCase().includes(search) ||
      service.category?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <div className="admin-services">
        <div className="page-header">
          <div>
            <h2>Services Management</h2>
            <p className="subtitle">Manage all service offerings</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <span className="la la-search"></span>
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-manage" onClick={() => setShowCategoriesModal(true)}>
              <span className="la la-list"></span>
              Manage Categories
            </button>
            <button className="btn-create" onClick={handleCreateClick}>
              <span className="la la-plus"></span>
              Create Service
            </button>
          </div>
        </div>

        <ServicesList
          services={filteredServices}
          loading={loading}
          searchTerm={searchTerm}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {showCreateModal && (
        <CreateServiceModal
          formData={formData}
          categories={categories}
          submitting={submitting}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
          onInputChange={handleInputChange}
          setFormData={setFormData}
        />
      )}

      {showEditModal && (
        <EditServiceModal
          formData={formData}
          categories={categories}
          submitting={submitting}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
          onInputChange={handleInputChange}
          setFormData={setFormData}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showCategoriesModal && (
        <CategoryManagementModal onClose={() => setShowCategoriesModal(false)} />
      )}

      <style jsx>{`
        .admin-services {
          padding: 30px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          gap: 20px;
        }

        .page-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .search-box {
          position: relative;
          width: 280px;
        }

        .search-box input {
          width: 100%;
          height: 44px;
          padding: 0 16px 0 44px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .search-box .la-search {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 18px;
        }

        .btn-manage,
        .btn-create {
          height: 44px;
          padding: 0 20px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-manage {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .btn-manage:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .btn-create {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-create:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .btn-manage,
          .btn-create {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default AdminServices;
