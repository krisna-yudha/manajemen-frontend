import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useMyRentals } from '@/hooks/useApi';

export default function Rentals() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: rentalsData, isLoading: rentalsLoading, error } = useMyRentals({
    status: statusFilter,
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'returned':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
          <Link
            href="/rentals/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create New Rental
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex space-x-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="ongoing">Ongoing</option>
              <option value="returned">Returned</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Rentals List */}
        <div className="bg-white shadow rounded-lg">
          {rentalsLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading rentals...</p>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">
                  Error loading rentals. Please try again later.
                </p>
              </div>
            </div>
          )}

          {rentalsData?.status === 'success' && (
            <div className="overflow-hidden">
              {rentalsData.data && rentalsData.data.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {rentalsData.data.map((rental) => (
                    <div key={rental.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900">
                                {rental.barang?.nama_barang || `Barang ID: ${rental.barang_id}`}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {rental.barang?.deskripsi}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                rental.status
                              )}`}
                            >
                              {rental.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Quantity:</span>
                              <p className="text-gray-900">{rental.jumlah}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Start Date:</span>
                              <p className="text-gray-900">
                                {new Date(rental.tanggal_pinjam).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Return Date:</span>
                              <p className="text-gray-900">
                                {new Date(rental.tanggal_kembali_rencana).toLocaleDateString()}
                              </p>
                            </div>
                            {rental.total_biaya && (
                              <div>
                                <span className="font-medium text-gray-700">Total Cost:</span>
                                <p className="text-gray-900">
                                  Rp {rental.total_biaya.toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="mt-4">
                            <span className="font-medium text-gray-700">Purpose:</span>
                            <p className="text-gray-900 mt-1">{rental.keperluan}</p>
                          </div>

                          {rental.catatan && (
                            <div className="mt-4">
                              <span className="font-medium text-gray-700">Notes:</span>
                              <p className="text-gray-900 mt-1">{rental.catatan}</p>
                            </div>
                          )}

                          <div className="mt-4 text-xs text-gray-500">
                            Submitted on {new Date(rental.created_at).toLocaleDateString()} at{' '}
                            {new Date(rental.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No rentals found.</p>
                  <Link
                    href="/rentals/create"
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Create your first rental request
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
