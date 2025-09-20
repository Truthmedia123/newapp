import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Calendar, Users, Mail, Phone, CheckCircle, Copy, ExternalLink, BarChart3, AlertCircle, Clock } from "lucide-react";
import { convertTo12HourFormat } from "@/lib/timeUtils";
import { useToast } from "@/hooks/use-toast";
import type { Wedding } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Ceremony Types Constant
const goanCeremonyTypes = {
  hindu: {
    primary: 'Lagna Ceremony',
    alternatives: ['Kazaar', 'Hindu Wedding', 'Marriage Ceremony']
  },
  christian: {
    primary: 'Church Wedding',
    alternatives: ['Catholic Wedding', 'Holy Matrimony', 'Wedding Ceremony']
  },
  muslim: {
    primary: 'Nikah Ceremony',
    alternatives: ['Nikah', 'Islamic Wedding']
  }
};
const commonOptions = ['Nuptials'];

// Function to get ceremony icon based on ceremony type
const getCeremonyIcon = (ceremonyType?: string) => {
  const type = ceremonyType?.toLowerCase() || '';
  if (type.includes('nikah')) return '🕌';
  if (type.includes('church') || type.includes('catholic')) return '⛪';
  if (type.includes('lagna') || type.includes('kazaar') || type.includes('hindu')) return '🕉️';
  if (type.includes('nuptials')) return '💍';
  return '💒'; // default
};

// Function to get ceremony name with fallback
const getCeremonyName = (weddingData: any) => {
  return weddingData.ceremonyDetails || 
         weddingData.ceremonyType || 
         weddingData.ceremony || 
         'Wedding Ceremony';
};

// Error Boundary Component
const ErrorFallback = ({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) => (
  <div className='p-4 text-red-600'>
    <h2>Something went wrong:</h2>
    <pre>{error.message}</pre>
    <button 
      onClick={resetErrorBoundary}
      className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Refresh Page
    </button>
  </div>
);

// TimeSelect component
const TimeSelect = ({ name, value, onChange }: { name: string; value: any; onChange: (value: any) => void }) => (
  <div className="flex space-x-2">
    <Select 
      value={value.hour || ''} 
      onValueChange={(hour) => onChange({ ...value, hour })}
    >
      <SelectTrigger className="w-20">
        <SelectValue placeholder="HH" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 12 }, (_, i) => (
          <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
            {String(i+1).padStart(2, '0')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    :
    <Select 
      value={value.minute || ''} 
      onValueChange={(minute) => onChange({ ...value, minute })}
    >
      <SelectTrigger className="w-20">
        <SelectValue placeholder="MM" />
      </SelectTrigger>
      <SelectContent>
        {['00','15','30','45'].map(m => (
          <SelectItem key={m} value={m}>{m}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select 
      value={value.ampm || ''} 
      onValueChange={(ampm) => onChange({ ...value, ampm })}
    >
      <SelectTrigger className="w-20">
        <SelectValue placeholder="AM/PM" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="AM">AM</SelectItem>
        <SelectItem value="PM">PM</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default function RSVPGenerator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [weddingCreated, setWeddingCreated] = useState(false);
  const [weddingResult, setWeddingResult] = useState<any>(null);
  const [guestLink, setGuestLink] = useState("");
  const [dashboardLink, setDashboardLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  // New state for ceremony details and time selectors
  const [ceremonyDetails, setCeremonyDetails] = useState("");
  const [ceremonyTime, setCeremonyTime] = useState({ hour: "", minute: "", ampm: "" });
  const [receptionTime, setReceptionTime] = useState({ hour: "", minute: "", ampm: "" });
  
  // New state for separate venues
  const [ceremonyVenue, setCeremonyVenue] = useState("");
  const [ceremonyVenueAddress, setCeremonyVenueAddress] = useState("");
  const [receptionVenue, setReceptionVenue] = useState("");
  const [receptionVenueAddress, setReceptionVenueAddress] = useState("");

  const [weddingData, setWeddingData] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
    venue: "",
    venueAddress: "",
    contactEmail: "",
    contactPhone: "",
    maxGuests: 100,
    rsvpDeadline: "",
    slug: "",
  });

  // Debug console logs
  useEffect(() => {
    console.log('Bride name:', weddingData.brideName);
    console.log('Groom name:', weddingData.groomName);
    console.log('Form state:', weddingData);
  }, [weddingData]);

  // Add proper form validation
  const validateNames = (bride: string, groom: string) => {
    if (!bride?.trim() || !groom?.trim()) {
      setError('Both bride and groom names are required');
      return false;
    }
    return true;
  };

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

  // Wrap form submission in try-catch
  const generateWedding = async () => {
    try {
      // Validate names before submission
      if (!validateNames(weddingData.brideName, weddingData.groomName)) {
        return;
      }

      // Validate ceremony details and time
      if (!ceremonyDetails.trim()) {
        setError('Ceremony details are required');
        return;
      }
      
      if (!ceremonyTime.hour || !ceremonyTime.minute || !ceremonyTime.ampm) {
        setError('Please select a complete ceremony time');
        return;
      }
      
      // Validate ceremony venue
      if (!ceremonyVenue.trim()) {
        setError('Ceremony venue is required');
        return;
      }
      
      if (!ceremonyVenueAddress.trim()) {
        setError('Ceremony venue address is required');
        return;
      }

      // Combine time fields into HH:MM format
      const ceremonyTimeFormatted = `${ceremonyTime.hour}:${ceremonyTime.minute} ${ceremonyTime.ampm}`;
      const receptionTimeFormatted = receptionTime.hour && receptionTime.minute && receptionTime.ampm 
        ? `${receptionTime.hour}:${receptionTime.minute} ${receptionTime.ampm}` 
        : "";

      setLoading(true);
      setError(null);
      
      // Log the data being sent
      const weddingDataPayload = {
        ...weddingData,
        ceremonyTime: ceremonyTimeFormatted,
        receptionTime: receptionTimeFormatted,
        ceremonyDetails: ceremonyDetails,
        weddingDate: new Date(weddingData.weddingDate),
        rsvpDeadline: weddingData.rsvpDeadline ? new Date(weddingData.rsvpDeadline) : null,
        isPublic: true,
        createdAt: new Date(),
        // Add separate venue information
        ceremonyVenue: ceremonyVenue,
        ceremonyVenueAddress: ceremonyVenueAddress,
        receptionVenue: receptionVenue || null,
        receptionVenueAddress: receptionVenueAddress || null,
      };
      
      console.log('Sending wedding data:', weddingDataPayload);
      
      // Create wedding
      const weddingResponse = await fetch('/api/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weddingDataPayload),
      });

      if (!weddingResponse.ok) {
        const errorBody = await weddingResponse.json().catch(() => null);
        console.error('RSVP Creation Error:', weddingResponse.status, weddingResponse.statusText, errorBody);
        throw new Error(errorBody?.error || errorBody?.message || 'Unknown server error');
      }
      
      const wedding = await weddingResponse.json();
      console.log('Wedding created successfully:', wedding);

      // Generate links
      const baseUrl = window.location.origin;
      const guestUrl = `${baseUrl}/couples/${wedding.slug}`;
      // Use secret link instead of wedding ID
      const dashboardUrl = `${baseUrl}/rsvp/dashboard?secret=${wedding.adminSecretLink}`;

      setWeddingResult(wedding);
      setGuestLink(guestUrl);
      setDashboardLink(dashboardUrl);
      setWeddingCreated(true);
      
      toast({
        title: "Wedding RSVP System Created!",
        description: "Your wedding page and dashboard are ready to use"
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Form submission error:', error);
      setError(`Creation failed: ${errorMessage}`);
      toast({
        title: "Creation Failed",
        description: `Creation failed: ${errorMessage}`,
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
    setCeremonyDetails("");
    setCeremonyTime({ hour: "", minute: "", ampm: "" });
    setReceptionTime({ hour: "", minute: "", ampm: "" });
    // Reset new venue fields
    setCeremonyVenue("");
    setCeremonyVenueAddress("");
    setReceptionVenue("");
    setReceptionVenueAddress("");
    setWeddingData({
      brideName: "",
      groomName: "",
      weddingDate: "",
      venue: "",
      venueAddress: "",
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
                <h1 className="text-4xl font-bold font-elegant text-red-600 mb-3">
                  Wedding RSVP System Created!
                </h1>
                <p className="text-lg text-gray-600 mb-4 font-serif">
                  {weddingResult.brideName} & {weddingResult.groomName}
                </p>
                <p className="text-gray-500 font-serif">
                  Your wedding page and dashboard are ready to use
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Guest Link */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-600 font-wedding">
                  <Users className="h-5 w-5" />
                  Guest RSVP Page
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 font-serif">
                  Share this link with your guests so they can RSVP to your wedding
                </p>
                
                {/* QR Code */}
                <div className="text-center">
                  <img 
                    src={generateQRCode(guestLink)} 
                    alt="Guest RSVP QR Code" 
                    className="mx-auto mb-3 border-2 border-gray-200 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 font-serif">Scan to RSVP</p>
                </div>
                
                {/* Link */}
                <div className="space-y-2">
                  <Label className="font-wedding">Guest RSVP Link</Label>
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
                  className="w-full font-wedding" 
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
                <CardTitle className="flex items-center gap-2 text-red-600 font-wedding">
                  <BarChart3 className="h-5 w-5" />
                  Admin Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 font-serif">
                  Manage your wedding RSVPs, view responses, and track guest attendance
                </p>
                
                {/* QR Code */}
                <div className="text-center">
                  <img 
                    src={generateQRCode(dashboardLink)} 
                    alt="Admin Dashboard QR Code" 
                    className="mx-auto mb-3 border-2 border-gray-200 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 font-serif">Scan for dashboard</p>
                </div>
                
                {/* Link */}
                <div className="space-y-2">
                  <Label className="font-wedding">Dashboard Link</Label>
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
                  className="w-full bg-red-600 hover:bg-red-700 font-wedding" 
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
              <CardTitle className="flex items-center gap-2 font-wedding">
                <Calendar className="h-5 w-5" />
                Wedding Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Wedding Details with Enhanced Typography */}
              <div className="wedding-details-sidebar space-y-5 p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                {/* Date */}
                <div className="detail-item">
                  <span className="text-2xl text-red-500">📅</span>
                  <div>
                    <strong className="font-wedding text-gray-800 text-base tracking-wide">Date</strong>
                    <p className="font-serif text-gray-600 text-sm">{new Date(weddingResult.weddingDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Ceremony */}
                <div className="detail-item">
                  <span className="text-2xl">{getCeremonyIcon(weddingResult.ceremonyDetails)}</span>
                  <div>
                    <strong className="font-wedding text-gray-800 text-base tracking-wide">Ceremony</strong>
                    <p className="font-elegant text-purple-700 text-base font-medium">
                      {getCeremonyName(weddingResult)}
                    </p>
                    <p className="font-serif text-gray-600 text-sm">
                      {convertTo12HourFormat(weddingResult.ceremonyTime)}
                    </p>
                  </div>
                </div>

                {/* Reception */}
                {weddingResult.receptionTime && (
                  <div className="detail-item">
                    <span className="text-2xl text-yellow-500">🥂</span>
                    <div>
                      <strong className="font-wedding text-gray-800 text-base tracking-wide">Reception</strong>
                      <p className="font-serif text-gray-600 text-sm">{convertTo12HourFormat(weddingResult.receptionTime)}</p>
                    </div>
                  </div>
                )}

                {/* Venue */}
                <div className="detail-item">
                  <span className="text-2xl text-red-500">📍</span>
                  <div>
                    <strong className="font-wedding text-gray-800 text-base tracking-wide">Venue</strong>
                    <p className="font-serif text-gray-700 text-sm font-medium">{weddingResult.venue}</p>
                    <p className="font-sans text-gray-500 text-xs leading-relaxed">{weddingResult.venueAddress}</p>
                  </div>
                </div>

                {/* RSVP Deadline */}
                {weddingResult.rsvpDeadline && (
                  <div className="detail-item">
                    <span className="text-2xl text-amber-500">⏰</span>
                    <div>
                      <strong className="font-wedding text-gray-800 text-base tracking-wide">RSVP Deadline</strong>
                      <p className="font-serif text-gray-600 text-sm">{new Date(weddingResult.rsvpDeadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-8 flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={createNewWedding}
              className="font-wedding"
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
              <CardTitle className="text-3xl font-elegant text-red-600 mb-2">
                Create Your Wedding RSVP
              </CardTitle>
              <p className="text-gray-600 font-serif">
                Fill out the form below to create your wedding page and get shareable links
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-serif">{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brideName" className="flex items-center gap-2 font-wedding">
                  <Heart className="h-4 w-4 text-red-500" />
                  Bride's Name *
                </Label>
                <Input
                  id="brideName"
                  value={weddingData.brideName}
                  onChange={(e) => handleWeddingDataChange("brideName", e.target.value)}
                  placeholder="Enter bride's name"
                  required
                  className="font-serif"
                />
              </div>
              <div>
                <Label htmlFor="groomName" className="flex items-center gap-2 font-wedding">
                  <Heart className="h-4 w-4 text-teal-500" />
                  Groom's Name *
                </Label>
                <Input
                  id="groomName"
                  value={weddingData.groomName}
                  onChange={(e) => handleWeddingDataChange("groomName", e.target.value)}
                  placeholder="Enter groom's name"
                  required
                  className="font-serif"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weddingDate" className="flex items-center gap-2 font-wedding">
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
                <Label htmlFor="rsvpDeadline" className="font-wedding">RSVP Deadline</Label>
                <Input
                  id="rsvpDeadline"
                  type="date"
                  value={weddingData.rsvpDeadline}
                  onChange={(e) => handleWeddingDataChange("rsvpDeadline", e.target.value)}
                />
              </div>
            </div>

            {/* Ceremony Venue */}
            <div>
              <Label htmlFor="ceremonyVenue" className="font-wedding">Ceremony Venue *</Label>
              <Input
                id="ceremonyVenue"
                value={ceremonyVenue}
                onChange={(e) => setCeremonyVenue(e.target.value)}
                placeholder="e.g., St. Alex Church, Goa"
                required
                className="font-serif"
              />
            </div>

            {/* Ceremony Venue Address */}
            <div>
              <Label htmlFor="ceremonyVenueAddress" className="font-wedding">Ceremony Venue Address *</Label>
              <Textarea
                id="ceremonyVenueAddress"
                value={ceremonyVenueAddress}
                onChange={(e) => setCeremonyVenueAddress(e.target.value)}
                placeholder="Full address of ceremony venue"
                required
                rows={2}
                className="font-serif"
              />
            </div>

            {/* Reception Venue (Optional) */}
            <div>
              <Label htmlFor="receptionVenue" className="font-wedding">Reception Venue</Label>
              <Input
                id="receptionVenue"
                value={receptionVenue}
                onChange={(e) => setReceptionVenue(e.target.value)}
                placeholder="e.g., Grand Hyatt Goa (leave empty if same as ceremony)"
                className="font-serif"
              />
            </div>

            {/* Reception Venue Address (Optional) */}
            <div>
              <Label htmlFor="receptionVenueAddress" className="font-wedding">Reception Venue Address</Label>
              <Textarea
                id="receptionVenueAddress"
                value={receptionVenueAddress}
                onChange={(e) => setReceptionVenueAddress(e.target.value)}
                placeholder="Full address of reception venue"
                rows={2}
                className="font-serif"
              />
            </div>

            {/* Ceremony Details */}
            <div>
              <Label htmlFor="ceremonyDetails" className="flex items-center gap-2 font-wedding">
                <Heart className="h-4 w-4" />
                Ceremony Details *
              </Label>
              <Select value={ceremonyDetails} onValueChange={setCeremonyDetails}>
                <SelectTrigger id="ceremonyDetails" className="w-full font-serif">
                  <SelectValue placeholder="Select Ceremony" />
                </SelectTrigger>
                <SelectContent>
                  {commonOptions.map(opt => <SelectItem key={opt} value={opt} className="font-serif">{opt}</SelectItem>)}
                  {Object.values(goanCeremonyTypes).flatMap(group => 
                    [group.primary, ...group.alternatives].map(opt =>
                      <SelectItem key={opt} value={opt} className="font-serif">{opt}</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Ceremony Time */}
            <div>
              <Label htmlFor="ceremonyTime" className="flex items-center gap-2 font-wedding">
                <Clock className="h-4 w-4" />
                Ceremony Time *
              </Label>
              <TimeSelect 
                name="ceremonyTime" 
                value={ceremonyTime} 
                onChange={setCeremonyTime} 
              />
            </div>

            {/* Reception Time */}
            <div>
              <Label htmlFor="receptionTime" className="flex items-center gap-2 font-wedding">
                <Clock className="h-4 w-4" />
                Reception Time
              </Label>
              <TimeSelect 
                name="receptionTime" 
                value={receptionTime} 
                onChange={setReceptionTime} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail" className="font-wedding">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={weddingData.contactEmail}
                  onChange={(e) => handleWeddingDataChange("contactEmail", e.target.value)}
                  placeholder="contact@example.com"
                  required
                  className="font-serif"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone" className="font-wedding">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={weddingData.contactPhone}
                  onChange={(e) => handleWeddingDataChange("contactPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="font-serif"
                />
              </div>
            </div>

            {weddingData.brideName && weddingData.groomName && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-serif">
                  <strong className="font-wedding">Preview URL:</strong> /couples/{weddingData.slug}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={generateWedding}
              disabled={loading || !weddingData.brideName || !weddingData.groomName || !weddingData.weddingDate || !ceremonyVenue || !ceremonyVenueAddress || !weddingData.contactEmail || !ceremonyDetails || !ceremonyTime.hour || !ceremonyTime.minute || !ceremonyTime.ampm}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 text-lg font-elegant"
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

            <p className="text-sm text-gray-500 text-center font-serif">
              After creating, you'll get links to share with guests and manage RSVPs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}