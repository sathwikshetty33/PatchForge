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

import Navbar from '../components/Navbar';
import { Github, Code, Mail, FileText, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isDark } = useAuth();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
    }`}>
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`backdrop-blur-xl rounded-2xl p-8 border mb-8 animate-fade-in transition-colors duration-500 ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-white/70 border-gray-200 shadow-xl'
          }`}>
            <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Dashboard
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Welcome to PatchForge! Monitor your repositories and release notes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Active Repos" value="5" icon={<Github className="w-8 h-8 text-purple-500" />} isDark={isDark} />
            <StatCard title="PRs Analyzed" value="127" icon={<Code className="w-8 h-8 text-purple-500" />} isDark={isDark} />
            <StatCard title="Notes Sent" value="89" icon={<Mail className="w-8 h-8 text-purple-500" />} isDark={isDark} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-colors duration-500 ${
              isDark 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-white/70 border-gray-200 shadow-xl'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recent Activity
              </h3>
              <div className="space-y-4">
                <ActivityItem 
                  repo="user/awesome-project" 
                  action="PR merged - Release notes sent" 
                  time="2 hours ago" 
                  isDark={isDark}
                />
                <ActivityItem 
                  repo="org/backend-api" 
                  action="New webhook configured" 
                  time="5 hours ago" 
                  isDark={isDark}
                />
                <ActivityItem 
                  repo="user/frontend-app" 
                  action="PR analyzed" 
                  time="1 day ago" 
                  isDark={isDark}
                />
              </div>
            </div>

            <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-colors duration-500 ${
              isDark 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-white/70 border-gray-200 shadow-xl'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <ActionButton 
                  text="Connect New Repository" 
                  icon={<Github className="w-5 h-5" />} 
                  isDark={isDark}
                />
                <ActionButton 
                  text="View All Release Notes" 
                  icon={<FileText className="w-5 h-5" />} 
                  isDark={isDark}
                />
                <ActionButton 
                  text="Configure Settings" 
                  icon={<Settings className="w-5 h-5" />} 
                  isDark={isDark}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, isDark }) => (
  <div className={`backdrop-blur-xl p-6 rounded-2xl border transition-all duration-300 ${
    isDark 
      ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500' 
      : 'bg-white/70 border-gray-200 hover:border-purple-400 shadow-lg hover:shadow-xl'
  }`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {title}
      </h3>
      {icon}
    </div>
    <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {value}
    </p>
  </div>
);

const ActivityItem = ({ repo, action, time, isDark }) => (
  <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
    isDark 
      ? 'bg-slate-700/30 hover:bg-slate-700/50' 
      : 'bg-gray-100/50 hover:bg-gray-200/70'
  }`}>
    <Code className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
    <div>
      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {repo}
      </p>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {action}
      </p>
      <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        {time}
      </p>
    </div>
  </div>
);

const ActionButton = ({ text, icon, isDark }) => (
  <button className={`w-full flex items-center space-x-3 p-4 border rounded-lg transition-all duration-300 ${
    isDark 
      ? 'bg-slate-700/30 hover:bg-purple-600/20 border-slate-600 hover:border-purple-500 text-white' 
      : 'bg-gray-50 hover:bg-purple-50 border-gray-200 hover:border-purple-400 text-gray-900'
  }`}>
    {icon}
    <span>{text}</span>
  </button>
);

export default HomePage;