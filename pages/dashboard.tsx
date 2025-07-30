import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useAvailableBarangs, useMyRentals, useDashboardStats } from '@/hooks/useApi';

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  
  console.log('Dashboard - Auth state:', { isAuthenticated, isLoading, user: user?.name });
  
  // Fetch data sesuai dengan role user
  const { data: barangsData, isLoading: barangsLoading, error: barangsError } = useAvailableBarangs();
  const { data: myRentalsData, isLoading: rentalsLoading } = useMyRentals();
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardStats();

  useEffect(() => {
    console.log('Dashboard useEffect - Auth check:', { isAuthenticated, isLoading });
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login...');
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

  // Cek role untuk menampilkan konten yang sesuai
  const isManager = user?.role === 'manager';
  const isGudang = user?.role === 'gudang';
  const isMember = user?.role === 'member';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Selamat datang kembali di sistem manajemen rental
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Selamat datang kembali!</h3>
                    <p className="text-sm opacity-90">{user?.name}</p>
                    <p className="text-xs opacity-75 capitalize">{user?.role} • {user?.is_active ? 'Aktif' : 'Tidak Aktif'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats untuk Manager */}
        {isManager && dashboardData && dashboardData.status === 'success' && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.data?.total_users || 0}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rental Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.data?.active_rentals || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.data?.pending_approvals || 0}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Barang</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.data?.total_items || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Member Stats */}
        {isMember && myRentalsData && myRentalsData.status === 'success' && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rental Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myRentalsData.data?.filter(r => r.status === 'ongoing').length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📋</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myRentalsData.data?.filter(r => r.status === 'pending').length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rental</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myRentalsData.data?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tersedia</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {barangsData?.data?.filter(b => b.status === 'tersedia').length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📦</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* My Rentals Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Rental Saya Terbaru
                  </h3>
                  <Link
                    href="/rentals"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Lihat Semua →
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {rentalsLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Memuat rental...</p>
                  </div>
                )}

                {myRentalsData && myRentalsData.status === 'success' && myRentalsData.data && myRentalsData.data.length > 0 ? (
                  <div className="space-y-4">
                    {myRentalsData.data.slice(0, 5).map((rental) => (
                      <div key={rental.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-gray-900">{rental.barang?.nama_barang}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                rental.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                rental.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                rental.status === 'returned' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {rental.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <p className="flex items-center space-x-1">
                                <span>📦</span>
                                <span>Jumlah: {rental.jumlah}</span>
                              </p>
                              <p className="flex items-center space-x-1">
                                <span>📅</span>
                                <span>
                                  {new Date(rental.tanggal_pinjam).toLocaleDateString('id-ID')} - {new Date(rental.tanggal_kembali_rencana).toLocaleDateString('id-ID')}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📋</span>
                    </div>
                    <p className="text-gray-500">Belum ada rental yang dibuat.</p>
                    <Link
                      href="/rentals/create"
                      className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Ajukan Rental Pertama
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Available Items Section */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Barang Tersedia
                  </h3>
                  <Link
                    href="/items"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Lihat Semua →
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {barangsLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Memuat barang...</p>
                  </div>
                )}

                {barangsError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">⚠️</span>
                      <p className="text-sm text-red-600">
                        Error memuat barang. Pastikan API Laravel berjalan di {process.env.NEXT_PUBLIC_API_URL}.
                      </p>
                    </div>
                  </div>
                )}

                {barangsData && barangsData.status === 'success' && (
                  <div className="space-y-4">
                    {barangsData.data?.filter(b => b.status === 'tersedia').slice(0, 4).map((barang) => (
                      <div key={barang.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{barang.nama_barang}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{barang.deskripsi}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-gray-600">Stok: {barang.stok}</span>
                              <span className="text-sm font-semibold text-green-600">
                                Rp {barang.harga_sewa_per_hari?.toLocaleString('id-ID')}/hari
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📦</span>
                        </div>
                        <p className="text-gray-500 text-sm">Tidak ada barang tersedia.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/rentals/create"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg hover:from-indigo-100 hover:to-indigo-200 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl">➕</span>
              </div>
              <span className="text-sm font-medium text-indigo-900">Ajukan Rental</span>
            </Link>

            <Link
              href="/items"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl">🔍</span>
              </div>
              <span className="text-sm font-medium text-green-900">Lihat Barang</span>
            </Link>

            <Link
              href="/rentals"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl">📋</span>
              </div>
              <span className="text-sm font-medium text-purple-900">My Rentals</span>
            </Link>

            {(user?.role === 'manager' || user?.role === 'gudang') && (
              <Link
                href="/admin"
                className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-white text-xl">⚙️</span>
                </div>
                <span className="text-sm font-medium text-orange-900">Admin Panel</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
