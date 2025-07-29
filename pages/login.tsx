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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </button>
              
              {/* Debug button */}
              <button
                type="button"
                onClick={() => {
                  console.log('=== AUTH DEBUG INFO ===');
                  console.log('Current auth state:', { 
                    isAuthenticated,
                    user: user ? user.name : null 
                  });
                  console.log('localStorage auth_token:', localStorage.getItem('auth_token'));
                  console.log('localStorage user:', localStorage.getItem('user'));
                }}
                className="mt-2 w-full py-1 px-2 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                🔍 Debug Auth State
              </button>
            </div>

            <div className="text-center">
              <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
