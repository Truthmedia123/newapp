import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, QrCode, Download, Share2, Check, Heart, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { generateQRCode } from '@/utils/rsvpUtils';

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

interface GeneratedWedding {
  id: string;
  weddingData: WeddingData;
  rsvpLink: string;
  qrCodeUrl: string;
  dashboardLink: string;
  createdAt: Date;
}

export function SingleRSVPGenerator() {
  const [weddingData, setWeddingData] = useState<WeddingData>({
    brideName: '',
    groomName: '',
    weddingDate: '',
    ceremonyTime: '4:00 PM',
    receptionTime: '7:00 PM',
    venue: '',
    venueAddress: '',
    contactPhone: '',
    contactEmail: '',
    message: 'We are excited to celebrate our special day with you! Please join us for our Goan wedding celebration filled with love, laughter, and traditional festivities.'
  });

  const [generatedWedding, setGeneratedWedding] = useState<GeneratedWedding | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof WeddingData, value: string) => {
    setWeddingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateWeddingRSVP = async () => {
    if (!weddingData.brideName || !weddingData.groomName || !weddingData.weddingDate || !weddingData.venue) {
      alert('Please fill in all required fields: Bride Name, Groom Name, Wedding Date, and Venue');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate unique wedding ID
      const weddingId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const rsvpLink = `${window.location.origin}/rsvp/goan/${weddingId}`;
      const qrCodeUrl = generateQRCode(weddingId);
      const dashboardLink = `${window.location.origin}/rsvp/dashboard/${weddingId}`;

      const newWedding: GeneratedWedding = {
        id: weddingId,
        weddingData,
        rsvpLink,
        qrCodeUrl,
        dashboardLink,
        createdAt: new Date()
      };

      setGeneratedWedding(newWedding);
      
      // Store in localStorage for persistence
      localStorage.setItem(`wedding_${weddingId}`, JSON.stringify(newWedding));
      
      console.log('Generated wedding RSVP:', newWedding);
    } catch (error) {
      console.error('Error generating wedding RSVP:', error);
      alert('Error generating RSVP. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareViaWhatsApp = () => {
    if (!generatedWedding) return;
    
    const message = `🎉 *${generatedWedding.weddingData.brideName} & ${generatedWedding.weddingData.groomName}* are getting married!\n\n📅 Date: ${new Date(generatedWedding.weddingData.weddingDate).toLocaleDateString()}\n📍 Venue: ${generatedWedding.weddingData.venue}\n\nPlease RSVP using this link:\n${generatedWedding.rsvpLink}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const exportWeddingData = () => {
    if (!generatedWedding) return;
    
    const data = {
      weddingId: generatedWedding.id,
      brideName: generatedWedding.weddingData.brideName,
      groomName: generatedWedding.weddingData.groomName,
      weddingDate: generatedWedding.weddingData.weddingDate,
      venue: generatedWedding.weddingData.venue,
      rsvpLink: generatedWedding.rsvpLink,
      dashboardLink: generatedWedding.dashboardLink,
      qrCodeUrl: generatedWedding.qrCodeUrl
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedWedding.weddingData.brideName}-${generatedWedding.weddingData.groomName}-wedding-details.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold text-gray-800">Goan Wedding RSVP Generator</h1>
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your personalized Goan wedding RSVP in minutes. Share with guests instantly and manage responses easily.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wedding Details Form */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <CardTitle className="text-2xl text-center">Wedding Details</CardTitle>
              <p className="text-center text-pink-100">Fill in your Goan wedding information</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Couple Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brideName" className="text-gray-700 font-medium">Bride's Name *</Label>
                  <Input
                    id="brideName"
                    value={weddingData.brideName}
                    onChange={(e) => handleInputChange('brideName', e.target.value)}
                    placeholder="Enter bride's name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="groomName" className="text-gray-700 font-medium">Groom's Name *</Label>
                  <Input
                    id="groomName"
                    value={weddingData.groomName}
                    onChange={(e) => handleInputChange('groomName', e.target.value)}
                    placeholder="Enter groom's name"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              {/* Wedding Date */}
              <div>
                <Label htmlFor="weddingDate" className="text-gray-700 font-medium">Wedding Date *</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={weddingData.weddingDate}
                  onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              {/* Venue Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="venue" className="text-gray-700 font-medium">Venue Name *</Label>
                  <Input
                    id="venue"
                    value={weddingData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    placeholder="e.g., Grand Hyatt Goa, Taj Exotica Resort"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="venueAddress" className="text-gray-700 font-medium">Venue Address</Label>
                  <Textarea
                    id="venueAddress"
                    value={weddingData.venueAddress}
                    onChange={(e) => handleInputChange('venueAddress', e.target.value)}
                    placeholder="Full address of the venue"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Event Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ceremonyTime" className="text-gray-700 font-medium">Ceremony Time</Label>
                  <Input
                    id="ceremonyTime"
                    value={weddingData.ceremonyTime}
                    onChange={(e) => handleInputChange('ceremonyTime', e.target.value)}
                    placeholder="4:00 PM"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="receptionTime" className="text-gray-700 font-medium">Reception Time</Label>
                  <Input
                    id="receptionTime"
                    value={weddingData.receptionTime}
                    onChange={(e) => handleInputChange('receptionTime', e.target.value)}
                    placeholder="7:00 PM"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone" className="text-gray-700 font-medium">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={weddingData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="text-gray-700 font-medium">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={weddingData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="couple@example.com"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Welcome Message */}
              <div>
                <Label htmlFor="message" className="text-gray-700 font-medium">Welcome Message</Label>
                <Textarea
                  id="message"
                  value={weddingData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Write a warm welcome message for your guests..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateWeddingRSVP}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 text-lg font-semibold"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Generate Goan Wedding RSVP
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Results */}
          <div className="space-y-6">
            {generatedWedding ? (
              <>
                {/* Wedding Preview */}
                <Card className="shadow-lg border-2 border-pink-200">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    <CardTitle className="text-xl text-center">Your Wedding RSVP</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Heart className="w-6 h-6 text-pink-500" />
                        <h2 className="text-2xl font-bold text-gray-800">
                          {generatedWedding.weddingData.brideName} & {generatedWedding.weddingData.groomName}
                        </h2>
                        <Heart className="w-6 h-6 text-pink-500" />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span>{new Date(generatedWedding.weddingData.weddingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span>{generatedWedding.weddingData.venue}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span>Ceremony: {generatedWedding.weddingData.ceremonyTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* RSVP Link */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      Guest RSVP Link
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">RSVP Link:</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(generatedWedding.rsvpLink, 'rsvp')}
                        >
                          {copiedCode === 'rsvp' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm font-mono bg-white p-2 rounded border break-all">
                        {generatedWedding.rsvpLink}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => window.open(generatedWedding.qrCodeUrl, '_blank')}
                        variant="outline"
                        className="flex-1"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        View QR Code
                      </Button>
                      <Button
                        onClick={shareViaWhatsApp}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share via WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Dashboard Link */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      Couple Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Access your dashboard to view guest responses, export data, and manage your wedding RSVPs.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">Dashboard Link:</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(generatedWedding.dashboardLink, 'dashboard')}
                        >
                          {copiedCode === 'dashboard' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm font-mono bg-white p-2 rounded border break-all">
                        {generatedWedding.dashboardLink}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => window.open(generatedWedding.dashboardLink, '_blank')}
                        className="flex-1 bg-purple-500 hover:bg-purple-600"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Open Dashboard
                      </Button>
                      <Button
                        onClick={exportWeddingData}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Heart className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Generate</h3>
                  <p className="text-gray-500">
                    Fill in your wedding details and click "Generate Goan Wedding RSVP" to create your personalized RSVP system.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-pink-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold">Fill Details</h3>
                <p className="text-sm text-gray-600">Enter your Goan wedding information including couple names, date, venue, and times.</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold">Generate Instantly</h3>
                <p className="text-sm text-gray-600">Get your RSVP link and QR code immediately. Share with guests via WhatsApp or copy the link.</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-emerald-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold">Manage Responses</h3>
                <p className="text-sm text-gray-600">Use your dashboard to view guest responses, export data, and track attendance.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
