import { Link } from 'react-router-dom';
import { Zap, Github, Mail, ArrowRight } from 'lucide-react';

const IntroPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="fixed w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">PatchForge</span>
            </div>
            <Link
              to="/auth"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Automate Your <span className="text-purple-400">Release Notes</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered release notes generation from your merged pull requests. 
              Integrate with GitHub, analyze PRs, and deliver beautiful notes automatically.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
            >
              <span>Start Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <FeatureCard
              icon={<Github className="w-12 h-12 text-purple-400" />}
              title="GitHub Integration"
              description="Seamlessly connects with GitHub webhooks to capture PR events automatically"
            />
            <FeatureCard
              icon={<Zap className="w-12 h-12 text-purple-400" />}
              title="AI-Powered"
              description="Uses Groq API to generate intelligent, context-aware release notes"
            />
            <FeatureCard
              icon={<Mail className="w-12 h-12 text-purple-400" />}
              title="Email Delivery"
              description="Automatically sends formatted release notes to contributors via SMTP"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default IntroPage;