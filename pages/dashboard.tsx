import { useEffect } from 'react';
import { useRouter } from 'next/router';
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
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Dashboard
          </h1>
          
          {/* User Info */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Welcome back, {user?.name}!
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Email: {user?.email}</p>
                <p>Role: <span className="capitalize font-medium text-indigo-600">{user?.role}</span></p>
                <p>Status: <span className={`font-medium ${user?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {user?.is_active ? 'Active' : 'Inactive'}
                </span></p>
              </div>
            </div>
          </div>

          {/* Dashboard Stats untuk Manager */}
          {isManager && dashboardData && dashboardData.status === 'success' && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">U</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{dashboardData.data?.total_users || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">R</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Rentals</dt>
                        <dd className="text-lg font-medium text-gray-900">{dashboardData.data?.active_rentals || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">P</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Approvals</dt>
                        <dd className="text-lg font-medium text-gray-900">{dashboardData.data?.pending_approvals || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">B</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                        <dd className="text-lg font-medium text-gray-900">{dashboardData.data?.total_items || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Rentals Section */}
          {myRentalsData && myRentalsData.status === 'success' && (
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  My Recent Rentals
                </h3>
                
                {rentalsLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading rentals...</p>
                  </div>
                )}

                {myRentalsData.data && myRentalsData.data.length > 0 ? (
                  <div className="space-y-3">
                    {myRentalsData.data.slice(0, 5).map((rental) => (
                      <div key={rental.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{rental.barang?.nama_barang}</h4>
                            <p className="text-sm text-gray-500">Quantity: {rental.jumlah}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(rental.tanggal_pinjam).toLocaleDateString()} - {new Date(rental.tanggal_kembali_rencana).toLocaleDateString()}
                            </p>
                          </div>
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No rentals found.</p>
                )}
              </div>
            </div>
          )}

          {/* Available Items Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Available Items
              </h3>
              
              {barangsLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading items...</p>
                </div>
              )}

              {barangsError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">
                    Error loading items. Make sure your Laravel API is running on {process.env.NEXT_PUBLIC_API_URL}.
                  </p>
                </div>
              )}

              {barangsData && barangsData.status === 'success' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {barangsData.data?.slice(0, 6).map((barang) => (
                    <div key={barang.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{barang.nama_barang}</h4>
                      <p className="text-sm text-gray-500 mt-1">{barang.deskripsi}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Stock: {barang.stok}</span>
                        <span className="text-lg font-semibold text-green-600">
                          Rp {barang.harga_sewa_per_hari?.toLocaleString()}/day
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          barang.status === 'tersedia' ? 'bg-green-100 text-green-800' :
                          barang.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {barang.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!barangsData.data || barangsData.data.length === 0) && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No items available.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
