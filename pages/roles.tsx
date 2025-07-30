import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function RolesPage() {
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

  const roles = [
    {
      name: 'Manager',
      description: 'Mengelola pengguna dan role sistem',
      permissions: ['Kelola pengguna role gudang dan member', 'Atur permission sistem'],
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: '👑'
    },
    {
      name: 'Gudang',
      description: 'Mengelola barang dan approve rental',
      permissions: ['Kelola barang inventori', 'Approve/reject rental', 'Monitor stok barang'],
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '📦'
    },
    {
      name: 'Member',
      description: 'Melakukan rental barang',
      permissions: ['Ajukan rental barang', 'Lihat status rental', 'Lihat barang tersedia'],
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '👤'
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
                Kelola Role
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Atur role dan permission pengguna dalam sistem
              </p>
            </div>
          </div>
        </div>

        {/* Role Structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${role.color}`}>
                  <span className="text-2xl">{role.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${role.color}`}>
                    Role
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{role.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Permissions:</h4>
                <ul className="space-y-1">
                  {role.permissions.map((permission, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Role Flow Diagram */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alur Kerja Role</h3>
          
          <div className="space-y-6">
            {/* Manager Flow */}
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">👑</span>
                <h4 className="font-semibold text-purple-800">Manager</h4>
              </div>
              <div className="text-sm text-purple-700">
                Mengelola pengguna role gudang dan member → Tidak mengurusi rental atau barang
              </div>
            </div>

            {/* Gudang Flow */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">📦</span>
                <h4 className="font-semibold text-blue-800">Gudang</h4>
              </div>
              <div className="text-sm text-blue-700">
                Kelola barang → Approve/Reject rental → Monitor inventori
              </div>
            </div>

            {/* Member Flow */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">👤</span>
                <h4 className="font-semibold text-green-800">Member</h4>
              </div>
              <div className="text-sm text-green-700">
                Lihat barang tersedia → Ajukan rental → Tunggu approval → Gunakan barang
              </div>
            </div>
          </div>
        </div>

        {/* Role Restrictions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Batasan Role</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">Manager</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>❌ Tidak bisa kelola barang</li>
                <li>❌ Tidak bisa approve rental</li>
                <li>❌ Tidak bisa ajukan rental</li>
              </ul>
            </div>

            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">Gudang</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>❌ Tidak bisa kelola role users</li>
                <li>❌ Tidak bisa ajukan rental</li>
              </ul>
            </div>

            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">Member</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>❌ Tidak bisa kelola users</li>
                <li>❌ Tidak bisa kelola barang</li>
                <li>❌ Tidak bisa approve rental</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
