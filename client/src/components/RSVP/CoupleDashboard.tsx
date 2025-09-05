import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Heart,
  Share2,
  BarChart3,
  UserCheck,
  UserX
} from 'lucide-react';

interface WeddingData {
  brideName: string;
  groomName: string;
  weddingDate: string;
  ceremonyTime: string;
  receptionTime: string;
  venue: string;
  venueAddress: string;
  contactPhone: string;
  contactEmail: string;
  message: string;
}

interface RSVPResponse {
  weddingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  attendingCeremony: boolean;
  attendingReception: boolean;
  numberOfGuests: number;
  dietaryRestrictions: string;
  message: string;
  bringingChildren: boolean;
  transportationNeeded: boolean;
  accommodationNeeded: boolean;
  traditionalAttire: boolean;
  submittedAt: string;
}

export function CoupleDashboard() {
  const { weddingId } = useParams();
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [responses, setResponses] = useState<RSVPResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (weddingId) {
      loadDashboardData();
    }
  }, [weddingId]);

  const loadDashboardData = () => {
    try {
      // Load wedding data
      const stored = localStorage.getItem(`wedding_${weddingId}`);
      if (stored) {
        const wedding = JSON.parse(stored);
        setWeddingData(wedding.weddingData);
      } else {
        setError('Wedding not found');
        setLoading(false);
        return;
      }

      // Load RSVP responses
      const allResponses = JSON.parse(localStorage.getItem('rsvp_responses') || '[]');
      const weddingResponses = allResponses.filter((r: RSVPResponse) => r.weddingId === weddingId);
      setResponses(weddingResponses);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (responses.length === 0) return;
    
    const headers = [
      'Guest Name',
      'Email',
      'Phone',
      'Attending Ceremony',
      'Attending Reception',
      'Number of Guests',
      'Bringing Children',
      'Transportation Needed',
      'Accommodation Needed',
      'Traditional Attire',
      'Dietary Restrictions',
      'Message',
      'Submitted At'
    ];
    
    const csv = [
      headers.join(','),
      ...responses.map(response => [
        `"${response.guestName}"`,
        `"${response.guestEmail}"`,
        `"${response.guestPhone || ''}"`,
        response.attendingCeremony ? 'Yes' : 'No',
        response.attendingReception ? 'Yes' : 'No',
        response.numberOfGuests,
        response.bringingChildren ? 'Yes' : 'No',
        response.transportationNeeded ? 'Yes' : 'No',
        response.accommodationNeeded ? 'Yes' : 'No',
        response.traditionalAttire ? 'Yes' : 'No',
        `"${response.dietaryRestrictions || ''}"`,
        `"${response.message || ''}"`,
        new Date(response.submittedAt).toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${weddingData?.brideName}-${weddingData?.groomName}-rsvp-responses.csv`;
    a.click();
  };

  const shareViaWhatsApp = () => {
    if (!weddingData) return;
    
    const attendingCount = responses.filter(r => r.attendingCeremony || r.attendingReception).length;
    const totalGuests = responses.reduce((sum, r) => sum + r.numberOfGuests, 0);
    
    const message = `🎉 *${weddingData.brideName} & ${weddingData.groomName} Wedding Update*\n\n📊 RSVP Summary:\n• ${responses.length} responses received\n• ${attendingCount} guests confirmed\n• ${totalGuests} total guests attending\n\n📅 Wedding: ${new Date(weddingData.weddingDate).toLocaleDateString()}\n📍 Venue: ${weddingData.venue}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredResponses = responses.filter(response =>
    response.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    response.guestEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statistics = {
    totalResponses: responses.length,
    attendingCeremony: responses.filter(r => r.attendingCeremony).length,
    attendingReception: responses.filter(r => r.attendingReception).length,
    totalGuests: responses.reduce((sum, r) => sum + r.numberOfGuests, 0),
    bringingChildren: responses.filter(r => r.bringingChildren).length,
    transportationNeeded: responses.filter(r => r.transportationNeeded).length,
    accommodationNeeded: responses.filter(r => r.accommodationNeeded).length,
    traditionalAttire: responses.filter(r => r.traditionalAttire).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !weddingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <Heart className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Dashboard Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'Wedding data not available'}</p>
            <Button onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-800">Wedding Dashboard</h1>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(weddingData.weddingDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{weddingData.venue}</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Responses</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalResponses}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attending Ceremony</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.attendingCeremony}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attending Reception</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.attendingReception}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Guests</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalGuests}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goan Wedding Specific Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bringing Children</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.bringingChildren}</p>
                </div>
                <Users className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Need Transport</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.transportationNeeded}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Need Accommodation</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.accommodationNeeded}</p>
                </div>
                <Users className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Traditional Attire</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.traditionalAttire}</p>
                </div>
                <Users className="w-8 h-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={exportCSV} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button onClick={shareViaWhatsApp} className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
              <Share2 className="w-4 h-4" />
              Share Update
            </Button>
          </div>
        </div>

        {/* RSVP Responses */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              RSVP Responses ({filteredResponses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredResponses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No RSVP responses found</p>
                <p className="text-sm">Share your RSVP link with guests to start receiving responses</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResponses.map((response, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
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
                        <span className="ml-1">{new Date(response.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Goan Wedding Specific Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      {response.bringingChildren && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Children</Badge>
                      )}
                      {response.transportationNeeded && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">Transport</Badge>
                      )}
                      {response.accommodationNeeded && (
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700">Accommodation</Badge>
                      )}
                      {response.traditionalAttire && (
                        <Badge variant="outline" className="bg-pink-50 text-pink-700">Traditional Attire</Badge>
                      )}
                    </div>
                    
                    {(response.dietaryRestrictions || response.message) && (
                      <div className="pt-3 border-t border-gray-200">
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
