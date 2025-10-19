import Navbar from '../components/Navbar';
import { Zap, Target, Rocket, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-6 text-center">About PatchForge</h1>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Revolutionizing the way development teams create and share release notes
          </p>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-10 border border-slate-700 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              PatchForge was created to solve a common problem in software development: creating comprehensive, 
              well-written release notes is time-consuming and often neglected. We believe that every merged pull 
              request deserves proper documentation that's automatically shared with contributors.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              By leveraging AI and automation, we help teams maintain better documentation practices without 
              adding extra work to their workflow. Our system analyzes code changes, understands the context, 
              and generates professional release notes that keep everyone informed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <ValueCard
              icon={<Target className="w-12 h-12 text-purple-400" />}
              title="Our Vision"
              description="To make release documentation effortless and accessible for every development team, regardless of size or budget."
            />
            <ValueCard
              icon={<Rocket className="w-12 h-12 text-purple-400" />}
              title="Innovation First"
              description="We continuously improve our AI models and integrate the latest technologies to provide the best experience."
            />
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-10 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
            <div className="space-y-6">
              <ProcessStep
                number="1"
                title="GitHub Integration"
                description="Connect your repositories and we'll automatically listen for merged pull requests through webhooks."
              />
              <ProcessStep
                number="2"
                title="AI Analysis"
                description="Our Groq-powered AI analyzes the code changes and understands the context and impact of each PR."
              />
              <ProcessStep
                number="3"
                title="Note Generation"
                description="Professional release notes are generated automatically, highlighting key changes and improvements."
              />
              <ProcessStep
                number="4"
                title="Email Delivery"
                description="Contributors receive beautifully formatted release notes directly in their inbox."
              />
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 text-center">
            <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Join Thousands of Teams</h3>
            <p className="text-gray-300 mb-6">
              Already trusted by development teams worldwide to automate their release documentation
            </p>
            <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValueCard = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const ProcessStep = ({ number, title, description }) => (
  <div className="flex items-start space-x-6">
    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
      {number}
    </div>
    <div className="flex-1">
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

export default AboutPage;