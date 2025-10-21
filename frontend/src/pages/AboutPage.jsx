import Navbar from '../components/Navbar';
import { Zap, Target, Rocket, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AboutPage = () => {
  const { isDark } = useAuth();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
    }`}>
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className={`text-5xl font-bold mb-6 text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            About PatchForge
          </h1>
          <p className={`text-xl text-center mb-16 max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Revolutionizing the way development teams create and share release notes
          </p>

          <div className={`backdrop-blur-xl rounded-2xl p-10 border mb-8 transition-colors duration-500 ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-white/70 border-gray-200 shadow-xl'
          }`}>
            <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Our Mission
            </h2>
            <p className={`text-lg leading-relaxed mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              PatchForge was created to solve a common problem in software development: creating comprehensive, 
              well-written release notes is time-consuming and often neglected. We believe that every merged pull 
              request deserves proper documentation that's automatically shared with contributors.
            </p>
            <p className={`text-lg leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              By leveraging AI and automation, we help teams maintain better documentation practices without 
              adding extra work to their workflow. Our system analyzes code changes, understands the context, 
              and generates professional release notes that keep everyone informed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <ValueCard
              icon={<Target className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
              title="Our Vision"
              description="To make release documentation effortless and accessible for every development team, regardless of size or budget."
              isDark={isDark}
            />
            <ValueCard
              icon={<Rocket className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
              title="Innovation First"
              description="We continuously improve our AI models and integrate the latest technologies to provide the best experience."
              isDark={isDark}
            />
          </div>

          <div className={`backdrop-blur-xl rounded-2xl p-10 border transition-colors duration-500 ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-white/70 border-gray-200 shadow-xl'
          }`}>
            <h2 className={`text-3xl font-bold mb-8 text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              How It Works
            </h2>
            <div className="space-y-6">
              <ProcessStep
                number="1"
                title="GitHub Integration"
                description="Connect your repositories and we'll automatically listen for merged pull requests through webhooks."
                isDark={isDark}
              />
              <ProcessStep
                number="2"
                title="AI Analysis"
                description="Our Groq-powered AI analyzes the code changes and understands the context and impact of each PR."
                isDark={isDark}
              />
              <ProcessStep
                number="3"
                title="Note Generation"
                description="Professional release notes are generated automatically, highlighting key changes and improvements."
                isDark={isDark}
              />
              <ProcessStep
                number="4"
                title="Email Delivery"
                description="Contributors receive beautifully formatted release notes directly in their inbox."
                isDark={isDark}
              />
            </div>
          </div>

          <div className={`mt-8 rounded-2xl p-8 text-center border transition-colors duration-500 ${
            isDark 
              ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30' 
              : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300'
          }`}>
            <Users className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`} />
            <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Join Thousands of Teams
            </h3>
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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

const ValueCard = ({ icon, title, description, isDark }) => (
  <div className={`backdrop-blur-xl p-8 rounded-2xl border transition-all duration-300 ${
    isDark 
      ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500' 
      : 'bg-white/70 border-gray-200 hover:border-purple-400 shadow-lg hover:shadow-xl'
  }`}>
    <div className="mb-4">{icon}</div>
    <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {title}
    </h3>
    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
      {description}
    </p>
  </div>
);

const ProcessStep = ({ number, title, description, isDark }) => (
  <div className="flex items-start space-x-6">
    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
      {number}
    </div>
    <div className="flex-1">
      <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h4>
      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
        {description}
      </p>
    </div>
  </div>
);

export default AboutPage;