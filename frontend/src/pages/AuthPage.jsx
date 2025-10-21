// // import { useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import { Zap, Github } from 'lucide-react';
// // import { useAuth } from '../context/AuthContext';

// // const AuthPage = () => {
// //   const [isLogin, setIsLogin] = useState(true);
// //   const [formData, setFormData] = useState({ name: '', username: '', password: '' });
// //   const { login, signup } = useAuth();
// //   const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
// //   const REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/github/callback`;

// //   const handleGitHubLogin = () => {
// //     const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo,user:email,admin:repo_hook`;
// //     window.location.href = githubAuthUrl;
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       if (isLogin) {
// //         await login(formData.username, formData.password);
// //       } else {
// //         await signup(formData.name, formData.username, formData.password);
// //       }
// //     } catch (error) {
// //       console.error('Auth error:', error);
// //       alert(isLogin ? 'Login failed. Please check your credentials.' : 'Signup failed. Please try again.');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
// //       <Link
// //         to="/"
// //         className="absolute top-6 left-6 text-white hover:text-purple-400 transition-colors"
// //       >
// //         ← Back
// //       </Link>
      
// //       <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 animate-fade-in">
// //         <div className="text-center mb-8">
// //           <div className="flex justify-center mb-4">
// //             <Zap className="w-12 h-12 text-purple-400" />
// //           </div>
// //           <h2 className="text-3xl font-bold text-white mb-2">
// //             {isLogin ? 'Welcome Back' : 'Create Account'}
// //           </h2>
// //           <p className="text-gray-400">
// //             {isLogin ? 'Sign in to continue to PatchForge' : 'Join PatchForge today'}
// //           </p>
// //         </div>

// //         <button
// //           onClick={handleGitHubLogin}
// //           className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mb-6"
// //         >
// //           <Github className="w-5 h-5" />
// //           Continue with GitHub
// //         </button>

// //         <div className="relative mb-6">
// //           <div className="absolute inset-0 flex items-center">
// //             <div className="w-full border-t border-gray-600"></div>
// //           </div>
// //           <div className="relative flex justify-center text-sm">
// //             <span className="px-2 bg-slate-800/50 text-gray-400">Or continue with username</span>
// //           </div>
// //         </div>

// //         <div className="space-y-4">
// //           {!isLogin && (
// //             <div>
// //               <div className="block text-sm font-medium text-gray-300 mb-2">Name</div>
// //               <input
// //                 type="text"
// //                 value={formData.name}
// //                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //                 className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
// //                 placeholder="John Doe"
// //               />
// //             </div>
// //           )}

// //           <div>
// //             <div className="block text-sm font-medium text-gray-300 mb-2">Username</div>
// //             <input
// //               type="text"
// //               value={formData.username}
// //               onChange={(e) => setFormData({ ...formData, username: e.target.value })}
// //               className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
// //               placeholder="johndoe"
// //             />
// //           </div>

// //           <div>
// //             <div className="block text-sm font-medium text-gray-300 mb-2">Password</div>
// //             <input
// //               type="password"
// //               value={formData.password}
// //               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// //               className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
// //               placeholder="••••••••"
// //             />
// //           </div>

// //           <button
// //             onClick={handleSubmit}
// //             className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
// //           >
// //             {isLogin ? 'Sign In' : 'Sign Up'}
// //           </button>
// //         </div>

// //         <p className="text-center text-gray-400 mt-6">
// //           {isLogin ? "Don't have an account? " : "Already have an account? "}
// //           <button
// //             onClick={() => setIsLogin(!isLogin)}
// //             className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
// //           >
// //             {isLogin ? 'Sign Up' : 'Sign In'}
// //           </button>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AuthPage;


// // import { useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import { Zap, Github } from 'lucide-react';
// // import { useAuth } from '../context/AuthContext';

// // const AuthPage = () => {
// //   const [isLogin, setIsLogin] = useState(true);
// //   const [formData, setFormData] = useState({ name: '', username: '', password: '' });
// //   const { login, signup, isDark } = useAuth();
// //   const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
// //   const REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/github/callback`;

// //   const handleGitHubLogin = () => {
// //     const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo,user:email,admin:repo_hook`;
// //     window.location.href = githubAuthUrl;
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       if (isLogin) {
// //         await login(formData.username, formData.password);
// //       } else {
// //         await signup(formData.name, formData.username, formData.password);
// //       }
// //     } catch (error) {
// //       console.error('Auth error:', error);
// //       alert(isLogin ? 'Login failed. Please check your credentials.' : 'Signup failed. Please try again.');
// //     }
// //   };

// //   return (
// //     <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${
// //       isDark 
// //         ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
// //         : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
// //     }`}>
// //       <Link
// //         to="/"
// //         className={`absolute top-6 left-6 transition-colors ${
// //           isDark 
// //             ? 'text-white hover:text-purple-400' 
// //             : 'text-gray-900 hover:text-purple-600'
// //         }`}
// //       >
// //         ← Back
// //       </Link>
      
// //       <div className={`backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border animate-fade-in transition-colors duration-500 ${
// //         isDark 
// //           ? 'bg-slate-800/50 border-slate-700' 
// //           : 'bg-white/70 border-gray-200'
// //       }`}>
// //         <div className="text-center mb-8">
// //           <div className="flex justify-center mb-4">
// //             <Zap className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
// //           </div>
// //           <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
// //             {isLogin ? 'Welcome Back' : 'Create Account'}
// //           </h2>
// //           <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
// //             {isLogin ? 'Sign in to continue to PatchForge' : 'Join PatchForge today'}
// //           </p>
// //         </div>

// //         <button
// //           onClick={handleGitHubLogin}
// //           className={`w-full text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mb-6 ${
// //             isDark 
// //               ? 'bg-slate-700 hover:bg-slate-600' 
// //               : 'bg-gray-700 hover:bg-gray-600'
// //           }`}
// //         >
// //           <Github className="w-5 h-5" />
// //           Continue with GitHub
// //         </button>

// //         <div className="relative mb-6">
// //           <div className="absolute inset-0 flex items-center">
// //             <div className={`w-full border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
// //           </div>
// //           <div className="relative flex justify-center text-sm">
// //             <span className={`px-2 ${
// //               isDark 
// //                 ? 'bg-slate-800/50 text-gray-400' 
// //                 : 'bg-white/70 text-gray-600'
// //             }`}>
// //               Or continue with username
// //             </span>
// //           </div>
// //         </div>

// //         <div className="space-y-4">
// //           {!isLogin && (
// //             <div>
// //               <div className={`block text-sm font-medium mb-2 ${
// //                 isDark ? 'text-gray-300' : 'text-gray-700'
// //               }`}>
// //                 Name
// //               </div>
// //               <input
// //                 type="text"
// //                 value={formData.name}
// //                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
// //                   isDark 
// //                     ? 'bg-slate-700/50 border-slate-600 text-white' 
// //                     : 'bg-white border-gray-300 text-gray-900'
// //                 }`}
// //                 placeholder="John Doe"
// //               />
// //             </div>
// //           )}

// //           <div>
// //             <div className={`block text-sm font-medium mb-2 ${
// //               isDark ? 'text-gray-300' : 'text-gray-700'
// //             }`}>
// //               Username
// //             </div>
// //             <input
// //               type="text"
// //               value={formData.username}
// //               onChange={(e) => setFormData({ ...formData, username: e.target.value })}
// //               className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
// //                 isDark 
// //                   ? 'bg-slate-700/50 border-slate-600 text-white' 
// //                   : 'bg-white border-gray-300 text-gray-900'
// //               }`}
// //               placeholder="johndoe"
// //             />
// //           </div>

// //           <div>
// //             <div className={`block text-sm font-medium mb-2 ${
// //               isDark ? 'text-gray-300' : 'text-gray-700'
// //             }`}>
// //               Password
// //             </div>
// //             <input
// //               type="password"
// //               value={formData.password}
// //               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// //               className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
// //                 isDark 
// //                   ? 'bg-slate-700/50 border-slate-600 text-white' 
// //                   : 'bg-white border-gray-300 text-gray-900'
// //               }`}
// //               placeholder="••••••••"
// //             />
// //           </div>

// //           <button
// //             onClick={handleSubmit}
// //             className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
// //           >
// //             {isLogin ? 'Sign In' : 'Sign Up'}
// //           </button>
// //         </div>

// //         <p className={`text-center mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
// //           {isLogin ? "Don't have an account? " : "Already have an account? "}
// //           <button
// //             onClick={() => setIsLogin(!isLogin)}
// //             className={`font-semibold transition-colors ${
// //               isDark 
// //                 ? 'text-purple-400 hover:text-purple-300' 
// //                 : 'text-purple-600 hover:text-purple-700'
// //             }`}
// //           >
// //             {isLogin ? 'Sign Up' : 'Sign In'}
// //           </button>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AuthPage;

// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Zap, Github, Moon, Sun } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({ username: '', email: '', password: '' });
//   const { login, signup, isDark, toggleTheme } = useAuth();
//   const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
//   const REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/github/callback`;

//   const handleGitHubLogin = () => {
//     const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo,user:email,admin:repo_hook`;
//     window.location.href = githubAuthUrl;
//   };

//   const handleSubmit = async () => {
//     try {
//       if (isLogin) {
//         await login(formData.username, formData.password);
//       } else {
//         await signup(formData.username, formData.email, formData.password);
//       }
//     } catch (error) {
//       console.error('Auth error:', error);
//       alert(isLogin ? 'Login failed. Please check your credentials.' : 'Signup failed. Please try again.');
//     }
//   };

//   return (
//     <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${
//       isDark 
//         ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
//         : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
//     }`}>
//       <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <Link to="/" className="flex items-center space-x-2">
//               <Zap className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
//               <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                 PatchForge
//               </span>
//             </Link>
//             <button
//               onClick={toggleTheme}
//               className={`p-2 rounded-lg transition-all duration-300 ${
//                 isDark 
//                   ? 'bg-slate-800/50 hover:bg-slate-700 text-purple-400' 
//                   : 'bg-white/70 hover:bg-gray-100 text-purple-600'
//               } backdrop-blur-xl border ${
//                 isDark ? 'border-slate-700' : 'border-gray-200'
//               }`}
//               aria-label="Toggle theme"
//             >
//               {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>
//       </nav>
      
//       <div className={`backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border animate-fade-in transition-colors duration-500 ${
//         isDark 
//           ? 'bg-slate-800/50 border-slate-700' 
//           : 'bg-white/70 border-gray-200'
//       }`}>
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <Zap className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
//           </div>
//           <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//             {isLogin ? 'Welcome Back' : 'Create Account'}
//           </h2>
//           <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
//             {isLogin ? 'Sign in to continue to PatchForge' : 'Join PatchForge today'}
//           </p>
//         </div>

//         <button
//           onClick={handleGitHubLogin}
//           className={`w-full text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mb-6 ${
//             isDark 
//               ? 'bg-slate-700 hover:bg-slate-600' 
//               : 'bg-gray-700 hover:bg-gray-600'
//           }`}
//         >
//           <Github className="w-5 h-5" />
//           Continue with GitHub
//         </button>

//         <div className="relative mb-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className={`w-full border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className={`px-2 ${
//               isDark 
//                 ? 'bg-slate-800/50 text-gray-400' 
//                 : 'bg-white/70 text-gray-600'
//             }`}>
//               Or continue with username
//             </span>
//           </div>
//         </div>

//         <div className="space-y-4">
//           {!isLogin && (
//             <div>
//               <div className={`block text-sm font-medium mb-2 ${
//                 isDark ? 'text-gray-300' : 'text-gray-700'
//               }`}>
//                 Username
//               </div>
//               <input
//                 type="text"
//                 value={formData.username}
//                 onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
//                   isDark 
//                     ? 'bg-slate-700/50 border-slate-600 text-white' 
//                     : 'bg-white border-gray-300 text-gray-900'
//                 }`}
//                 placeholder="John Doe"
//               />
//             </div>
//           )}

//           <div>
//             <div className={`block text-sm font-medium mb-2 ${
//               isDark ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               email
//             </div>
//             <input
//               type="text"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
//                 isDark 
//                   ? 'bg-slate-700/50 border-slate-600 text-white' 
//                   : 'bg-white border-gray-300 text-gray-900'
//               }`}
//               placeholder="shetty@me.com"
//             />
//           </div>

//           <div>
//             <div className={`block text-sm font-medium mb-2 ${
//               isDark ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Password
//             </div>
//             <input
//               type="password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
//                 isDark 
//                   ? 'bg-slate-700/50 border-slate-600 text-white' 
//                   : 'bg-white border-gray-300 text-gray-900'
//               }`}
//               placeholder="••••••••"
//             />
//           </div>

//           <button
//             onClick={handleSubmit}
//             className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
//           >
//             {isLogin ? 'Sign In' : 'Sign Up'}
//           </button>
//         </div>

//         <p className={`text-center mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//           {isLogin ? "Don't have an account? " : "Already have an account? "}
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className={`font-semibold transition-colors ${
//               isDark 
//                 ? 'text-purple-400 hover:text-purple-300' 
//                 : 'text-purple-600 hover:text-purple-700'
//             }`}
//           >
//             {isLogin ? 'Sign Up' : 'Sign In'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Github, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { login, signup, isDark, toggleTheme } = useAuth();
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/github/callback`;

  const handleGitHubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo,user:email,admin:repo_hook`;
    window.location.href = githubAuthUrl;
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        await signup(formData.username, formData.email, formData.password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert(isLogin ? 'Login failed. Please check your credentials.' : 'Signup failed. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
    }`}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                PatchForge
              </span>
            </Link>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-800/50 hover:bg-slate-700 text-purple-400' 
                  : 'bg-white/70 hover:bg-gray-100 text-purple-600'
              } backdrop-blur-xl border ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>
      
      <div className={`backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border animate-fade-in transition-colors duration-500 ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700' 
          : 'bg-white/70 border-gray-200'
      }`}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Zap className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {isLogin ? 'Sign in to continue to PatchForge' : 'Join PatchForge today'}
          </p>
        </div>

        <button
          onClick={handleGitHubLogin}
          className={`w-full text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mb-6 ${
            isDark 
              ? 'bg-slate-700 hover:bg-slate-600' 
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${
              isDark 
                ? 'bg-slate-800/50 text-gray-400' 
                : 'bg-white/70 text-gray-600'
            }`}>
              Or continue with username
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Username
            </div>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                isDark 
                  ? 'bg-slate-700/50 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="johndoe"
            />
          </div>

          {!isLogin && (
            <div>
              <div className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="shetty@me.com"
              />
            </div>
          )}

          <div>
            <div className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                isDark 
                  ? 'bg-slate-700/50 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        <p className={`text-center mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`font-semibold transition-colors ${
              isDark 
                ? 'text-purple-400 hover:text-purple-300' 
                : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;