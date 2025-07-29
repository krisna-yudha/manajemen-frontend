import { useState } from 'react';
import Layout from '@/components/Layout';

export default function TestApi() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testApiCall = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('Testing API call...');
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      console.log('API URL:', API_URL);

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        success: response.ok
      });

    } catch (error) {
      console.error('API Error:', error);
      setResult({
        error: error instanceof Error ? error.message : String(error),
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testServerConnection = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      console.log('Testing server connection to:', API_URL);

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log('Server response status:', response.status);
      const data = await response.text();
      console.log('Server response:', data);

      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        success: response.ok,
        note: 'Testing basic server connection'
      });

    } catch (error) {
      console.error('Connection Error:', error);
      setResult({
        error: error instanceof Error ? error.message : String(error),
        success: false,
        note: 'Failed to connect to server'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">API Test Tool</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">API Tests</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API URL
                </label>
                <input
                  type="text"
                  value={process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="test@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="password123"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={testServerConnection}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Testing...' : '🔗 Test Server Connection'}
                </button>
                
                <button
                  onClick={testApiCall}
                  disabled={isLoading || !email || !password}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? 'Testing...' : '🔐 Test Login API'}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Testing API...</p>
              </div>
            )}
            
            {result && (
              <div className="space-y-4">
                <div className={`p-4 rounded ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className="font-semibold">
                    {result.success ? '✅ Success' : '❌ Failed'}
                  </h3>
                  {result.note && <p className="text-sm text-gray-600">{result.note}</p>}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Response Details:</h4>
                  <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {!result && !isLoading && (
              <p className="text-gray-500 text-center py-8">No test results yet. Run a test to see results.</p>
            )}
          </div>
        </div>
        
        {/* Debug Info */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}</p>
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
