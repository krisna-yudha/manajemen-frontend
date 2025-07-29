import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useAvailableBarangs, useCreateRental, useBarangCategories } from '@/hooks/useApi';

export default function CreateRental() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    barang_id: '',
    jumlah: 1,
    tanggal_pinjam: '',
    tanggal_kembali_rencana: '',
    keperluan: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: barangsData, isLoading: barangsLoading } = useAvailableBarangs({
    search: searchTerm,
    kategori: selectedCategory,
  });
  const { data: categoriesData } = useBarangCategories();
  const createRentalMutation = useCreateRental();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jumlah' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.barang_id) {
      alert('Please select an item');
      return;
    }

    try {
      const result = await createRentalMutation.mutateAsync({
        barang_id: parseInt(formData.barang_id),
        jumlah: formData.jumlah,
        tanggal_pinjam: formData.tanggal_pinjam,
        tanggal_kembali_rencana: formData.tanggal_kembali_rencana,
        keperluan: formData.keperluan,
      });

      if (result.status === 'success') {
        alert('Rental request submitted successfully!');
        router.push('/rentals');
      }
    } catch (error: any) {
      console.error('Create rental error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create rental';
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Rental</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Items */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Items</h2>
            
            {/* Search and Filter */}
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categoriesData?.status === 'success' && categoriesData.data?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Items List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {barangsLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              )}

              {barangsData?.status === 'success' && barangsData.data?.map((barang) => (
                <div
                  key={barang.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.barang_id === barang.id.toString()
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, barang_id: barang.id.toString() }))}
                >
                  <h3 className="font-medium text-gray-900">{barang.nama_barang}</h3>
                  <p className="text-sm text-gray-500 mt-1">{barang.deskripsi}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Stock: {barang.stok}</span>
                    <span className="text-sm font-medium text-green-600">
                      Rp {barang.harga_sewa_per_hari?.toLocaleString()}/day
                    </span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {barang.kategori}
                  </span>
                </div>
              ))}

              {barangsData?.status === 'success' && (!barangsData.data || barangsData.data.length === 0) && (
                <p className="text-center text-gray-500 py-8">No items available</p>
              )}
            </div>
          </div>

          {/* Rental Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rental Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="jumlah"
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.jumlah}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="tanggal_pinjam"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.tanggal_pinjam}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Return Date
                </label>
                <input
                  type="date"
                  name="tanggal_kembali_rencana"
                  required
                  min={formData.tanggal_pinjam || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.tanggal_kembali_rencana}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <textarea
                  name="keperluan"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe the purpose of this rental..."
                  value={formData.keperluan}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={createRentalMutation.isPending || !formData.barang_id}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createRentalMutation.isPending ? 'Submitting...' : 'Submit Rental Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
