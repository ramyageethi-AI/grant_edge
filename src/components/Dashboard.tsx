import React, { useState, useEffect } from 'react';
import { 
  Target, 
  FileText, 
  TrendingUp, 
  Search, 
  Plus, 
  Calendar,
  DollarSign,
  Users,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalRFPs: number;
  myProposals: number;
  submittedProposals: number;
  successRate: number;
}

function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState<DashboardStats>({
    totalRFPs: 0,
    myProposals: 0,
    submittedProposals: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch RFPs count
      const { count: rfpsCount } = await supabase
        .from('rfps')
        .select('*', { count: 'exact', head: true });

      // Fetch user's proposals
      const { data: proposals, count: proposalsCount } = await supabase
        .from('proposals')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id);

      // Count submitted proposals
      const submittedCount = proposals?.filter(p => p.status === 'submitted').length || 0;

      setStats({
        totalRFPs: rfpsCount || 0,
        myProposals: proposalsCount || 0,
        submittedProposals: submittedCount,
        successRate: proposalsCount ? Math.round((submittedCount / proposalsCount) * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const renderHome = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.user_metadata?.full_name || 'User'}!</h1>
        <p className="text-blue-100 text-lg">Ready to discover new funding opportunities and manage your proposals?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Available RFPs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRFPs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">My Proposals</p>
              <p className="text-3xl font-bold text-gray-900">{stats.myProposals}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Submitted</p>
              <p className="text-3xl font-bold text-gray-900">{stats.submittedProposals}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setActiveTab('rfps')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center group"
          >
            <Search className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse RFPs</h3>
            <p className="text-gray-600 text-sm">Discover new funding opportunities</p>
          </button>

          <button
            onClick={() => setActiveTab('proposals')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center group"
          >
            <Plus className="w-8 h-8 text-gray-400 group-hover:text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Proposal</h3>
            <p className="text-gray-600 text-sm">Start a new grant application</p>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-center group"
          >
            <TrendingUp className="w-8 h-8 text-gray-400 group-hover:text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-gray-600 text-sm">Track your success metrics</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderRFPs = () => (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tell us about your organisation</h1>
          <p className="text-xl text-gray-600">Help us personalize your grant discovery experience</p>
        </div>

        {/* Organization Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12">
          <form className="space-y-8">
            {/* Row 1: Name and Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="orgName" className="block text-sm font-semibold text-gray-700 mb-3">
                  Name of the organisation
                </label>
                <input
                  id="orgName"
                  type="text"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your organisation name"
                />
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-3">
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://www.yourorganisation.com"
                />
              </div>
            </div>

            {/* Row 2: Sector and Organisation Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="sector" className="block text-sm font-semibold text-gray-700 mb-3">
                  Sector
                </label>
                <select
                  id="sector"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select your sector</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="social-services">Social Services</option>
                  <option value="environment">Environment</option>
                  <option value="arts-culture">Arts & Culture</option>
                  <option value="community-development">Community Development</option>
                  <option value="research">Research</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="orgSize" className="block text-sm font-semibold text-gray-700 mb-3">
                  Organisation size
                </label>
                <select
                  id="orgSize"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select organisation size</option>
                  <option value="small">Small (1-50 employees)</option>
                  <option value="medium">Medium (51-250 employees)</option>
                  <option value="large">Large (250+ employees)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Goal/Objective */}
            <div>
              <label htmlFor="objective" className="block text-sm font-semibold text-gray-700 mb-3">
                Goal/Objective
              </label>
              <textarea
                id="objective"
                rows={4}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe your organisation's main goals and objectives..."
              />
            </div>

            {/* Row 4: Area of Interest and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="areaOfInterest" className="block text-sm font-semibold text-gray-700 mb-3">
                  Area of interest
                </label>
                <input
                  id="areaOfInterest"
                  type="text"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Mental health, Youth development"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-3">
                  Country of Work
                </label>
                <input
                  id="country"
                  type="text"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your primary country of operation"
                />
              </div>
            </div>

            {/* Row 5: Annual Report and Common Donors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="annualReport" className="block text-sm font-semibold text-gray-700 mb-3">
                  Annual report
                </label>
                <input
                  id="annualReport"
                  type="url"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Link to your latest annual report"
                />
              </div>
              <div>
                <label htmlFor="commonDonors" className="block text-sm font-semibold text-gray-700 mb-3">
                  Common donors/Funders
                </label>
                <input
                  id="commonDonors"
                  type="text"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Gates Foundation, Local Government"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Save Organisation Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderProposals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Proposals</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Proposal</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Proposals Yet</h3>
        <p className="text-gray-600 mb-4">Start by creating your first grant proposal.</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Create First Proposal
        </button>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
        <p className="text-gray-600">Detailed analytics and insights will be available once you start submitting proposals.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">GrantEdge AI</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'home' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('rfps')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'rfps' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  RFPs
                </button>
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'proposals' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Proposals
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'analytics' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && renderHome()}
            {activeTab === 'rfps' && renderRFPs()}
            {activeTab === 'proposals' && renderProposals()}
            {activeTab === 'analytics' && renderAnalytics()}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;