import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useLogin } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== LOGIN PROCESS STARTED ===');
    console.log('Login attempt started with:', { email, password: password ? '[PROVIDED]' : '[EMPTY]' });
    
    try {
      console.log('Step 1: Calling API...');
      const result = await loginMutation.mutateAsync({ email, password });
      console.log('Step 2: API response received:', result);
      
      if (result.status === 'success') {
        console.log('Step 3: Login successful');
        console.log('- User data:', result.user);
        console.log('- Token:', result.token ? '[TOKEN RECEIVED]' : '[NO TOKEN]');
        
        // Extract user data properly
        const userData = result.user || result.data?.user;
        const token = result.token || result.data?.token;
        
        if (userData && token) {
          console.log('Step 4: Calling AuthContext.login...');
          login(userData, token);
          
          console.log('Step 5: Auth context updated, redirecting...');
          await router.push('/dashboard');
          console.log('Step 6: Redirect completed');
        } else {
          console.error('Step 4 FAILED: Missing user data or token');
          console.error('- userData:', userData);
          console.error('- token:', token);
          alert('Login failed: Missing user data or token');
        }
      } else {
        console.error('Step 3 FAILED: Login status not success:', result.status);
        alert('Login failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('=== LOGIN PROCESS FAILED ===');
      console.error('Login error caught:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Login failed';
      alert(errorMessage);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">📧</span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">🔒</span>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Masuk...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>🚀</span>
                      <span>Masuk</span>
                    </div>
                  )}
                </button>
                
                  {process.env.NODE_ENV === 'development' && (
                    <button
                      type="button"
                      onClick={() => {
                        console.log('=== AUTH DEBUG INFO ===');
                        console.log('Current auth state:', { 
                          isAuthenticated,
                          user: user ? user.name : null 
                        });
                        if (typeof window !== 'undefined') {
                          console.log('localStorage auth_token:', localStorage.getItem('auth_token'));
                          console.log('localStorage user:', localStorage.getItem('user'));
                        }
                      }}
                      className="w-full py-2 px-3 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
                    >
                      🔍 Debug Auth State
                    </button>
                  )}
              </div>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <Link 
                  href="/register" 
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-indigo-600 text-sm">🏢</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Manajemen Rental</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-green-600 text-sm">📱</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Akses Mudah</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-purple-600 text-sm">🔒</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Aman & Terpercaya</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
