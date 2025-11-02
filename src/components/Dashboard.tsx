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
  AlertCircle,
  Loader2
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
  const [orgFormData, setOrgFormData] = useState({
    name: '',
    website: '',
    sector: '',
    organization_size: '',
    mission: '',
    area_of_interest: '',
    country: '',
    annual_report: '',
    common_donors: ''
  });
  const [orgFormLoading, setOrgFormLoading] = useState(false);
  const [orgFormError, setOrgFormError] = useState<string | null>(null);
  const [orgFormSuccess, setOrgFormSuccess] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardStats();
      fetchOrganizationData();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Fetch RFPs count
      const { count: rfpsCount } = await supabase
        .from('rfps')
        .select('*', { count: 'exact', head: true });

      // Fetch user's proposals
      const { data: organizations } = await supabase
        .from('organizations')
        .select('id')
        .eq('user_id', user.id);

      if (!organizations || organizations.length === 0) {
        setStats({
          totalRFPs: rfpsCount || 0,
          myProposals: 0,
          submittedProposals: 0,
          successRate: 0
        });
        return;
      }

      const organizationId = organizations[0].id;
      const { data: proposals, count: proposalsCount } = await supabase
        .from('proposals')
        .select('*', { count: 'exact' })
        .eq('organization_id', organizationId);

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

  const fetchOrganizationData = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setOrgFormData({
          name: data.name || '',
          website: data.contact_email || '', // Using contact_email as website field
          sector: data.sector || '',
          organization_size: data.organization_size || '',
          mission: data.mission || '',
          area_of_interest: '', // This field doesn't exist in current schema
          country: data.address || '', // Using address as country field
          annual_report: '', // This field doesn't exist in current schema
          common_donors: '' // This field doesn't exist in current schema
        });
      }
    } catch (error) {
      console.error('Error fetching organization data:', error);
    }
  };

  const handleOrgFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setOrgFormData({
      ...orgFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleOrgFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgFormLoading(true);
    setOrgFormError(null);
    setOrgFormSuccess(false);

    try {
      // Check if organization already exists
      const { data: existingOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      const orgData = {
        user_id: user?.id,
        name: orgFormData.name,
        sector: orgFormData.sector,
        organization_size: orgFormData.organization_size,
        mission: orgFormData.mission,
        contact_email: orgFormData.website, // Storing website in contact_email field
        address: orgFormData.country, // Storing country in address field
        annual_budget: null // You might want to add this field later
      };

      if (existingOrg) {
        // Update existing organization
        const { error } = await supabase
          .from('organizations')
          .update(orgData)
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        // Create new organization
        const { error } = await supabase
          .from('organizations')
          .insert(orgData);

        if (error) throw error;
      }

      setOrgFormSuccess(true);
      setTimeout(() => setOrgFormSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error saving organization:', error);
      setOrgFormError(error.message || 'Failed to save organization details');
    } finally {
      setOrgFormLoading(false);
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
          {orgFormSuccess && (
            <div className="mb-8 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg text-center">
              <p className="font-semibold">Success!</p>
              <p>Your organization details have been saved successfully.</p>
            </div>
          )}

          {orgFormError && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              <p className="font-semibold">Error:</p>
              <p>{orgFormError}</p>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleOrgFormSubmit}>
            {/* Row 1: Name and Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="orgName" className="block text-sm font-semibold text-gray-700 mb-3">
                  Name of the organisation
                </label>
                <input
                  id="orgName"
                  name="name"
                  type="text"
                  required
                  value={orgFormData.name}
                  onChange={handleOrgFormChange}
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
                  name="website"
                  type="url"
                  value={orgFormData.website}
                  onChange={handleOrgFormChange}
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
                  name="sector"
                  required
                  value={orgFormData.sector}
                  onChange={handleOrgFormChange}
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
                  <option value="nonprofit">Nonprofit</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="orgSize" className="block text-sm font-semibold text-gray-700 mb-3">
                  Organisation size
                </label>
                <select
                  id="orgSize"
                  name="organization_size"
                  required
                  value={orgFormData.organization_size}
                  onChange={handleOrgFormChange}
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
                name="mission"
                rows={4}
                value={orgFormData.mission}
                onChange={handleOrgFormChange}
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
                  name="area_of_interest"
                  type="text"
                  value={orgFormData.area_of_interest}
                  onChange={handleOrgFormChange}
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
                  name="country"
                  type="text"
                  value={orgFormData.country}
                  onChange={handleOrgFormChange}
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
                  name="annual_report"
                  type="url"
                  value={orgFormData.annual_report}
                  onChange={handleOrgFormChange}
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
                  name="common_donors"
                  type="text"
                  value={orgFormData.common_donors}
                  onChange={handleOrgFormChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Gates Foundation, Local Government"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 text-center">
              <button
                type="submit"
                disabled={orgFormLoading}
                className="bg-blue-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {orgFormLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2 inline" />
                    Saving...
                  </>
                ) : (
                  'Save Organisation Details'
                )}
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