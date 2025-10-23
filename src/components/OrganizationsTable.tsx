import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, Users, MapPin, Calendar, Loader2 } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  type?: string;
  location?: string;
  contact_email?: string;
  phone?: string;
  website?: string;
  description?: string;
  founded_year?: number;
  employee_count?: number;
  created_at: string;
  updated_at?: string;
}

function OrganizationsTable() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrganizations(data || []);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching organizations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-red-200 max-w-md w-full">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Organizations</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOrganizations}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
              <p className="text-gray-600 mt-2">
                {organizations.length} organization{organizations.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button
              onClick={fetchOrganizations}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {organizations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Organizations Found</h3>
            <p className="text-gray-600 mb-6">
              There are no organizations in the database yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <div key={org.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {org.name}
                      </h3>
                      {org.type && (
                        <span className="text-sm text-gray-500">{org.type}</span>
                      )}
                    </div>
                  </div>
                </div>

                {org.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {org.description}
                  </p>
                )}

                <div className="space-y-2">
                  {org.location && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{org.location}</span>
                    </div>
                  )}

                  {org.employee_count && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{org.employee_count} employees</span>
                    </div>
                  )}

                  {org.founded_year && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Founded {org.founded_year}</span>
                    </div>
                  )}
                </div>

                {(org.contact_email || org.website || org.phone) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-1">
                      {org.contact_email && (
                        <div className="text-sm">
                          <span className="text-gray-500">Email: </span>
                          <a href={`mailto:${org.contact_email}`} className="text-blue-600 hover:text-blue-700">
                            {org.contact_email}
                          </a>
                        </div>
                      )}
                      {org.phone && (
                        <div className="text-sm">
                          <span className="text-gray-500">Phone: </span>
                          <a href={`tel:${org.phone}`} className="text-blue-600 hover:text-blue-700">
                            {org.phone}
                          </a>
                        </div>
                      )}
                      {org.website && (
                        <div className="text-sm">
                          <span className="text-gray-500">Website: </span>
                          <a 
                            href={org.website.startsWith('http') ? org.website : `https://${org.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {org.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Created: {new Date(org.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizationsTable;