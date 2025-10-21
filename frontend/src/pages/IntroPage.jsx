// import { Link } from 'react-router-dom';
// import { Zap, Github, Mail, ArrowRight } from 'lucide-react';

// const IntroPage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <nav className="fixed w-full z-50 bg-transparent">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <Zap className="w-8 h-8 text-purple-400" />
//               <span className="text-2xl font-bold text-white">PatchForge</span>
//             </div>
//             <Link
//               to="/auth"
//               className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>
//       </nav>

//       <div className="pt-32 pb-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16 animate-fade-in">
//             <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
//               Automate Your <span className="text-purple-400">Release Notes</span>
//             </h1>
//             <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
//               AI-powered release notes generation from your merged pull requests. 
//               Integrate with GitHub, analyze PRs, and deliver beautiful notes automatically.
//             </p>
//             <Link
//               to="/auth"
//               className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
//             >
//               <span>Start Free</span>
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 mt-20">
//             <FeatureCard
//               icon={<Github className="w-12 h-12 text-purple-400" />}
//               title="GitHub Integration"
//               description="Seamlessly connects with GitHub webhooks to capture PR events automatically"
//             />
//             <FeatureCard
//               icon={<Zap className="w-12 h-12 text-purple-400" />}
//               title="AI-Powered"
//               description="Uses Groq API to generate intelligent, context-aware release notes"
//             />
//             <FeatureCard
//               icon={<Mail className="w-12 h-12 text-purple-400" />}
//               title="Email Delivery"
//               description="Automatically sends formatted release notes to contributors via SMTP"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FeatureCard = ({ icon, title, description }) => (
//   <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
//     <div className="mb-4">{icon}</div>
//     <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
//     <p className="text-gray-300">{description}</p>
//   </div>
// );

// export default IntroPage;

import { Link } from 'react-router-dom';
import { Zap, Github, Mail, ArrowRight, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const IntroPage = () => {
  const { isDark, toggleTheme } = useAuth();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
    }`}>
      <nav className="fixed w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                PatchForge
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-800/50 hover:bg-slate-700 text-purple-400' 
                    : 'bg-white/70 hover:bg-gray-100 text-purple-600'
                } backdrop-blur-xl border ${
                  isDark ? 'border-slate-700' : 'border-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link
                to="/auth"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className={`text-6xl font-bold mb-6 leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Automate Your <span className="text-purple-500">Release Notes</span>
            </h1>
            <p className={`text-xl mb-8 max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
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
              icon={<Github className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
              title="GitHub Integration"
              description="Seamlessly connects with GitHub webhooks to capture PR events automatically"
              isDark={isDark}
            />
            <FeatureCard
              icon={<Zap className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
              title="AI-Powered"
              description="Uses Groq API to generate intelligent, context-aware release notes"
              isDark={isDark}
            />
            <FeatureCard
              icon={<Mail className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
              title="Email Delivery"
              description="Automatically sends formatted release notes to contributors via SMTP"
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, isDark }) => (
  <div className={`backdrop-blur-xl p-8 rounded-2xl border transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
    isDark 
      ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500 hover:shadow-purple-500/20' 
      : 'bg-white/70 border-gray-200 hover:border-purple-400 hover:shadow-purple-500/30'
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

export default IntroPage;