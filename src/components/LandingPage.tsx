import React from 'react';
import { 
  Target, 
  Search, 
  FileText, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Zap,
  Award
} from 'lucide-react';

function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GrantEdge AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={onGetStarted}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Win More Grants with 
              <span className="text-blue-600"> AI-Powered</span> Intelligence
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stop losing funding opportunities to better-prepared competitors. GrantEdge AI helps health and social welfare organizations discover perfect-fit grants and create winning proposals in 80% less time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-500">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transform Your Grant Success Rate
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop spending weeks on proposals that don't win. Our AI finds the right opportunities and helps you craft compelling applications that funders actually want to read.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Save 80% of Your Time</h3>
              <p className="text-gray-600 leading-relaxed">
                Cut proposal writing from weeks to days. Our AI drafts sections, suggests improvements, and handles formatting so you focus on your mission, not paperwork.
              </p>
            </div>

            <div className="bg-green-50 p-8 rounded-xl border border-green-100">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Hidden Funding</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover grants you never knew existed. Our AI scans thousands of opportunities daily and matches them to your organization's specific needs and mission.
              </p>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl border border-purple-100">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3x Higher Win Rate</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes successful proposals and guides you to write applications that align with what funders actually fund. No more guesswork.
              </p>
            </div>

            <div className="bg-orange-50 p-8 rounded-xl border border-orange-100">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Never Miss a Deadline</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated alerts and timeline management ensure you submit on time, every time. Track multiple applications without the stress.
              </p>
            </div>

            <div className="bg-teal-50 p-8 rounded-xl border border-teal-100">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Built for Small Teams</h3>
              <p className="text-gray-600 leading-relaxed">
                No grant writing experience required. Our intuitive interface guides anyone on your team to create professional, competitive proposals.
              </p>
            </div>

            <div className="bg-indigo-50 p-8 rounded-xl border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Proposal Feedback</h3>
              <p className="text-gray-600 leading-relaxed">
                Get real-time suggestions to strengthen your narrative, improve your budget, and address reviewer concerns before you submit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From Search to Success in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven process has helped hundreds of organizations secure millions in funding. Here's how it works:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-1 bg-blue-600 mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Discover</h3>
              <p className="text-gray-600 leading-relaxed">
                Tell us about your organization and mission. Our AI instantly scans thousands of funding opportunities and presents you with perfect matches ranked by fit score.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-1 bg-green-600 mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Draft</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI guides you through each section, suggests compelling language, and helps you craft a narrative that resonates with funders. No more blank page syndrome.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-1 bg-purple-600 mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Win</h3>
              <p className="text-gray-600 leading-relaxed">
                Submit with confidence knowing your proposal addresses reviewer priorities. Track your applications and celebrate more funding wins for your important work.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Win More Grants?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of health and social welfare organizations already using GrantEdge AI to secure more funding for their important work.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-blue-100 text-sm mt-4">14-day free trial • No credit card required • Cancel anytime</p>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;