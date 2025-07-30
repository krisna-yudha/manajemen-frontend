import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function UsersPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    // Only managers can access this page
    if (!isLoading && isAuthenticated && user?.role !== 'manager') {
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

  if (!isAuthenticated || user?.role !== 'manager') {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Kelola Pengguna
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Kelola data pengguna role gudang dan member
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <span className="mr-2">➕</span>
                Tambah Pengguna
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Kelola Pengguna
            </h3>
            <p className="text-gray-500 mb-6">
              Fitur ini akan segera tersedia untuk mengelola pengguna role gudang dan member.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Tambah, edit, dan hapus pengguna</p>
              <p>• Atur role gudang dan member</p>
              <p>• Monitor status aktif pengguna</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
