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
                Dashboard {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {isManager && "Kelola pengguna dan role sistem"}
                {isGudang && "Kelola barang dan approve rental"}
                {isMember && "Lakukan rental barang yang tersedia"}
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
                    <h3 className="font-semibold">Selamat datang!</h3>
                    <p className="text-sm opacity-90">{user?.name}</p>
                    <p className="text-xs opacity-75 capitalize">{user?.role} • {user?.is_active ? 'Aktif' : 'Tidak Aktif'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MANAGER DASHBOARD - Only User & Role Management */}
        {isManager && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Kelola Pengguna</h3>
                  <span className="text-2xl">👥</span>
                </div>
                <p className="text-gray-600 mb-4">Kelola data pengguna role gudang dan member</p>
                <Link href="/users" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Kelola Pengguna
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Kelola Role</h3>
                  <span className="text-2xl">🔐</span>
                </div>
                <p className="text-gray-600 mb-4">Atur role dan permission pengguna</p>
                <Link href="/roles" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Kelola Role
                </Link>
              </div>
            </div>

            {dashboardData && dashboardData.status === 'success' && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Role Gudang</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.data?.gudang_users || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Role Member</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.data?.member_users || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.data?.active_users || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GUDANG DASHBOARD - Barang Management & Rental Approval */}
        {isGudang && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Kelola Barang</h3>
                  <span className="text-2xl">📦</span>
                </div>
                <p className="text-gray-600 mb-4">Tambah, edit, dan hapus barang inventori</p>
                <Link href="/items" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Kelola Barang
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Approve Rental</h3>
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-gray-600 mb-4">Review dan approve permintaan rental</p>
                <Link href="/rentals/approvals" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Approve Rental
                </Link>
              </div>
            </div>

            {dashboardData && dashboardData.status === 'success' && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tersedia</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.data?.available_items || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.data?.pending_approvals || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⏳</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rental Aktif</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.data?.active_rentals || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MEMBER DASHBOARD - Only Rental */}
        {isMember && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Rental Barang</h3>
                <span className="text-2xl">🛒</span>
              </div>
              <p className="text-gray-600 mb-4">Ajukan rental barang yang tersedia</p>
              <Link href="/rentals/create" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Ajukan Rental
              </Link>
            </div>

            {myRentalsData && myRentalsData.status === 'success' && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rental Aktif</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {myRentalsData.data?.filter((r: any) => r.status === 'ongoing').length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📋</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Menunggu</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {myRentalsData.data?.filter((r: any) => r.status === 'pending').length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">⏳</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tersedia</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {barangsData?.data?.filter((b: any) => b.status === 'tersedia').length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Rentals Section untuk Member */}
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
                    {myRentalsData.data.slice(0, 5).map((rental: any) => (
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
        )}
      </div>
    </Layout>
  );
}
