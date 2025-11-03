import React, { useState } from 'react';
import { Target, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onBack?: () => void;
}

interface SignupStep1Data {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

interface SignupStep2Data {
  organizationName: string;
  sector: string;
  organizationSize: string;
}

function AuthForm({ mode, onToggleMode, onBack }: AuthFormProps) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupMessage, setSignupMessage] = useState('');
  const [step1Data, setStep1Data] = useState<SignupStep1Data>({
    email: '',
    password: '',
    fullName: '',
    role: ''
  });
  const [step2Data, setStep2Data] = useState<SignupStep2Data>({
    organizationName: '',
    sector: '',
    organizationSize: ''
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    organizationName: '',
    role: ''
  });

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSignupSuccess(false);
    setSignupMessage('');

    try {
      // Create auth user with Supabase - this connects to auth.users table
      const { data: authData, error: authError } = await signUp(
        step1Data.email, 
        step1Data.password, 
        {
          full_name: step1Data.fullName,
        }
      );

      if (authError) throw authError;

      if (authData.user) {
        // Check if user is immediately confirmed (session exists)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          // User is confirmed and logged in - create organization record
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Step 1: Create user record in custom users table
          const { error: userError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              full_name: step1Data.fullName,
              role: step1Data.role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (userError) {
            console.error('User creation error:', userError);
            throw new Error('Failed to create user profile. Please contact support.');
          }
          
          // Step 2: Create organization record linked to users table via user_id
          const { error: orgError } = await supabase
            .from('organizations')
            .insert({
              user_id: authData.user.id,
              name: step1Data.fullName,
              sector: 'nonprofit',
              organization_size: 'small'
            });

          if (orgError) {
            console.error('Organization creation error:', orgError);
            throw new Error('Failed to create organization profile. Please contact support.');
          }
          
          // Success - user authenticated and organization created
        } else {
          // No session means email confirmation required before login
          setSignupSuccess(true);
          setSignupMessage('Account created! Please check your email to confirm, then log in.');
        }
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.message?.includes('over_email_send_rate_limit')) {
        setError('Too many requests. Please wait 40 seconds before trying again for security purposes.');
      } else if (err.message?.includes('rate_limit')) {
        setError('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (err.message?.includes('signup_disabled')) {
        setError('Account creation is currently disabled. Please contact support.');
      } else if (err.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await signUp(
        step1Data.email, 
        step1Data.password, 
        {
          full_name: step1Data.fullName,
          role: step1Data.role,
        }
      );

      if (authError) throw authError;

      if (authData.user) {
        // Wait a moment for the session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 2: Create organization record with authenticated session
        const { error: orgError } = await supabase
          .from('organizations')
          .insert({
            user_id: authData.user.id,
            name: step2Data.organizationName,
            sector: step2Data.sector,
            organization_size: step2Data.organizationSize
          });

        if (orgError) {
          console.error('Organization creation error:', orgError);
          throw new Error('Failed to create organization profile. Please contact support.');
        }
      }
    } catch (err: any) {
      if (err.message?.includes('over_email_send_rate_limit')) {
        setError('Too many requests. Please wait 40 seconds before trying again for security purposes.');
      } else if (err.message?.includes('rate_limit')) {
        setError('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (err.message?.includes('signup_disabled')) {
        setError('Account creation is currently disabled. Please contact support.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sign in with Supabase auth - this checks auth.users table
      const { data, error } = await signIn(formData.email, formData.password);
      if (error) throw error;
      
      // Login successful - useAuth hook will handle session state
    } catch (err: any) {
      // Handle specific Supabase errors
      if (err.message?.includes('over_email_send_rate_limit')) {
        setError('Too many requests. Please wait 40 seconds before trying again for security purposes.');
      } else if (err.message?.includes('rate_limit')) {
        setError('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (err.message?.includes('invalid_credentials') || err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in.');
      } else if (err.message?.includes('User not found')) {
        setError('No account found with this email address. Please sign up first.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStep1InputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStep1Data({
      ...step1Data,
      [e.target.name]: e.target.value
    });
  };

  const handleStep2InputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStep2Data({
      ...step2Data,
      [e.target.name]: e.target.value
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(resetEmail);
      if (error) throw error;
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        )}

        {/* Logo and Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">GrantEdge AI</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {mode === 'login' 
              ? 'Welcome Back' 
              : 'Create Account'
            }
          </h1>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Sign in to access your grant management dashboard' 
              : 'Enter your details to get started'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white py-12 px-8 shadow-lg rounded-xl border border-gray-200">
          {showForgotPassword ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your email to receive a password reset link</p>
              </div>

              {resetSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                  <p className="font-medium">Password reset email sent!</p>
                  <p className="text-sm mt-1">Check your inbox for further instructions.</p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSuccess(false);
                      setResetEmail('');
                    }}
                    className="text-green-600 hover:text-green-700 font-medium mt-2"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="resetEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="resetEmail"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError(null);
                        setResetEmail('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {resetLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
          <>
          {mode === 'login' ? (
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  Forgot your password?
                </button>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
          ) : signupStep === 1 ? (
            signupSuccess ? (
              <div className="space-y-6 text-center">
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Success!</h3>
                  <p>{signupMessage}</p>
                </div>
                <button
                  onClick={() => {
                    setSignupSuccess(false);
                    setSignupMessage('');
                    onToggleMode(); // Switch to login mode
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Sign In
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleStep1Submit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={step1Data.fullName}
                    onChange={handleStep1InputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={step1Data.email}
                    onChange={handleStep1InputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={step1Data.password}
                      onChange={handleStep1InputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Create a secure password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>


                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      'Signup'
                    )}
                  </button>
                </div>
              </form>
            )
          ) : null}
          </>
          )}

          {!showForgotPassword && (
            <div className="mt-8 text-center">
              <div className="text-gray-600 text-sm">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    onToggleMode();
                    setSignupStep(1);
                    setError(null);
                    setFormData({ email: '', password: '', fullName: '', organizationName: '', role: '' });
                    setStep1Data({ email: '', password: '', fullName: '', role: '' });
                    setSignupSuccess(false);
                    setSignupMessage('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {mode === 'login' ? 'Sign up for free' : 'Sign in here'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthForm;