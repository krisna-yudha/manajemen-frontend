import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebugPanel() {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  const tokenInStorage = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const userInStorage = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div>
          <span className="font-semibold">Context:</span>
          <br />
          • isAuthenticated: <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>{String(isAuthenticated)}</span>
          <br />
          • isLoading: <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>{String(isLoading)}</span>
          <br />
          • user: {user ? <span className="text-green-400">{user.name}</span> : <span className="text-red-400">null</span>}
        </div>
        <div>
          <span className="font-semibold">Storage:</span>
          <br />
          • token: <span className={tokenInStorage ? 'text-green-400' : 'text-red-400'}>{tokenInStorage ? 'present' : 'missing'}</span>
          <br />
          • user: <span className={userInStorage ? 'text-green-400' : 'text-red-400'}>{userInStorage ? 'present' : 'missing'}</span>
        </div>
        <div>
          <span className="font-semibold">Page:</span> {typeof window !== 'undefined' ? window.location.pathname : 'unknown'}
        </div>
      </div>
    </div>
  );
}
