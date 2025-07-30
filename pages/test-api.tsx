import { useState } from 'react';
import Layout from '@/components/Layout';
import { authService } from '@/services/api';

export default function TestAPI() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await authService.testConnection();
      setTestResult({ type: 'success', data: result });
    } catch (error: any) {
      setTestResult({ 
        type: 'error', 
        error: error.message,
        response: error.response?.data,
        status: error.response?.status 
      });
    }
    setLoading(false);
  };

  const testLogin = async () => {
    if (!loginData.email || !loginData.password) {
      alert('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending login request with:', loginData);
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      const result = await authService.login(loginData);
      console.log('Login response:', result);
      setTestResult({ type: 'login-success', data: result });
    } catch (error: any) {
      console.error('Login error:', error);
      setTestResult({ 
        type: 'login-error', 
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">API Test Page</h1>
        
        <div className="space-y-6">
          {/* API Connection Test */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">1. Test API Connection</h2>
            <p className="text-gray-600 mb-4">
              API URL: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL}</code>
            </p>
            <button
              onClick={testConnection}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test /api/test'}
            </button>
          </div>

          {/* Login Test */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">2. Test Login</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="email"
                placeholder="Email"
                className="px-3 py-2 border border-gray-300 rounded"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
              />
              <input
                type="password"
                placeholder="Password"
                className="px-3 py-2 border border-gray-300 rounded"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing Login...' : 'Test Login'}
            </button>
          </div>

          {/* Results */}
          {testResult && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <div className={`p-4 rounded ${
                testResult.type.includes('success') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className="font-medium mb-2 capitalize">{testResult.type}</h3>
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
              <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
              <p><strong>Current Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? 'Present' : 'Not found'}</p>
              <p><strong>Current User:</strong> {typeof window !== 'undefined' && localStorage.getItem('user') ? 'Present' : 'Not found'}</p>
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.clear();
                    alert('Storage cleared');
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Clear Storage
              </button>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Common Issues & Solutions</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-red-600">CORS Error</h3>
                <p>Laravel API tidak mengizinkan request dari frontend. Pastikan CORS dikonfigurasi di Laravel.</p>
              </div>
              <div>
                <h3 className="font-medium text-red-600">Network Error</h3>
                <p>Laravel API tidak berjalan atau URL salah. Pastikan Laravel running di http://127.0.0.1:8000</p>
              </div>
              <div>
                <h3 className="font-medium text-red-600">401 Unauthorized</h3>
                <p>Email/password salah atau user tidak ditemukan.</p>
              </div>
              <div>
                <h3 className="font-medium text-red-600">422 Validation Error</h3>
                <p>Data yang dikirim tidak sesuai validasi Laravel.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
