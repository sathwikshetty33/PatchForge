import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Github, GitBranch, CheckCircle, Clock, X, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RepositoriesPage = () => {
  const { API_URL, getToken, getGithubUsername, getGithubAccessToken, getGithubUrl } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/repositories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.status}`);
      }
      
      const data = await response.json();
      setRepositories(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching repositories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGithubRepos = async () => {
    try {
      setLoadingGithub(true);
      setError(null);
      
      const username = getGithubUrl();
      const githubToken = getGithubAccessToken();
      
      if (!username || !githubToken) {
        if(!username) {
          throw new Error('GitHub username not found');
        }
        
        if(!githubToken) {
          throw new Error('GitHub access token not found');
        }
        throw new Error('GitHub account not connected');
      }
      
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch GitHub repositories');
      
      const allRepos = await response.json();
      
      // Filter out repos that are already added
      const addedRepoUrls = repositories.map(r => r.RepositoryUrl);
      const availableRepos = allRepos.filter(
        repo => !addedRepoUrls.includes(repo.html_url)
      );
      
      setGithubRepos(availableRepos);
      setShowAddModal(true);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching GitHub repos:', err);
    } finally {
      setLoadingGithub(false);
    }
  };

  const addRepository = async (repo) => {
    try {
      const response = await fetch(`${API_URL}/repositories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: repo.name,
          repository_url: repo.html_url,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add repository: ${response.status}`);
      }
      
      // Refresh the repositories list
      await fetchRepositories();
      
      // Remove from available repos
      setGithubRepos(prev => prev.filter(r => r.id !== repo.id));
    } catch (err) {
      setError(err.message);
      console.error('Error adding repository:', err);
    }
  };

  const deleteRepository = async (repoId) => {
    if (!window.confirm('Are you sure you want to remove this repository?')) return;
    
    try {
      const response = await fetch(`${API_URL}/repositories`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo_id: repoId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete repository: ${response.status}`);
      }
      
      // Remove from local state
      setRepositories(prev => prev.filter(r => r.ID !== repoId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting repository:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="pt-24 pb-20 px-4 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Repositories</h1>
            <button 
              onClick={fetchGithubRepos}
              disabled={loadingGithub}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingGithub ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              <span>{loadingGithub ? 'Loading...' : 'Add Repository'}</span>
            </button>
          </div>

          <div className="grid gap-6">
            {repositories.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Github className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">No repositories added yet</p>
                <p className="mt-2">Click "Add Repository" to get started</p>
              </div>
            ) : (
              repositories.map(repo => (
                <RepoCard 
                  key={repo.ID} 
                  repo={repo}
                  onDelete={deleteRepository}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddRepoModal
          repos={githubRepos}
          onClose={() => setShowAddModal(false)}
          onAdd={addRepository}
        />
      )}
    </div>
  );
};

const RepoCard = ({ repo, onDelete }) => {
  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (let [name, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) {
        return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-purple-600/20 rounded-lg">
            <Github className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{repo.Name}</h3>
            <div className="flex items-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Added: {timeSince(repo.CreatedAt)}</span>
              </div>
              <a 
                href={repo.RepositoryUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
        <span className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-500/20 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>Active</span>
        </span>
      </div>
      
      <div className="mt-6 flex space-x-3">
        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
          View Details
        </button>
        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
          Configure Webhook
        </button>
        <button 
          onClick={() => onDelete(repo.ID)}
          className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors border border-red-600/20"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const AddRepoModal = ({ repos, onClose, onAdd }) => {
  const [adding, setAdding] = useState({});

  const handleAdd = async (repo) => {
    setAdding(prev => ({ ...prev, [repo.id]: true }));
    await onAdd(repo);
    setAdding(prev => ({ ...prev, [repo.id]: false }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Add Repository</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {repos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>All your repositories have been added!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {repos.map(repo => (
                <div 
                  key={repo.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Github className="w-6 h-6 text-purple-400" />
                    <div>
                      <h3 className="text-white font-semibold">{repo.name}</h3>
                      <p className="text-sm text-gray-400">{repo.description || 'No description'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAdd(repo)}
                    disabled={adding[repo.id]}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {adding[repo.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{adding[repo.id] ? 'Adding...' : 'Add'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoriesPage;