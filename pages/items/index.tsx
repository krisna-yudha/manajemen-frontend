import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useAvailableBarangs, useBarangCategories } from '@/hooks/useApi';

export default function Items() {
  const { isAuthenticated, isLoading, user } = useAuth();
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

  // Role permissions
  const isGudang = user?.role === 'gudang';
  const isMember = user?.role === 'member';
  const isManager = user?.role === 'manager';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isGudang ? 'Kelola Barang' : 'Barang Tersedia'}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {isGudang && 'Kelola inventori barang untuk rental'}
                {isMember && 'Jelajahi koleksi barang yang tersedia untuk disewa'}
                {isManager && 'Lihat daftar barang dalam sistem (hanya lihat)'}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              {isGudang && (
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3">
                  <span className="mr-2">➕</span>
                  Tambah Barang
                </button>
              )}
              {isMember && (
                <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mr-3">
                  <span className="mr-2">🛒</span>
                  Ajukan Rental
                </button>
              )}
              <div className="inline-flex bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                {barangsData?.data?.length || 0} Barang Tersedia
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Cari Barang
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">🔍</span>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Cari nama barang, kode, atau kategori..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">📂</span>
                </div>
                <select
                  id="category"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm appearance-none bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  {categoriesData?.status === 'success' && categoriesData.data?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {barangsLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat barang...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-900">Error Memuat Data</h3>
                <p className="text-sm text-red-600">
                  Gagal memuat data barang. Silakan coba lagi nanti.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {barangsData?.status === 'success' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {barangsData.data?.map((barang) => (
              <div key={barang.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group">
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center group-hover:from-indigo-50 group-hover:to-purple-50 transition-colors duration-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                      <span className="text-2xl">📦</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{barang.kode_barang}</p>
                  </div>
                </div>

                <div className="p-4">
                  {/* Item Header */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                        {barang.nama_barang}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        barang.status === 'tersedia' 
                          ? 'bg-green-100 text-green-800' 
                          : barang.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {barang.status === 'tersedia' ? 'Tersedia' : 
                         barang.status === 'maintenance' ? 'Maintenance' : 
                         'Tidak Tersedia'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {barang.deskripsi}
                    </p>
                    {barang.kategori && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {barang.kategori}
                      </span>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Stok</span>
                      <span className={`font-medium ${
                        barang.stok <= (barang.stok_minimum || 0) ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {barang.stok} unit
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Kondisi</span>
                      <span className="font-medium text-gray-900 capitalize">{barang.kondisi}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Lokasi</span>
                      <span className="font-medium text-gray-900">{barang.lokasi_penyimpanan}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-t pt-2">
                      <span className="text-gray-500">Harga Sewa</span>
                      <span className="font-semibold text-green-600">
                        Rp {barang.harga_sewa_per_hari?.toLocaleString('id-ID')}/hari
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {isMember && (
                      <button
                        onClick={() => router.push(`/rentals/create?barang_id=${barang.id}`)}
                        disabled={barang.status !== 'tersedia' || barang.stok === 0}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        {barang.status === 'tersedia' && barang.stok > 0 ? 'Sewa Sekarang' : 'Tidak Tersedia'}
                      </button>
                    )}
                    
                    {isGudang && (
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                          Edit
                        </button>
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                          Update Stok
                        </button>
                      </div>
                    )}
                    
                    {isManager && (
                      <div className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg text-sm font-medium text-center">
                        Hanya dapat melihat data
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) || (
              <div className="col-span-full">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📦</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Barang</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || selectedCategory 
                      ? 'Tidak ditemukan barang yang sesuai dengan pencarian Anda.'
                      : 'Belum ada barang yang tersedia saat ini.'
                    }
                  </p>
                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      Hapus Filter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/rentals/create')}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
            >
              <span className="text-lg">➕</span>
              <span className="font-medium">Ajukan Rental</span>
            </button>
            
            <button
              onClick={() => router.push('/rentals')}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              <span className="text-lg">📋</span>
              <span className="font-medium">My Rentals</span>
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
            >
              <span className="text-lg">🏠</span>
              <span className="font-medium">Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
