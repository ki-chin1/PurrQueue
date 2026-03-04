import React, { useState, useEffect } from 'react';
import { catAPI } from '../../api/endpoints';
import type { Cat } from '../../types';

const ManageCats: React.FC = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'MALE',
    color: '',
    type: 'ADOPTION',
    status: 'AVAILABLE',
    description: '',
    price: '',
  });

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      const response = await catAPI.getAllCats();
      setCats(response.data.data);
    } catch (err: any) {
      setError('Failed to load cats.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        // Update existing cat
        await catAPI.updateCat(editingId, {
          ...formData,
          age_months: parseInt(formData.age, 10),
          gender: formData.gender as 'MALE' | 'FEMALE',
          type: formData.type as 'ADOPTION' | 'SALE',
          status: formData.status as 'AVAILABLE' | 'PENDING' | 'ADOPTED',
          price: formData.price ? parseFloat(formData.price) : undefined,
        });
      } else {
        // Create new cat
        await catAPI.createCat({
          ...formData,
          age_months: parseInt(formData.age, 10),
          gender: formData.gender as 'MALE' | 'FEMALE',
          type: formData.type as 'ADOPTION' | 'SALE',
          status: formData.status as 'AVAILABLE' | 'PENDING' | 'ADOPTED',
          price: formData.price ? parseFloat(formData.price) : undefined,
        });
      }

      setFormData({
        name: '',
        breed: '',
        age: '',
        gender: 'MALE',
        color: '',
        type: 'ADOPTION',
        status: 'AVAILABLE',
        description: '',
        price: '',
      });
      setShowForm(false);
      setEditingId(null);
      await fetchCats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save cat.');
    }
  };

  const handleEdit = (cat: Cat) => {
    setFormData({
      name: cat.name,
      breed: cat.breed || '',
      age: String(cat.age_months || 0),
      gender: cat.gender as 'MALE' | 'FEMALE',
      color: cat.color || '',
      type: cat.type,
      status: cat.status,
      description: cat.description || '',
      price: String(cat.price || ''),
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this cat?')) return;

    try {
      await catAPI.deleteCat(id);
      await fetchCats();
    } catch (err: any) {
      setError('Failed to delete cat.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      breed: '',
      age: '',
      gender: 'MALE',
      color: '',
      type: 'ADOPTION',
      status: 'AVAILABLE',
      description: '',
      price: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">Loading cats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Manage Cats
          </h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              + Add New Cat
            </button>
          )}
        </div>

        {error && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl mb-6 font-medium">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Cat' : 'Add New Cat'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Cat Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Whiskers"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Breed</label>
                <input
                  type="text"
                  name="breed"
                  placeholder="e.g., Persian"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Age (months)</label>
                <input
                  type="number"
                  name="age"
                  placeholder="e.g., 12"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
                  required
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Color</label>
                <input
                  type="text"
                  name="color"
                  placeholder="e.g., Orange"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
                  required
                >
                  <option value="ADOPTION">For Adoption</option>
                  <option value="SALE">For Sale</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
                  required
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="PENDING">Pending</option>
                  <option value="ADOPTED">Adopted</option>
                </select>
              </div>

              {formData.type === 'SALE' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g., 500"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the cat's personality, traits, etc."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {editingId ? 'Update Cat' : 'Create Cat'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {cats.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <p className="text-gray-600 text-lg font-medium">
              You don't have any cats yet. Click "Add New Cat" to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cats.map((cat) => (
              <div key={cat.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-200 group">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {cat.name}
                </h3>

                <p className="text-gray-600 text-sm font-medium mb-1">{cat.breed}</p>
                <p className="text-gray-500 text-sm mb-4">Age: {cat.age_months} months</p>

                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                    cat.type === 'ADOPTION' 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600'
                  }`}>
                    {cat.type === 'ADOPTION' ? 'Adoption' : 'Sale'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                    cat.status === 'AVAILABLE'
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : cat.status === 'PENDING'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                      : 'bg-gradient-to-r from-slate-500 to-slate-600'
                  }`}>
                    {cat.status}
                  </span>
                </div>

                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg font-bold text-sm transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-lg font-bold text-sm transition-all duration-200"
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
  );
};

export default ManageCats;
