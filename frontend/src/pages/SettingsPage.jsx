import Navbar from '../components/Navbar';
import { Bell, Lock, Webhook, Mail, Key } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

          <div className="space-y-6">
            <SettingsSection
              icon={<Bell className="w-6 h-6 text-purple-400" />}
              title="Notifications"
              description="Manage your notification preferences"
            >
              <SettingToggle
                label="Email Notifications"
                description="Receive email updates about your repositories"
              />
              <SettingToggle
                label="PR Analysis Alerts"
                description="Get notified when PRs are analyzed"
              />
            </SettingsSection>

            <SettingsSection
              icon={<Webhook className="w-6 h-6 text-purple-400" />}
              title="Webhook Configuration"
              description="Configure GitHub webhook security"
            >
              <SettingInput
                label="Webhook Secret"
                placeholder="Enter your webhook secret"
                type="password"
              />
            </SettingsSection>

            <SettingsSection
              icon={<Key className="w-6 h-6 text-purple-400" />}
              title="API Keys"
              description="Manage your integration keys"
            >
              <SettingInput
                label="Groq API Key"
                placeholder="Enter your Groq API key"
                type="password"
              />
              <SettingInput
                label="GitHub Access Token"
                placeholder="Enter your GitHub token"
                type="password"
              />
            </SettingsSection>

            <SettingsSection
              icon={<Mail className="w-6 h-6 text-purple-400" />}
              title="SMTP Configuration"
              description="Configure email delivery settings"
            >
              <SettingInput
                label="SMTP Host"
                placeholder="smtp.gmail.com"
              />
              <SettingInput
                label="SMTP Port"
                placeholder="587"
              />
              <SettingInput
                label="Email Username"
                placeholder="your-email@gmail.com"
              />
              <SettingInput
                label="Email Password"
                placeholder="••••••••"
                type="password"
              />
            </SettingsSection>

            <SettingsSection
              icon={<Lock className="w-6 h-6 text-purple-400" />}
              title="Security"
              description="Account security settings"
            >
              <button className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left">
                Change Password
              </button>
              <button className="w-full px-6 py-3 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors border border-red-600/20 text-left">
                Delete Account
              </button>
            </SettingsSection>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              Cancel
            </button>
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsSection = ({ icon, title, description, children }) => (
  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
    <div className="flex items-start space-x-4 mb-6">
      <div className="p-3 bg-purple-600/20 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SettingToggle = ({ label, description }) => (
  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
    <div>
      <p className="text-white font-medium">{label}</p>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
    <button className="relative w-12 h-6 bg-slate-600 rounded-full transition-colors hover:bg-slate-500">
      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
    </button>
  </div>
);

const SettingInput = ({ label, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
    />
  </div>
);

export default SettingsPage;