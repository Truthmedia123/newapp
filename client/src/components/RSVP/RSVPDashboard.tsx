import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Mail, 
  CheckCircle, 
  Clock, 
  Download, 
  Search,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  Filter
} from 'lucide-react';

interface DashboardData {
  wedding: {
    id: number;
    brideName: string;
    groomName: string;
    weddingDate: string;
    venue: string;
    venueAddress: string;
  };
  statistics: {
    totalInvitations: number;
    respondedCount: number;
    pendingCount: number;
    attendingCount: number;
    totalGuests: number;
    responseRate: number;
  };
  invitations: Array<{
    id: number;
    guestName: string;
    guestEmail: string;
    invitationCode: string;
    status: string;
    sentAt: string;
    viewedAt?: string;
  }>;
  rsvpResponses: Array<{
    id: number;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    attendingCeremony: boolean;
    attendingReception: boolean;
    numberOfGuests: number;
    dietaryRestrictions?: string;
    message?: string;
    createdAt: string;
  }>;
  csvData: Array<{
    guestName: string;
    guestEmail: string;
    attendingCeremony: string;
    attendingReception: string;
    numberOfGuests: number;
    dietaryRestrictions: string;
    message: string;
    submittedAt: string;
  }>;
}

export function RSVPDashboard() {
  const { weddingId } = useParams();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (weddingId) {
      fetchDashboardData();
    }
  }, [weddingId]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/rsvp/manage/${weddingId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!dashboardData || dashboardData.csvData.length === 0) return;
    
    const headers = [
      'Guest Name',
      'Guest Email', 
      'Attending Ceremony',
      'Attending Reception',
      'Number of Guests',
      'Dietary Restrictions',
      'Message',
      'Submitted At'
    ];
    
    const csv = [
      headers.join(','),
      ...dashboardData.csvData.map(row => [
        row.guestName,
        row.guestEmail,
        row.attendingCeremony,
        row.attendingReception,
        row.numberOfGuests,
        `"${row.dietaryRestrictions}"`,
        `"${row.message}"`,
        row.submittedAt
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp-responses-${dashboardData.wedding.brideName}-${dashboardData.wedding.groomName}.csv`;
    a.click();
  };

  const filteredResponses = dashboardData?.rsvpResponses.filter(response => {
    const matchesSearch = response.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'attending') {
      return matchesSearch && (response.attendingCeremony || response.attendingReception);
    } else if (statusFilter === 'not-attending') {
      return matchesSearch && !response.attendingCeremony && !response.attendingReception;
    }
    
    return matchesSearch;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'No data available'}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { wedding, statistics, invitations, rsvpResponses } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">RSVP Dashboard</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(wedding.weddingDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{wedding.venue}</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invitations</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalInvitations}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Responses</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.respondedCount}</p>
                  <p className="text-xs text-gray-500">{statistics.responseRate}% response rate</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attending</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.attendingCount}</p>
                  <p className="text-xs text-gray-500">confirmed guests</p>
                </div>
                <Users className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Guests</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalGuests}</p>
                  <p className="text-xs text-gray-500">including plus ones</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search">Search Guests</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="filter">Filter by Status</Label>
            <select
              id="filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Responses</option>
              <option value="attending">Attending</option>
              <option value="not-attending">Not Attending</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button onClick={exportCSV} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* RSVP Responses */}
        <Card>
          <CardHeader>
            <CardTitle>RSVP Responses ({filteredResponses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredResponses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No RSVP responses found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResponses.map((response) => (
                  <div key={response.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{response.guestName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{response.guestEmail}</span>
                          </div>
                          {response.guestPhone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{response.guestPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge 
                          className={response.attendingCeremony || response.attendingReception 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }
                        >
                          {response.attendingCeremony || response.attendingReception ? 'Attending' : 'Not Attending'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Events:</span>
                        <div className="mt-1">
                          {response.attendingCeremony && (
                            <Badge variant="outline" className="mr-1">Ceremony</Badge>
                          )}
                          {response.attendingReception && (
                            <Badge variant="outline" className="mr-1">Reception</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Guests:</span>
                        <span className="ml-1">{response.numberOfGuests}</span>
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <span className="ml-1">{new Date(response.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {(response.dietaryRestrictions || response.message) && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        {response.dietaryRestrictions && (
                          <div className="mb-2">
                            <span className="font-medium text-sm">Dietary Restrictions:</span>
                            <p className="text-sm text-gray-600">{response.dietaryRestrictions}</p>
                          </div>
                        )}
                        {response.message && (
                          <div>
                            <span className="font-medium text-sm flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              Message:
                            </span>
                            <p className="text-sm text-gray-600 italic">"{response.message}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
