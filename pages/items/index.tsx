import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useAvailableBarangs, useBarangCategories } from '@/hooks/useApi';

export default function Items() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: barangsData, isLoading: barangsLoading, error } = useAvailableBarangs({
    search: searchTerm,
    kategori: selectedCategory,
  });
  const { data: categoriesData } = useBarangCategories();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

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
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Items</h1>

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search items..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        </div>

        {/* Items Grid */}
        <div className="bg-white shadow rounded-lg p-6">
          {barangsLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading items...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-sm text-red-600">
                Error loading items. Please try again later.
              </p>
            </div>
          )}

          {barangsData?.status === 'success' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {barangsData.data?.map((barang) => (
                <div key={barang.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 text-lg">{barang.nama_barang}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        barang.status === 'tersedia'
                          ? 'bg-green-100 text-green-800'
                          : barang.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {barang.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{barang.deskripsi}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Code:</span>
                      <span className="font-mono text-gray-900">{barang.kode_barang}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="text-gray-900">{barang.kategori}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Stock:</span>
                      <span className={`font-medium ${
                        barang.stok <= barang.stok_minimum ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {barang.stok}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Condition:</span>
                      <span className="text-gray-900 capitalize">{barang.kondisi}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="text-gray-900">{barang.lokasi_penyimpanan}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-green-600">
                        Rp {barang.harga_sewa_per_hari?.toLocaleString()}/day
                      </span>
                      <button
                        onClick={() => router.push(`/rentals/create?barang_id=${barang.id}`)}
                        disabled={barang.status !== 'tersedia' || barang.stok === 0}
                        className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Rent
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {(!barangsData.data || barangsData.data.length === 0) && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No items found.</p>
                  {(searchTerm || selectedCategory) && (
                    <p className="text-gray-400 text-sm mt-2">
                      Try adjusting your search or filter criteria.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
