// import { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import { User, Mail, Github, Key, Loader, Edit2, Save, X, CheckCircle } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import api from '../services/api';

// const ProfilePage = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isConnectingGithub, setIsConnectingGithub] = useState(false);
//   const [editedProfile, setEditedProfile] = useState({
//     username: '',
//     email: '',
//     github_url: '',
//     access_token: ''
//   });
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // GitHub OAuth Configuration
//   const GITHUB_CLIENT_ID =  import.meta.env.VITE_APP_GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID';
//   const GITHUB_REDIRECT_URI =  import.meta.env.VITE_APP_GITHUB_REDIRECT_URI || window.location.origin + '/auth/github/callback';
//   const GITHUB_SCOPES = 'user repo admin:repo_hook';

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const response = await api.get('/profile');
//       setProfile(response.data);
//       setEditedProfile({
//         username: response.data.username || '',
//         email: response.data.email || '',
//         github_url: response.data.github_url || '',
//         access_token: response.data.access_token || ''
//       });
//     } catch (error) {
//       console.error('Failed to fetch profile:', error);
//       setError('Failed to load profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setError('');
//     setSuccessMessage('');
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedProfile({
//       username: profile?.username || '',
//       email: profile?.email || '',
//       github_url: profile?.github_url || '',
//       access_token: profile?.access_token || ''
//     });
//     setError('');
//   };

//   const handleSave = async () => {
//     setIsSaving(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       const response = await api.put('/profile', editedProfile);
//       setProfile({ ...profile, ...editedProfile });
//       setSuccessMessage('Profile updated successfully!');
//       setIsEditing(false);
      
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       console.error('Failed to update profile:', error);
//       setError(error.response?.data?.error || 'Failed to update profile');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setEditedProfile(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleConnectGithub = async () => {
//     setIsConnectingGithub(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       // Generate a random state for CSRF protection
//       const state = Math.random().toString(36).substring(7);
//       sessionStorage.setItem('github_oauth_state', state);

//       // Build GitHub OAuth URL
//       const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=${encodeURIComponent(GITHUB_SCOPES)}&state=${state}`;

//       // Open popup window
//       const width = 600;
//       const height = 700;
//       const left = window.screenX + (window.outerWidth - width) / 2;
//       const top = window.screenY + (window.outerHeight - height) / 2;
      
//       const popup = window.open(
//         githubAuthUrl,
//         'GitHub OAuth',
//         `width=${width},height=${height},left=${left},top=${top}`
//       );

//       // Listen for messages from the popup
//       const handleMessage = async (event) => {
//         // Verify origin for security
//         if (event.origin !== window.location.origin) return;

//         if (event.data.type === 'github-oauth-success') {
//           const { code, state: returnedState } = event.data;
//           const savedState = sessionStorage.getItem('github_oauth_state');

//           // Verify state to prevent CSRF
//           if (returnedState !== savedState) {
//             setError('OAuth state mismatch. Please try again.');
//             setIsConnectingGithub(false);
//             return;
//           }

//           try {
//             // Exchange code for access token
//             const tokenResponse = await exchangeCodeForToken(code);
            
//             if (tokenResponse.access_token) {
//               // Fetch GitHub user info
//               const userInfo = await fetchGithubUser(tokenResponse.access_token);
              
//               // Update profile with GitHub data
//               const updatedProfile = {
//                 ...editedProfile,
//                 github_url: userInfo.html_url,
//                 access_token: tokenResponse.access_token
//               };
              
//               setEditedProfile(updatedProfile);
              
//               // Save to backend
//               const response = await api.put('/profile', updatedProfile);
//               setProfile({ ...profile, ...updatedProfile });
              
//               setSuccessMessage('GitHub account connected successfully!');
//               setTimeout(() => setSuccessMessage(''), 3000);
//             }
//           } catch (error) {
//             console.error('Failed to complete GitHub OAuth:', error);
//             setError('Failed to connect GitHub account. Please try again.');
//           } finally {
//             setIsConnectingGithub(false);
//             sessionStorage.removeItem('github_oauth_state');
//           }

//           window.removeEventListener('message', handleMessage);
//         } else if (event.data.type === 'github-oauth-error') {
//           setError(event.data.error || 'Failed to connect GitHub account');
//           setIsConnectingGithub(false);
//           window.removeEventListener('message', handleMessage);
//         }
//       };

//       window.addEventListener('message', handleMessage);

//       // Handle popup closed without completing OAuth
//       const checkPopupClosed = setInterval(() => {
//         if (popup && popup.closed) {
//           clearInterval(checkPopupClosed);
//           setIsConnectingGithub(false);
//           window.removeEventListener('message', handleMessage);
//         }
//       }, 1000);

//     } catch (error) {
//       console.error('Failed to initiate GitHub OAuth:', error);
//       setError('Failed to initiate GitHub connection');
//       setIsConnectingGithub(false);
//     }
//   };

//   const exchangeCodeForToken = async (code) => {
//     // This needs to be done through your backend to keep client_secret secure
//     // You'll need to create an endpoint like POST /auth/github/token
//     const response = await fetch('/auth/github/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ code }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to exchange code for token');
//     }

//     return await response.json();
//   };

//   const fetchGithubUser = async (accessToken) => {
//     const response = await fetch('https://api.github.com/user', {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Accept': 'application/vnd.github.v3+json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch GitHub user info');
//     }

//     return await response.json();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <Navbar />
//         <div className="pt-24 pb-20 px-4 flex items-center justify-center">
//           <Loader className="w-8 h-8 text-purple-400 animate-spin" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <Navbar />
//       <div className="pt-24 pb-20 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center justify-between mb-8">
//             <h1 className="text-4xl font-bold text-white">Profile</h1>
//             {!isEditing ? (
//               <button
//                 onClick={handleEdit}
//                 className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 flex items-center space-x-2"
//               >
//                 <Edit2 className="w-4 h-4" />
//                 <span>Edit Profile</span>
//               </button>
//             ) : (
//               <div className="flex space-x-2">
//                 <button
//                   onClick={handleSave}
//                   disabled={isSaving}
//                   className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-all duration-300 flex items-center space-x-2"
//                 >
//                   {isSaving ? (
//                     <Loader className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <Save className="w-4 h-4" />
//                   )}
//                   <span>{isSaving ? 'Saving...' : 'Save'}</span>
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   disabled={isSaving}
//                   className="px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-800 text-white rounded-lg transition-all duration-300 flex items-center space-x-2"
//                 >
//                   <X className="w-4 h-4" />
//                   <span>Cancel</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {error && (
//             <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
//               {error}
//             </div>
//           )}

//           {successMessage && (
//             <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200 flex items-center space-x-2">
//               <CheckCircle className="w-5 h-5" />
//               <span>{successMessage}</span>
//             </div>
//           )}
          
//           <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 mb-6">
//             <div className="flex items-center space-x-4 mb-8">
//               <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
//                 <User className="w-10 h-10 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-white">{profile?.username || 'User'}</h2>
//                 <p className="text-gray-400">{profile?.email || 'No email'}</p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <ProfileField
//                 icon={<User className="w-5 h-5 text-purple-400" />}
//                 label="Username"
//                 value={isEditing ? editedProfile.username : (profile?.username || 'Not set')}
//                 isEditing={isEditing}
//                 onChange={(value) => handleInputChange('username', value)}
//               />
              
//               <ProfileField
//                 icon={<Mail className="w-5 h-5 text-purple-400" />}
//                 label="Email"
//                 value={isEditing ? editedProfile.email : (profile?.email || 'Not set')}
//                 isEditing={isEditing}
//                 onChange={(value) => handleInputChange('email', value)}
//                 type="email"
//               />
              
//               <ProfileField
//                 icon={<Github className="w-5 h-5 text-purple-400" />}
//                 label="GitHub URL"
//                 value={isEditing ? editedProfile.github_url : (profile?.github_url || 'Not connected')}
//                 isEditing={isEditing}
//                 onChange={(value) => handleInputChange('github_url', value)}
//                 isLink={!isEditing && !!profile?.github_url}
//               />
              
//               <ProfileField
//                 icon={<Key className="w-5 h-5 text-purple-400" />}
//                 label="Access Token"
//                 value={isEditing ? editedProfile.access_token : (profile?.access_token ? '••••••••••••••••' : 'Not configured')}
//                 isEditing={isEditing}
//                 onChange={(value) => handleInputChange('access_token', value)}
//                 sensitive={!isEditing}
//                 type="password"
//                 placeholder={isEditing ? "Enter new token to update" : ""}
//               />
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// const ProfileField = ({ icon, label, value, isLink, sensitive, isEditing, onChange, type = 'text', placeholder }) => (
//   <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg">
//     <div className="mt-1">{icon}</div>
//     <div className="flex-1">
//       <p className="text-gray-400 text-sm mb-1">{label}</p>
//       {isEditing ? (
//         <input
//           type={type}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={placeholder}
//           className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
//         />
//       ) : isLink ? (
//         <a href={value} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
//           {value}
//         </a>
//       ) : (
//         <p className="text-white font-medium">{value}</p>
//       )}
//     </div>
//   </div>
// );

// export default ProfilePage;


import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { User, Mail, Github, Key, Loader, Edit2, Save, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user, isDark } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    username: '',
    email: '',
    github_url: '',
    access_token: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // GitHub OAuth Configuration
  const GITHUB_CLIENT_ID =  import.meta.env.VITE_APP_GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID';
  const GITHUB_REDIRECT_URI =  import.meta.env.VITE_APP_GITHUB_REDIRECT_URI || window.location.origin + '/auth/github/callback';
  const GITHUB_SCOPES = 'user repo admin:repo_hook';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
      setEditedProfile({
        username: response.data.username || '',
        email: response.data.email || '',
        github_url: response.data.github_url || '',
        access_token: response.data.access_token || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({
      username: profile?.username || '',
      email: profile?.email || '',
      github_url: profile?.github_url || '',
      access_token: profile?.access_token || ''
    });
    setError('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.put('/profile', editedProfile);
      setProfile({ ...profile, ...editedProfile });
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConnectGithub = async () => {
    setIsConnectingGithub(true);
    setError('');
    setSuccessMessage('');

    try {
      // Generate a random state for CSRF protection
      const state = Math.random().toString(36).substring(7);
      sessionStorage.setItem('github_oauth_state', state);

      // Build GitHub OAuth URL
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=${encodeURIComponent(GITHUB_SCOPES)}&state=${state}`;

      // Open popup window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        githubAuthUrl,
        'GitHub OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for messages from the popup
      const handleMessage = async (event) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'github-oauth-success') {
          const { code, state: returnedState } = event.data;
          const savedState = sessionStorage.getItem('github_oauth_state');

          // Verify state to prevent CSRF
          if (returnedState !== savedState) {
            setError('OAuth state mismatch. Please try again.');
            setIsConnectingGithub(false);
            return;
          }

          try {
            // Exchange code for access token
            const tokenResponse = await exchangeCodeForToken(code);
            
            if (tokenResponse.access_token) {
              // Fetch GitHub user info
              const userInfo = await fetchGithubUser(tokenResponse.access_token);
              
              // Update profile with GitHub data
              const updatedProfile = {
                ...editedProfile,
                github_url: userInfo.html_url,
                access_token: tokenResponse.access_token
              };
              
              setEditedProfile(updatedProfile);
              
              // Save to backend
              const response = await api.put('/profile', updatedProfile);
              setProfile({ ...profile, ...updatedProfile });
              
              setSuccessMessage('GitHub account connected successfully!');
              setTimeout(() => setSuccessMessage(''), 3000);
            }
          } catch (error) {
            console.error('Failed to complete GitHub OAuth:', error);
            setError('Failed to connect GitHub account. Please try again.');
          } finally {
            setIsConnectingGithub(false);
            sessionStorage.removeItem('github_oauth_state');
          }

          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'github-oauth-error') {
          setError(event.data.error || 'Failed to connect GitHub account');
          setIsConnectingGithub(false);
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      // Handle popup closed without completing OAuth
      const checkPopupClosed = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(checkPopupClosed);
          setIsConnectingGithub(false);
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to initiate GitHub OAuth:', error);
      setError('Failed to initiate GitHub connection');
      setIsConnectingGithub(false);
    }
  };

  const exchangeCodeForToken = async (code) => {
    // This needs to be done through your backend to keep client_secret secure
    // You'll need to create an endpoint like POST /auth/github/token
    const response = await fetch('/auth/github/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return await response.json();
  };

  const fetchGithubUser = async (accessToken) => {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub user info');
    }

    return await response.json();
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
      }`}>
        <Navbar />
        <div className="pt-24 pb-20 px-4 flex items-center justify-center">
          <Loader className={`w-8 h-8 animate-spin ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
    }`}>
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Profile
            </h1>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-all duration-300 flex items-center space-x-2"
                >
                  {isSaving ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 text-white ${
                    isDark 
                      ? 'bg-slate-600 hover:bg-slate-700 disabled:bg-slate-800' 
                      : 'bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          )}
          
          <div className={`backdrop-blur-xl rounded-2xl p-8 border mb-6 transition-colors duration-500 ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-white/70 border-gray-200 shadow-xl'
          }`}>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {profile?.username || 'User'}
                </h2>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {profile?.email || 'No email'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <ProfileField
                icon={<User className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
                label="Username"
                value={isEditing ? editedProfile.username : (profile?.username || 'Not set')}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('username', value)}
                isDark={isDark}
              />
              
              <ProfileField
                icon={<Mail className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
                label="Email"
                value={isEditing ? editedProfile.email : (profile?.email || 'Not set')}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('email', value)}
                type="email"
                isDark={isDark}
              />
              
              <ProfileField
                icon={<Github className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
                label="GitHub URL"
                value={isEditing ? editedProfile.github_url : (profile?.github_url || 'Not connected')}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('github_url', value)}
                isLink={!isEditing && !!profile?.github_url}
                isDark={isDark}
              />
              
              <ProfileField
                icon={<Key className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
                label="Access Token"
                value={isEditing ? editedProfile.access_token : (profile?.access_token ? '••••••••••••••••' : 'Not configured')}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('access_token', value)}
                sensitive={!isEditing}
                type="password"
                placeholder={isEditing ? "Enter new token to update" : ""}
                isDark={isDark}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value, isLink, sensitive, isEditing, onChange, type = 'text', placeholder, isDark }) => (
  <div className={`flex items-start space-x-4 p-4 rounded-lg transition-colors duration-500 ${
    isDark 
      ? 'bg-slate-700/30' 
      : 'bg-gray-100/50'
  }`}>
    <div className="mt-1">{icon}</div>
    <div className="flex-1">
      <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </p>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg transition-colors ${
            isDark 
              ? 'bg-slate-800 border-slate-600 text-white focus:outline-none focus:border-purple-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:border-purple-500'
          }`}
        />
      ) : isLink ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`transition-colors ${
            isDark 
              ? 'text-purple-400 hover:text-purple-300' 
              : 'text-purple-600 hover:text-purple-700'
          }`}
        >
          {value}
        </a>
      ) : (
        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </p>
      )}
    </div>
  </div>
);

export default ProfilePage;