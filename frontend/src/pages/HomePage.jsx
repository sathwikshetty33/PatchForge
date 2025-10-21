// import Navbar from '../components/Navbar';
// import { Github, Code, Mail, FileText, Settings } from 'lucide-react';

// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <Navbar />
//       <div className="pt-24 pb-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 mb-8 animate-fade-in">
//             <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
//             <p className="text-gray-300 text-lg">Welcome to PatchForge! Monitor your repositories and release notes.</p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6 mb-8">
//             <StatCard title="Active Repos" value="5" icon={<Github className="w-8 h-8 text-purple-400" />} />
//             <StatCard title="PRs Analyzed" value="127" icon={<Code className="w-8 h-8 text-purple-400" />} />
//             <StatCard title="Notes Sent" value="89" icon={<Mail className="w-8 h-8 text-purple-400" />} />
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
//               <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
//               <div className="space-y-4">
//                 <ActivityItem repo="user/awesome-project" action="PR merged - Release notes sent" time="2 hours ago" />
//                 <ActivityItem repo="org/backend-api" action="New webhook configured" time="5 hours ago" />
//                 <ActivityItem repo="user/frontend-app" action="PR analyzed" time="1 day ago" />
//               </div>
//             </div>

//             <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
//               <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
//               <div className="space-y-3">
//                 <ActionButton text="Connect New Repository" icon={<Github className="w-5 h-5" />} />
//                 <ActionButton text="View All Release Notes" icon={<FileText className="w-5 h-5" />} />
//                 <ActionButton text="Configure Settings" icon={<Settings className="w-5 h-5" />} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon }) => (
//   <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300">
//     <div className="flex items-center justify-between mb-4">
//       <h3 className="text-gray-400 font-medium">{title}</h3>
//       {icon}
//     </div>
//     <p className="text-4xl font-bold text-white">{value}</p>
//   </div>
// );

// const ActivityItem = ({ repo, action, time }) => (
//   <div className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
//     <Code className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
//     <div>
//       <p className="text-white font-medium">{repo}</p>
//       <p className="text-gray-400 text-sm">{action}</p>
//       <p className="text-gray-500 text-xs mt-1">{time}</p>
//     </div>
//   </div>
// );

// const ActionButton = ({ text, icon }) => (
//   <button className="w-full flex items-center space-x-3 p-4 bg-slate-700/30 hover:bg-purple-600/20 border border-slate-600 hover:border-purple-500 rounded-lg transition-all duration-300 text-white">
//     {icon}
//     <span>{text}</span>
//   </button>
// );

// export default HomePage;

// import Navbar from '../components/Navbar';
// import { Github, Code, Mail, FileText, Settings } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// const HomePage = () => {
//   const { isDark } = useAuth();

//   return (
//     <div className={`min-h-screen transition-colors duration-500 ${
//       isDark 
//         ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
//         : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
//     }`}>
//       <Navbar />
//       <div className="pt-24 pb-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className={`backdrop-blur-xl rounded-2xl p-8 border mb-8 animate-fade-in transition-colors duration-500 ${
//             isDark 
//               ? 'bg-slate-800/50 border-slate-700' 
//               : 'bg-white/70 border-gray-200 shadow-xl'
//           }`}>
//             <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//               Dashboard
//             </h1>
//             <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//               Welcome to PatchForge! Monitor your repositories and release notes.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6 mb-8">
//             <StatCard title="Active Repos" value="5" icon={<Github className="w-8 h-8 text-purple-500" />} isDark={isDark} />
//             <StatCard title="PRs Analyzed" value="127" icon={<Code className="w-8 h-8 text-purple-500" />} isDark={isDark} />
//             <StatCard title="Notes Sent" value="89" icon={<Mail className="w-8 h-8 text-purple-500" />} isDark={isDark} />
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-colors duration-500 ${
//               isDark 
//                 ? 'bg-slate-800/50 border-slate-700' 
//                 : 'bg-white/70 border-gray-200 shadow-xl'
//             }`}>
//               <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                 Recent Activity
//               </h3>
//               <div className="space-y-4">
//                 <ActivityItem 
//                   repo="user/awesome-project" 
//                   action="PR merged - Release notes sent" 
//                   time="2 hours ago" 
//                   isDark={isDark}
//                 />
//                 <ActivityItem 
//                   repo="org/backend-api" 
//                   action="New webhook configured" 
//                   time="5 hours ago" 
//                   isDark={isDark}
//                 />
//                 <ActivityItem 
//                   repo="user/frontend-app" 
//                   action="PR analyzed" 
//                   time="1 day ago" 
//                   isDark={isDark}
//                 />
//               </div>
//             </div>

//             <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-colors duration-500 ${
//               isDark 
//                 ? 'bg-slate-800/50 border-slate-700' 
//                 : 'bg-white/70 border-gray-200 shadow-xl'
//             }`}>
//               <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                 Quick Actions
//               </h3>
//               <div className="space-y-3">
//                 <ActionButton 
//                   text="Connect New Repository" 
//                   icon={<Github className="w-5 h-5" />} 
//                   isDark={isDark}
//                 />
//                 <ActionButton 
//                   text="View All Release Notes" 
//                   icon={<FileText className="w-5 h-5" />} 
//                   isDark={isDark}
//                 />
//                 <ActionButton 
//                   text="Configure Settings" 
//                   icon={<Settings className="w-5 h-5" />} 
//                   isDark={isDark}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon, isDark }) => (
//   <div className={`backdrop-blur-xl p-6 rounded-2xl border transition-all duration-300 ${
//     isDark 
//       ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500' 
//       : 'bg-white/70 border-gray-200 hover:border-purple-400 shadow-lg hover:shadow-xl'
//   }`}>
//     <div className="flex items-center justify-between mb-4">
//       <h3 className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//         {title}
//       </h3>
//       {icon}
//     </div>
//     <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
//       {value}
//     </p>
//   </div>
// );

// const ActivityItem = ({ repo, action, time, isDark }) => (
//   <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
//     isDark 
//       ? 'bg-slate-700/30 hover:bg-slate-700/50' 
//       : 'bg-gray-100/50 hover:bg-gray-200/70'
//   }`}>
//     <Code className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
//     <div>
//       <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
//         {repo}
//       </p>
//       <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//         {action}
//       </p>
//       <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
//         {time}
//       </p>
//     </div>
//   </div>
// );

// const ActionButton = ({ text, icon, isDark }) => (
//   <button className={`w-full flex items-center space-x-3 p-4 border rounded-lg transition-all duration-300 ${
//     isDark 
//       ? 'bg-slate-700/30 hover:bg-purple-600/20 border-slate-600 hover:border-purple-500 text-white' 
//       : 'bg-gray-50 hover:bg-purple-50 border-gray-200 hover:border-purple-400 text-gray-900'
//   }`}>
//     {icon}
//     <span>{text}</span>
//   </button>
// );

// export default HomePage;

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Github, Mail, FileText, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isDark, API_URL, getToken } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [releaseNotes, setReleaseNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const reposResponse = await fetch(`${API_URL}/repositories`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        const reposData = await reposResponse.json();
        setRepositories(Array.isArray(reposData) ? reposData : []);

        const notesResponse = await fetch(`${API_URL}/release-notes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!notesResponse.ok) throw new Error('Failed to fetch release notes');
        const notesData = await notesResponse.json();
        setReleaseNotes(notesData.release_notes || []);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, token]);

  const recentNotes = [...releaseNotes]
    .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
    .slice(0, 5);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
      }`}>
        <Navbar />
        <div className="pt-24 pb-20 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <div className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Loading your dashboard...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
      }`}>
        <Navbar />
        <div className="pt-24 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className={`backdrop-blur-xl rounded-2xl p-8 border ${
              isDark 
                ? 'bg-red-900/20 border-red-500/50' 
                : 'bg-red-50/70 border-red-200 shadow-xl'
            }`}>
              <p className="text-red-500 text-center">⚠️ Error: {error}</p>
            </div>
          </div>
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
      <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 mt-8">
            <h1 className={`text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Dashboard
            </h1>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor your repositories and release notes at a glance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard 
              title="Active Repositories" 
              value={repositories.length.toString()} 
              icon={<Github className="w-10 h-10" />} 
              color="purple"
              trend="+12%"
              isDark={isDark} 
            />
            <StatCard 
              title="Release Notes" 
              value={releaseNotes.length.toString()} 
              icon={<FileText className="w-10 h-10" />} 
              color="blue"
              trend="+8%"
              isDark={isDark} 
            />
            <StatCard 
              title="This Month" 
              value={releaseNotes.filter(note => {
                const noteDate = new Date(note.CreatedAt);
                const now = new Date();
                return noteDate.getMonth() === now.getMonth() && 
                       noteDate.getFullYear() === now.getFullYear();
              }).length.toString()} 
              icon={<Calendar className="w-10 h-10" />} 
              color="pink"
              trend="Current"
              isDark={isDark} 
            />
          </div>

          {/* Recent Release Notes Section */}
          <div className={`backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 ${
            isDark 
              ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl' 
              : 'bg-white/80 border-gray-200 shadow-2xl'
          }`}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Release Notes
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Latest updates from your repositories
                </p>
              </div>
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <TrendingUp className={`w-6 h-6 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
            </div>

            {recentNotes.length === 0 ? (
              <div className="text-center py-16">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  isDark ? 'bg-slate-700/50' : 'bg-gray-100'
                }`}>
                  <FileText className={`w-10 h-10 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                </div>
                <p className={`text-lg mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  No release notes yet
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Start by connecting a repository to generate your first release note
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentNotes.map((note, index) => (
                  <ReleaseNoteCard 
                    key={note.ID}
                    version={note.Version}
                    notes={note.Notes}
                    time={formatTimeAgo(note.CreatedAt)}
                    isDark={isDark}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend, isDark }) => {
  const colorClasses = {
    purple: isDark ? 'from-purple-500/20 to-purple-600/20 border-purple-500/30' : 'from-purple-50 to-purple-100 border-purple-200',
    blue: isDark ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30' : 'from-blue-50 to-blue-100 border-blue-200',
    pink: isDark ? 'from-pink-500/20 to-pink-600/20 border-pink-500/30' : 'from-pink-50 to-pink-100 border-pink-200',
  };

  const iconColorClasses = {
    purple: isDark ? 'text-purple-400' : 'text-purple-600',
    blue: isDark ? 'text-blue-400' : 'text-blue-600',
    pink: isDark ? 'text-pink-400' : 'text-pink-600',
  };

  return (
    <div className={`backdrop-blur-xl p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${colorClasses[color]} ${
      isDark ? 'shadow-lg' : 'shadow-xl'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${
          isDark ? 'bg-slate-800/50' : 'bg-white/50'
        }`}>
          <div className={iconColorClasses[color]}>
            {icon}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          isDark ? 'bg-slate-700/50 text-gray-300' : 'bg-white/70 text-gray-600'
        }`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

const ReleaseNoteCard = ({ version, notes, time, isDark, index }) => (
  <div 
    className={`group p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
      isDark 
        ? 'bg-slate-700/30 hover:bg-slate-700/50 border-slate-600/50 hover:border-purple-500/50' 
        : 'bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-white border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md'
    }`}
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="flex items-start space-x-4">
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
        isDark ? 'bg-purple-500/20' : 'bg-purple-100'
      }`}>
        <FileText className={`w-6 h-6 ${
          isDark ? 'text-purple-400' : 'text-purple-600'
        }`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Version {version}
          </h3>
          <span className={`text-xs px-3 py-1 rounded-full ${
            isDark ? 'bg-slate-600/50 text-gray-400' : 'bg-gray-200 text-gray-600'
          }`}>
            {time}
          </span>
        </div>
        
        <p className={`text-sm leading-relaxed line-clamp-2 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {notes}
        </p>

        <div className="mt-3 flex items-center space-x-2">
          <button className={`text-xs font-medium transition-colors ${
            isDark 
              ? 'text-purple-400 hover:text-purple-300' 
              : 'text-purple-600 hover:text-purple-700'
          }`}>
            View Details →
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default HomePage;