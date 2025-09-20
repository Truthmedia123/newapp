import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { RSVPHeader } from "@/components/RSVPHeader";
import { convertTo12HourFormat } from "@/lib/timeUtils";
import type { Wedding, Rsvp } from "@shared/schema";

export default function Couples() {
  const { slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    attendingCeremony: true,
    attendingReception: true,
    numberOfGuests: 1,
    dietaryRestrictions: "",
    message: ""
  });

  const { data: wedding, isLoading } = useQuery<Wedding>({
    queryKey: [`/api/weddings/${slug}`],
  });

  const { data: rsvps } = useQuery<Rsvp[]>({
    queryKey: [`/api/weddings/${wedding?.id}/rsvps`],
    enabled: !!wedding?.id,
  });

  const createRsvpMutation = useMutation({
    mutationFn: async (rsvpData: typeof rsvpForm) => {
      const response = await fetch(`/api/weddings/${wedding!.id}/rsvps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData),
      });
      if (!response.ok) throw new Error('Failed to create RSVP');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/weddings/${wedding!.id}/rsvps`] });
      toast({ title: "RSVP submitted successfully!" });
      setShowRsvpForm(false);
      setRsvpForm({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        attendingCeremony: true,
        attendingReception: true,
        numberOfGuests: 1,
        dietaryRestrictions: "",
        message: ""
      });
    },
    onError: () => {
      toast({ title: "Failed to submit RSVP", variant: "destructive" });
    }
  });

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    createRsvpMutation.mutate(rsvpForm);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wedding details...</p>
        </div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Wedding Not Found</h1>
          <p className="text-gray-600">The wedding invitation you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const weddingDate = new Date(wedding.weddingDate);
  const isRsvpOpen = !wedding.rsvpDeadline || new Date() < new Date(wedding.rsvpDeadline);
  
  // Function to get ceremony icon based on ceremony type
  const getCeremonyIcon = (ceremonyType?: string) => {
    const type = ceremonyType?.toLowerCase() || '';
    if (type.includes('nikah')) return '🕌';
    if (type.includes('church') || type.includes('catholic')) return '⛪';
    if (type.includes('lagna') || type.includes('kazaar') || type.includes('hindu')) return '🕉️';
    if (type.includes('nuptials')) return '💍';
    return '💒'; // default
  };

  // Function to get ceremony name with fallback to prevent duplication
  const getCeremonyName = (weddingData: any) => {
    return weddingData.ceremonyDetails || 
           weddingData.ceremonyType || 
           weddingData.ceremony || 
           'Wedding Ceremony';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: wedding.coverImage 
              ? `url(${wedding.coverImage})` 
              : "url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200')"
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <p className="font-script text-3xl mb-4 text-yellow-300">
            You're Invited to Celebrate
          </p>
          
          <h1 className="font-elegant text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="block">{wedding.brideName}</span>
            <span className="font-script text-yellow-400 text-4xl md:text-5xl mx-8">&</span>
            <span className="block">{wedding.groomName}</span>
          </h1>
          
          {/* Header Info Bar with Enhanced Typography and Better Contrast */}
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-lg p-4 mx-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm md:text-base">
              
              {/* Date */}
              <div className="flex items-center space-x-2">
                <span className="text-red-500 text-lg">📅</span>
                <span className="font-serif text-gray-800 font-medium">
                  {weddingDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              {/* Ceremony */}
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getCeremonyIcon(wedding.ceremonyDetails)}</span>
                <span className="font-elegant text-purple-700 font-medium">
                  {getCeremonyName(wedding)} - {convertTo12HourFormat(wedding.ceremonyTime)}
                </span>
              </div>
              
              {/* Ceremony Venue */}
              <div className="flex items-center space-x-2">
                <span className="text-red-500 text-lg">⛪</span>
                <span className="font-serif text-gray-800 font-medium">
                  {wedding.ceremonyVenue || wedding.venue}
                </span>
              </div>
            </div>
            
            {/* Reception Info - Second Row */}
            {(wedding.receptionTime || wedding.receptionVenue) && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm md:text-base mt-3 pt-3 border-t border-gray-200">
                
                {/* Reception Time */}
                {wedding.receptionTime && (
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500 text-lg">🥂</span>
                    <span className="font-serif text-gray-800 font-medium">
                      Reception - {convertTo12HourFormat(wedding.receptionTime)}
                    </span>
                  </div>
                )}
                
                {/* Reception Venue */}
                {(wedding.receptionVenue || wedding.venue) && (
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500 text-lg">🏛️</span>
                    <span className="font-serif text-gray-800 font-medium">
                      {wedding.receptionVenue || wedding.venue}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {isRsvpOpen && (
            <div className="mt-8">
              <Button
                onClick={() => setShowRsvpForm(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl transform hover:scale-105 transition-all"
              >
                <i className="fas fa-heart mr-3"></i>RSVP Now
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* RSVP Header - Updated to hide analytics and pass venue props */}
            <RSVPHeader
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              weddingDate={weddingDate}
              ceremonyTime={wedding.ceremonyTime}
              venue={wedding.venue}
              isRsvpOpen={isRsvpOpen}
              onRsvpClick={() => setShowRsvpForm(true)}
              ceremonyDetails={wedding.ceremonyDetails}
              ceremonyVenue={wedding.ceremonyVenue}
              ceremonyVenueAddress={wedding.ceremonyVenueAddress}
              receptionVenue={wedding.receptionVenue}
              receptionVenueAddress={wedding.receptionVenueAddress}
            />

            {/* Our Story */}
            {wedding.story && (
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-center font-elegant text-red-600">
                    Our Love Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg font-serif">{wedding.story}</p>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {wedding.galleryImages && Array.isArray(wedding.galleryImages) && wedding.galleryImages.length > 0 && (
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-center font-elegant text-teal-600">
                    Our Journey Together
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {wedding.galleryImages.map((image: string, index: number) => (
                        <CarouselItem key={index} className="md:basis-1/2">
                          <img 
                            src={image} 
                            alt={`${wedding.brideName} & ${wedding.groomName} ${index + 1}`}
                            className="w-full h-80 object-cover rounded-xl" 
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
            )}

            {/* RSVP List - REMOVED as per user request */}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Wedding Details with Enhanced Typography */}
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold font-elegant text-red-600">
                  Wedding Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 wedding-details-sidebar">
                {/* Date */}
                <div className="detail-item">
                  <span className="text-2xl text-red-500">📅</span>
                  <div>
                    <strong className="font-wedding text-gray-800 text-base tracking-wide">Date</strong>
                    <p className="font-serif text-gray-600 text-sm">{weddingDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>

                {/* Ceremony */}
                <div className="detail-item">
                  <span className="text-2xl">{getCeremonyIcon(wedding.ceremonyDetails)}</span>
                  <div>
                    <strong className="font-wedding text-gray-800 text-base tracking-wide">Ceremony</strong>
                    <p className="font-elegant text-purple-700 text-base font-medium">
                      {getCeremonyName(wedding)}
                    </p>
                    <p className="font-serif text-gray-600 text-sm">
                      {convertTo12HourFormat(wedding.ceremonyTime)}
                    </p>
                  </div>
                </div>

                {wedding.receptionTime && (
                  <div className="detail-item">
                    <span className="text-2xl text-yellow-500">🥂</span>
                    <div>
                      <strong className="font-wedding text-gray-800 text-base tracking-wide">Reception</strong>
                      <p className="font-serif text-gray-600 text-sm">{convertTo12HourFormat(wedding.receptionTime)}</p>
                    </div>
                  </div>
                )}

                {/* Ceremony Venue */}
                <div className="detail-item">
                  <span className="text-2xl text-red-500">⛪</span>
                  <div>
                    <strong className="font-wedding text-gray-800 text-base tracking-wide">Ceremony Venue</strong>
                    <p className="font-serif text-gray-700 text-sm font-medium">
                      {wedding.ceremonyVenue || wedding.venue}
                    </p>
                    <p className="font-sans text-gray-500 text-xs leading-relaxed">
                      {wedding.ceremonyVenueAddress || wedding.venueAddress}
                    </p>
                  </div>
                </div>

                {/* Reception Venue (if different) */}
                {wedding.receptionVenue && wedding.receptionVenue !== (wedding.ceremonyVenue || wedding.venue) && (
                  <div className="detail-item">
                    <span className="text-2xl text-yellow-600">🏛️</span>
                    <div>
                      <strong className="font-wedding text-gray-800 text-base tracking-wide">Reception Venue</strong>
                      <p className="font-serif text-gray-700 text-sm font-medium">
                        {wedding.receptionVenue}
                      </p>
                      <p className="font-sans text-gray-500 text-xs leading-relaxed">
                        {wedding.receptionVenueAddress}
                      </p>
                    </div>
                  </div>
                )}

                {/* RSVP Deadline */}
                {wedding.rsvpDeadline && (
                  <div className="detail-item">
                    <span className="text-2xl text-amber-500">⏰</span>
                    <div>
                      <strong className="font-wedding text-gray-800 text-base tracking-wide">RSVP Deadline</strong>
                      <p className="font-serif text-gray-600 text-sm">
                        {new Date(wedding.rsvpDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold font-elegant text-teal-600">
                  Questions?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope text-red-500"></i>
                  <a href={`mailto:${wedding.contactEmail}`} className="text-gray-600 hover:text-red-500 font-serif">
                    {wedding.contactEmail}
                  </a>
                </div>

                {wedding.contactPhone && (
                  <div className="flex items-center gap-3">
                    <i className="fas fa-phone text-teal-500"></i>
                    <a href={`tel:${wedding.contactPhone}`} className="text-gray-600 hover:text-teal-500 font-serif">
                      {wedding.contactPhone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      {showRsvpForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold font-elegant text-red-600">
                  RSVP for {wedding.brideName} & {wedding.groomName}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowRsvpForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRsvp} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName" className="font-wedding">Full Name *</Label>
                    <Input
                      id="guestName"
                      value={rsvpForm.guestName}
                      onChange={(e) => setRsvpForm({...rsvpForm, guestName: e.target.value})}
                      required
                      className="font-serif"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail" className="font-wedding">Email *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={rsvpForm.guestEmail}
                      onChange={(e) => setRsvpForm({...rsvpForm, guestEmail: e.target.value})}
                      required
                      className="font-serif"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestPhone" className="font-wedding">Phone Number</Label>
                    <Input
                      id="guestPhone"
                      type="tel"
                      value={rsvpForm.guestPhone}
                      onChange={(e) => setRsvpForm({...rsvpForm, guestPhone: e.target.value})}
                      className="font-serif"
                    />
                  </div>
                  <div>
                    <Label htmlFor="numberOfGuests" className="font-wedding">Number of Guests</Label>
                    <Input
                      id="numberOfGuests"
                      type="number"
                      min="1"
                      max="10"
                      value={rsvpForm.numberOfGuests}
                      onChange={(e) => setRsvpForm({...rsvpForm, numberOfGuests: parseInt(e.target.value)})}
                      className="font-serif"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="font-wedding">Attendance</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="attendingCeremony"
                      checked={rsvpForm.attendingCeremony}
                      onCheckedChange={(checked) => 
                        setRsvpForm({...rsvpForm, attendingCeremony: checked as boolean})
                      }
                    />
                    <Label htmlFor="attendingCeremony" className="font-serif">I will attend the wedding ceremony</Label>
                  </div>
                  
                  {wedding.receptionTime && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="attendingReception"
                        checked={rsvpForm.attendingReception}
                        onCheckedChange={(checked) => 
                          setRsvpForm({...rsvpForm, attendingReception: checked as boolean})
                        }
                      />
                      <Label htmlFor="attendingReception" className="font-serif">I will attend the reception</Label>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="dietaryRestrictions" className="font-wedding">Dietary Restrictions</Label>
                  <Input
                    id="dietaryRestrictions"
                    value={rsvpForm.dietaryRestrictions}
                    onChange={(e) => setRsvpForm({...rsvpForm, dietaryRestrictions: e.target.value})}
                    placeholder="Any allergies or dietary requirements"
                    className="font-serif"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="font-wedding">Message for the Couple</Label>
                  <Textarea
                    id="message"
                    value={rsvpForm.message}
                    onChange={(e) => setRsvpForm({...rsvpForm, message: e.target.value})}
                    placeholder="Send your best wishes to the happy couple"
                    rows={3}
                    className="font-serif"
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={createRsvpMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-wedding"
                  >
                    {createRsvpMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-heart mr-2"></i>
                        Submit RSVP
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowRsvpForm(false)}
                    className="flex-1 font-wedding"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}