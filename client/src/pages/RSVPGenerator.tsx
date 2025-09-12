import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Copy, ExternalLink, Users, AlertCircle, CheckCircle, Heart, BarChart3 } from "lucide-react";

export default function RSVPGenerator() {
  const [loading, setLoading] = useState(false);
  const [weddingCreated, setWeddingCreated] = useState(false);
  const [weddingResult, setWeddingResult] = useState<any>(null);
  const [guestLink, setGuestLink] = useState("");
  const [dashboardLink, setDashboardLink] = useState("");

  const [weddingData, setWeddingData] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
    venue: "",
    venueAddress: "",
    ceremonyTime: "",
    receptionTime: "",
    contactEmail: "",
    contactPhone: "",
    maxGuests: 100,
    rsvpDeadline: "",
    slug: "",
  });

  const generateSlug = (brideName: string, groomName: string) => {
    return `${brideName}-${groomName}`.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleWeddingDataChange = (field: string, value: any) => {
    const updatedData = { ...weddingData, [field]: value };
    if (field === 'brideName' || field === 'groomName') {
      updatedData.slug = generateSlug(updatedData.brideName, updatedData.groomName);
    }
    setWeddingData(updatedData);
  };

  const generateWedding = async () => {
    setLoading(true);
    try {
      // Create wedding
      const weddingResponse = await fetch('http://localhost:3001/api/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...weddingData,
          weddingDate: new Date(weddingData.weddingDate),
          rsvpDeadline: weddingData.rsvpDeadline ? new Date(weddingData.rsvpDeadline) : null,
          isPublic: true,
          createdAt: new Date(),
        }),
      });

      if (!weddingResponse.ok) {
        const errorData = await weddingResponse.json();
        throw new Error(errorData.error || 'Failed to create wedding');
      }
      const wedding = await weddingResponse.json();

      // Generate links
      const baseUrl = window.location.origin;
      const guestUrl = `${baseUrl}/couples/${wedding.slug}`;
      const dashboardUrl = `${baseUrl}/rsvp/dashboard?wedding=${wedding.id}`;

      setWeddingResult(wedding);
      setGuestLink(guestUrl);
      setDashboardLink(dashboardUrl);
      setWeddingCreated(true);
      
      toast({
        title: "Wedding RSVP System Created!",
        description: "Your wedding page and dashboard are ready to use"
      });

    } catch (error) {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const generateQRCode = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const createNewWedding = () => {
    setWeddingCreated(false);
    setWeddingResult(null);
    setGuestLink("");
    setDashboardLink("");
    setWeddingData({
      brideName: "",
      groomName: "",
      weddingDate: "",
      venue: "",
      venueAddress: "",
      ceremonyTime: "",
      receptionTime: "",
      contactEmail: "",
      contactPhone: "",
      maxGuests: 100,
      rsvpDeadline: "",
      slug: "",
    });
  };

  if (weddingCreated && weddingResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <Card className="mb-8 border-0 shadow-2xl">
            <CardContent className="py-8">
              <div className="text-center">
                <div className="relative mb-6">
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-pulse" />
                  <Heart className="h-6 w-6 text-red-500 absolute -top-1 -right-1 animate-ping" />
                </div>
                <h1 className="text-4xl font-bold wedding-script text-red-600 mb-3">
                  Wedding RSVP System Created!
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {weddingResult.brideName} & {weddingResult.groomName}
                </p>
                <p className="text-gray-500">
                  Your wedding page and dashboard are ready to use
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Guest Link */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-600">
                  <Users className="h-5 w-5" />
                  Guest RSVP Page
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Share this link with your guests so they can RSVP to your wedding
                </p>
                
                {/* QR Code */}
                <div className="text-center">
                  <img 
                    src={generateQRCode(guestLink)} 
                    alt="Guest RSVP QR Code" 
                    className="mx-auto mb-3 border-2 border-gray-200 rounded-lg"
                  />
                  <p className="text-xs text-gray-500">Scan to RSVP</p>
                </div>
                
                {/* Link */}
                <div className="space-y-2">
                  <Label>Guest RSVP Link</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={guestLink} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(guestLink)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Preview Button */}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => window.open(guestLink, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Guest Page
                </Button>
              </CardContent>
            </Card>

            {/* Dashboard Link */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <BarChart3 className="h-5 w-5" />
                  Admin Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Manage your wedding RSVPs, view responses, and track guest attendance
                </p>
                
                {/* QR Code */}
                <div className="text-center">
                  <img 
                    src={generateQRCode(dashboardLink)} 
                    alt="Admin Dashboard QR Code" 
                    className="mx-auto mb-3 border-2 border-gray-200 rounded-lg"
                  />
                  <p className="text-xs text-gray-500">Scan for dashboard</p>
                </div>
                
                {/* Link */}
                <div className="space-y-2">
                  <Label>Dashboard Link</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={dashboardLink} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(dashboardLink)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Dashboard Button */}
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700" 
                  onClick={() => window.open(dashboardLink, '_blank')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Open Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Wedding Details Summary */}
          <Card className="mt-8 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Wedding Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="ml-2">{new Date(weddingResult.weddingDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Ceremony:</span>
                  <span className="ml-2">{weddingResult.ceremonyTime}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Venue:</span>
                  <span className="ml-2">{weddingResult.venue}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="ml-2">{weddingResult.contactEmail}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-8 flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={createNewWedding}
            >
              Create Another Wedding
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Single form for wedding creation
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <div className="text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-3xl wedding-script text-red-600 mb-2">
                Create Your Wedding RSVP
              </CardTitle>
              <p className="text-gray-600">
                Fill out the form below to create your wedding page and get shareable links
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brideName" className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Bride's Name *
                </Label>
                <Input
                  id="brideName"
                  value={weddingData.brideName}
                  onChange={(e) => handleWeddingDataChange("brideName", e.target.value)}
                  placeholder="Enter bride's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="groomName" className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-teal-500" />
                  Groom's Name *
                </Label>
                <Input
                  id="groomName"
                  value={weddingData.groomName}
                  onChange={(e) => handleWeddingDataChange("groomName", e.target.value)}
                  placeholder="Enter groom's name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weddingDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Wedding Date *
                </Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={weddingData.weddingDate}
                  onChange={(e) => handleWeddingDataChange("weddingDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rsvpDeadline">RSVP Deadline</Label>
                <Input
                  id="rsvpDeadline"
                  type="date"
                  value={weddingData.rsvpDeadline}
                  onChange={(e) => handleWeddingDataChange("rsvpDeadline", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="venue">Venue *</Label>
              <Input
                id="venue"
                value={weddingData.venue}
                onChange={(e) => handleWeddingDataChange("venue", e.target.value)}
                placeholder="Wedding venue name"
                required
              />
            </div>

            <div>
              <Label htmlFor="venueAddress">Venue Address *</Label>
              <Textarea
                id="venueAddress"
                value={weddingData.venueAddress}
                onChange={(e) => handleWeddingDataChange("venueAddress", e.target.value)}
                placeholder="Full venue address"
                required
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ceremonyTime">Ceremony Time *</Label>
                <Input
                  id="ceremonyTime"
                  type="time"
                  value={weddingData.ceremonyTime}
                  onChange={(e) => handleWeddingDataChange("ceremonyTime", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="receptionTime">Reception Time</Label>
                <Input
                  id="receptionTime"
                  type="time"
                  value={weddingData.receptionTime}
                  onChange={(e) => handleWeddingDataChange("receptionTime", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={weddingData.contactEmail}
                  onChange={(e) => handleWeddingDataChange("contactEmail", e.target.value)}
                  placeholder="contact@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={weddingData.contactPhone}
                  onChange={(e) => handleWeddingDataChange("contactPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {weddingData.brideName && weddingData.groomName && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Preview URL:</strong> /couples/{weddingData.slug}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={generateWedding}
              disabled={loading || !weddingData.brideName || !weddingData.groomName || !weddingData.weddingDate || !weddingData.venue || !weddingData.venueAddress || !weddingData.ceremonyTime || !weddingData.contactEmail}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Wedding Page...
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5 mr-2" />
                  Create Wedding RSVP System
                </>
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              After creating, you'll get links to share with guests and manage RSVPs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}