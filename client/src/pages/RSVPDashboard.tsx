import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, MessageSquare, Download, Mail, QrCode } from 'lucide-react';
import { exportGuestList } from '@/utils/rsvpUtils';

interface RSVPDashboardProps {
  weddingId?: string;
}

interface RSVPData {
  wedding: {
    brideName: string;
    groomName: string;
    weddingDate: string;
    venue: string;
  };
  rsvps: Array<{
    id: number;
    guestName: string;
    guestEmail: string;
    numberOfGuests: number;
    attendingCeremony: boolean;
    attendingReception: boolean;
    message: string;
    createdAt: string;
  }>;
  invitations: Array<{
    id: number;
    guestName: string;
    guestEmail: string;
    status: string;
    invitationCode: string;
  }>;
}

export default function RSVPDashboard({ weddingId: propWeddingId }: RSVPDashboardProps) {
  const { weddingId: paramWeddingId } = useParams();
  const weddingId = propWeddingId || paramWeddingId;
  
  const [data, setData] = useState<RSVPData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (weddingId) {
      fetchRSVPData();
    }
  }, [weddingId]);

  const fetchRSVPData = async () => {
    try {
      const response = await fetch(`/api/rsvp/dashboard/${weddingId}`);
      if (response.ok) {
        const rsvpData = await response.json();
        setData(rsvpData);
      }
    } catch (error) {
      console.error('Failed to fetch RSVP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (invitationId: number) => {
    try {
      const response = await fetch(`/api/rsvp/reminder/${invitationId}`, {
        method: 'POST'
      });
      if (response.ok) {
        // Show success message
        console.log('Reminder sent successfully');
      }
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  };

  const generateQRCode = (invitationCode: string) => {
    const rsvpUrl = `${window.location.origin}/rsvp/${invitationCode}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(rsvpUrl)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading RSVP dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Wedding Not Found</h1>
          <p className="text-gray-600">The wedding you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalGuests = data.rsvps.reduce((sum, rsvp) => sum + rsvp.numberOfGuests, 0);
  const attendingGuests = data.rsvps.filter(rsvp => rsvp.attendingCeremony).reduce((sum, rsvp) => sum + rsvp.numberOfGuests, 0);
  const responseRate = data.invitations.length > 0 ? (data.rsvps.length / data.invitations.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">RSVP Dashboard</h1>
          <p className="text-gray-600">
            {data.wedding.brideName} & {data.wedding.groomName} - {new Date(data.wedding.weddingDate).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invitations</p>
                  <p className="text-2xl font-bold text-gray-900">{data.invitations.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Responses</p>
                  <p className="text-2xl font-bold text-gray-900">{data.rsvps.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attending</p>
                  <p className="text-2xl font-bold text-gray-900">{attendingGuests}</p>
                </div>
                <Calendar className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{responseRate.toFixed(1)}%</p>
                </div>
                <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="responses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="responses">RSVP Responses</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="responses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>RSVP Responses</CardTitle>
                  <Button onClick={() => exportGuestList(data.rsvps)} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.rsvps.map((rsvp) => (
                    <div key={rsvp.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{rsvp.guestName}</h3>
                        <p className="text-sm text-gray-600">{rsvp.guestEmail}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={rsvp.attendingCeremony ? "default" : "secondary"}>
                            {rsvp.numberOfGuests} guest{rsvp.numberOfGuests > 1 ? 's' : ''}
                          </Badge>
                          {rsvp.attendingCeremony && <Badge variant="outline">Ceremony</Badge>}
                          {rsvp.attendingReception && <Badge variant="outline">Reception</Badge>}
                        </div>
                        {rsvp.message && (
                          <p className="text-sm text-gray-600 mt-2 italic">"{rsvp.message}"</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(rsvp.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invitation Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{invitation.guestName}</h3>
                        <p className="text-sm text-gray-600">{invitation.guestEmail}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={
                            invitation.status === 'responded' ? 'default' :
                            invitation.status === 'viewed' ? 'secondary' : 'outline'
                          }>
                            {invitation.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendReminder(invitation.id)}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Remind
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(generateQRCode(invitation.invitationCode), '_blank')}
                        >
                          <QrCode className="h-4 w-4 mr-1" />
                          QR Code
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Guests</span>
                      <span className="font-semibold">{totalGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attending</span>
                      <span className="font-semibold text-green-600">{attendingGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Not Attending</span>
                      <span className="font-semibold text-red-600">{totalGuests - attendingGuests}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Response Rate</span>
                      <span className="font-semibold">{responseRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending</span>
                      <span className="font-semibold text-yellow-600">
                        {data.invitations.length - data.rsvps.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
