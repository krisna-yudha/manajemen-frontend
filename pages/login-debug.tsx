import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api';
import Layout from '@/components/Layout';

export default function LoginDebug() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

  const addResult = (stepName: string, data: any) => {
    setResults(prev => [...prev, { step: stepName, data, timestamp: new Date().toISOString() }]);
  };

  const testStep1_ApiCall = async () => {
    setStep(1);
    addResult('Step 1: Starting API call', { email, password: '[PROVIDED]' });
    
    try {
      const result = await authService.login({ email, password });
      addResult('Step 1: API Response', result);
      setStep(2);
      return result;
    } catch (error) {
      addResult('Step 1: API Error', error);
      return null;
    }
  };

  const testStep2_UpdateContext = async (apiResult: any) => {
    if (!apiResult || apiResult.status !== 'success') {
      addResult('Step 2: Skipped - API failed', null);
      return;
    }

    setStep(2);
    addResult('Step 2: Updating AuthContext', { user: apiResult.user, token: apiResult.token });
    
    try {
      login(apiResult.user!, apiResult.token!);
      addResult('Step 2: Context Updated', { isAuthenticated, user });
      setStep(3);
    } catch (error) {
      addResult('Step 2: Context Error', error);
    }
  };

  const testStep3_CheckStorage = () => {
    setStep(3);
    const storageData = {
      token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
      user: typeof window !== 'undefined' ? localStorage.getItem('user') : null,
    };
    addResult('Step 3: Storage Check', storageData);
    setStep(4);
  };

  const testStep4_Redirect = async () => {
    setStep(4);
    addResult('Step 4: Attempting redirect', { to: '/dashboard' });
    
    try {
      await router.push('/dashboard');
      addResult('Step 4: Redirect completed', { success: true });
    } catch (error) {
      addResult('Step 4: Redirect failed', error);
    }
  };

  const runFullTest = async () => {
    setResults([]);
    setStep(0);
    
    const apiResult = await testStep1_ApiCall();
    if (apiResult) {
      await testStep2_UpdateContext(apiResult);
      testStep3_CheckStorage();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      await testStep4_Redirect();
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Login Debug Tool</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <div className="space-y-2">
                <button
                  onClick={runFullTest}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  🚀 Run Full Login Test
                </button>
                
                <button
                  onClick={testStep1_ApiCall}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  1️⃣ Test API Call Only
                </button>
                
                <button
                  onClick={testStep3_CheckStorage}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
                >
                  3️⃣ Check Storage
                </button>
                
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.clear();
                    }
                    setResults([]);
                    addResult('Storage cleared', null);
                  }}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  🗑️ Clear Storage
                </button>
              </div>
            </div>

            {/* Current State */}
            <div className="mt-6 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Current Auth State:</h3>
              <div className="text-sm space-y-1">
                <p>Authenticated: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{String(isAuthenticated)}</span></p>
                <p>User: {user ? <span className="text-green-600">{user.name}</span> : <span className="text-red-600">null</span>}</p>
                <p>Current Step: {step}</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900">{result.step}</h3>
                  <p className="text-xs text-gray-500">{result.timestamp}</p>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ))}
              
              {results.length === 0 && (
                <p className="text-gray-500 text-center py-8">No results yet. Run a test to see results.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
