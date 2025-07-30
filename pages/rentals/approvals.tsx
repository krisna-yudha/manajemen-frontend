import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function RentalApprovalsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    // Only gudang can access this page
    if (!isLoading && isAuthenticated && user?.role !== 'gudang') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || user?.role !== 'gudang') {
    return null;
  }

  // Mock data untuk demo
  const pendingRentals = [
    {
      id: 1,
      user: 'John Doe',
      barang: 'Laptop Dell',
      jumlah: 1,
      tanggal_pinjam: '2024-01-15',
      tanggal_kembali: '2024-01-20',
      keperluan: 'Presentasi client',
      status: 'pending'
    },
    {
      id: 2,
      user: 'Jane Smith',
      barang: 'Proyektor',
      jumlah: 1,
      tanggal_pinjam: '2024-01-16',
      tanggal_kembali: '2024-01-18',
      keperluan: 'Meeting ruang besar',
      status: 'pending'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Approve Rental
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Review dan approve permintaan rental dari member
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">{pendingRentals.length} Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Semua Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            
            <input
              type="text"
              placeholder="Cari berdasarkan nama user atau barang..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Filter
            </button>
          </div>
        </div>

        {/* Pending Rentals */}
        <div className="space-y-4">
          {pendingRentals.length > 0 ? (
            pendingRentals.map((rental) => (
              <div key={rental.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {rental.barang}
                      </h3>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Pending Approval
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Peminjam</p>
                        <p className="font-medium text-gray-900">{rental.user}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Jumlah</p>
                        <p className="font-medium text-gray-900">{rental.jumlah} unit</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Pinjam</p>
                        <p className="font-medium text-gray-900">
                          {new Date(rental.tanggal_pinjam).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Kembali</p>
                        <p className="font-medium text-gray-900">
                          {new Date(rental.tanggal_kembali).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Keperluan</p>
                      <p className="text-gray-700">{rental.keperluan}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                      <span className="mr-2">✅</span>
                      Approve
                    </button>
                    
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                      <span className="mr-2">❌</span>
                      Reject
                    </button>
                    
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak Ada Rental Pending
              </h3>
              <p className="text-gray-500">
                Semua permintaan rental sudah diproses.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Today</p>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected Today</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <span className="text-2xl">❌</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Processed</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
