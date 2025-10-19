import Navbar from '../components/Navbar';
import { Github, GitBranch, CheckCircle, Clock } from 'lucide-react';

const RepositoriesPage = () => {
  const repositories = [
    { id: 1, name: 'awesome-project', owner: 'user', status: 'Active', prs: 45, lastSync: '2 hours ago' },
    { id: 2, name: 'backend-api', owner: 'org', status: 'Active', prs: 32, lastSync: '5 hours ago' },
    { id: 3, name: 'frontend-app', owner: 'user', status: 'Paused', prs: 18, lastSync: '1 day ago' },
    { id: 4, name: 'mobile-app', owner: 'org', status: 'Active', prs: 56, lastSync: '30 minutes ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Repositories</h1>
            <button className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105">
              <Github className="w-5 h-5" />
              <span>Add Repository</span>
            </button>
          </div>

          <div className="grid gap-6">
            {repositories.map(repo => (
              <RepoCard key={repo.id} {...repo} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RepoCard = ({ name, owner, status, prs, lastSync }) => (
  <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-[1.02]">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-purple-600/20 rounded-lg">
          <Github className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{owner}/{name}</h3>
          <div className="flex items-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4" />
              <span>{prs} PRs analyzed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last sync: {lastSync}</span>
            </div>
          </div>
        </div>
      </div>
      <span className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
        status === 'Active' 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-yellow-500/20 text-yellow-400'
      }`}>
        <CheckCircle className="w-4 h-4" />
        <span>{status}</span>
      </span>
    </div>
    
    <div className="mt-6 flex space-x-3">
      <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
        View Details
      </button>
      <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
        Configure Webhook
      </button>
      <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors border border-red-600/20">
        Remove
      </button>
    </div>
  </div>
);

export default RepositoriesPage;