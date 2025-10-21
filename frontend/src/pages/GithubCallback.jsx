// import { useEffect, useRef } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Loader2 } from 'lucide-react';

// const GitHubCallback = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { githubAuth } = useAuth();
//   const hasCalledAuth = useRef(false);
//   const isProcessing = useRef(false);

//   useEffect(() => {
//     const handleCallback = async () => {
//       // Prevent any concurrent calls
//       if (hasCalledAuth.current || isProcessing.current) {
//         console.log('Auth already called or in progress, skipping...');
//         return;
//       }

//       const code = searchParams.get('code');
//       const error = searchParams.get('error');

//       console.log('=== GitHub Callback START ===');
//       console.log('Code:', code ? `${code.substring(0, 10)}...` : 'none');
//       console.log('Error:', error);
//       console.log('hasCalledAuth:', hasCalledAuth.current);
//       console.log('isProcessing:', isProcessing.current);

//       if (error) {
//         console.error('GitHub OAuth error:', error);
//         alert(`GitHub authentication failed: ${error}`);
//         navigate('/auth');
//         return;
//       }

//       if (!code) {
//         console.log('No code found, redirecting to /auth');
//         navigate('/auth');
//         return;
//       }

//       // Mark as processing immediately
//       isProcessing.current = true;
//       hasCalledAuth.current = true;

//       try {
//         console.log('Attempting GitHub auth with code...');
//         await githubAuth(code);
//         console.log('GitHub auth successful!');
//         // Navigation will be handled by AuthContext after successful auth
//       } catch (error) {
//         console.error('GitHub auth failed:', error);
//         isProcessing.current = false;
//         hasCalledAuth.current = false; // Reset on error so user can retry
//         alert(`Authentication failed: ${error.message || 'Unknown error'}`);
//         navigate('/auth');
//       } finally {
//         console.log('=== GitHub Callback END ===');
//       }
//     };

//     handleCallback();
    
//     // Empty dependency array - only run once on mount
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//       <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
//           <p className="text-white text-lg">Authenticating with GitHub...</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GitHubCallback;

import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { githubAuth, isDark } = useAuth();
  const hasCalledAuth = useRef(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent any concurrent calls
      if (hasCalledAuth.current || isProcessing.current) {
        console.log('Auth already called or in progress, skipping...');
        return;
      }

      const code = searchParams.get('code');
      const error = searchParams.get('error');

      console.log('=== GitHub Callback START ===');
      console.log('Code:', code ? `${code.substring(0, 10)}...` : 'none');
      console.log('Error:', error);
      console.log('hasCalledAuth:', hasCalledAuth.current);
      console.log('isProcessing:', isProcessing.current);

      if (error) {
        console.error('GitHub OAuth error:', error);
        alert(`GitHub authentication failed: ${error}`);
        navigate('/auth');
        return;
      }

      if (!code) {
        console.log('No code found, redirecting to /auth');
        navigate('/auth');
        return;
      }

      // Mark as processing immediately
      isProcessing.current = true;
      hasCalledAuth.current = true;

      try {
        console.log('Attempting GitHub auth with code...');
        await githubAuth(code);
        console.log('GitHub auth successful!');
        // Navigation will be handled by AuthContext after successful auth
      } catch (error) {
        console.error('GitHub auth failed:', error);
        isProcessing.current = false;
        hasCalledAuth.current = false; // Reset on error so user can retry
        alert(`Authentication failed: ${error.message || 'Unknown error'}`);
        navigate('/auth');
      } finally {
        console.log('=== GitHub Callback END ===');
      }
    };

    handleCallback();
    
    // Empty dependency array - only run once on mount
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
    }`}>
      <div className={`backdrop-blur-xl p-8 rounded-2xl shadow-2xl border transition-colors duration-500 ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700' 
          : 'bg-white/70 border-gray-200'
      }`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={`w-12 h-12 animate-spin ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`} />
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Authenticating with GitHub...
          </p>
        </div>
      </div>
    </div>
  );
};

export default GitHubCallback;