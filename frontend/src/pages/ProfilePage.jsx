import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { User, Mail, Github, Key, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="pt-24 pb-20 px-4 flex items-center justify-center">
          <Loader className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Profile</h1>
          
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 mb-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profile?.username || 'User'}</h2>
                <p className="text-gray-400">{profile?.email || 'No email'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <ProfileField
                icon={<User className="w-5 h-5 text-purple-400" />}
                label="Username"
                value={profile?.username || 'Not set'}
              />
              
              <ProfileField
                icon={<Mail className="w-5 h-5 text-purple-400" />}
                label="Email"
                value={profile?.email || 'Not set'}
              />
              
              <ProfileField
                icon={<Github className="w-5 h-5 text-purple-400" />}
                label="GitHub URL"
                value={profile?.github_url || 'Not connected'}
                isLink={!!profile?.github_url}
              />
              
              <ProfileField
                icon={<Key className="w-5 h-5 text-purple-400" />}
                label="Access Token"
                value={profile?.access_token ? '••••••••••••••••' : 'Not configured'}
                sensitive
              />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
                <Github className="w-5 h-5" />
                <span>Connect GitHub Account</span>
              </button>
              <button className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value, isLink, sensitive }) => (
  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg">
    <div className="mt-1">{icon}</div>
    <div className="flex-1">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      {isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
          {value}
        </a>
      ) : (
        <p className="text-white font-medium">{value}</p>
      )}
    </div>
  </div>
);

export default ProfilePage;