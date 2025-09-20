import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Clock, MapPin } from "lucide-react";
import { convertTo12HourFormat } from "@/lib/timeUtils";

interface RSVPHeaderProps {
  brideName: string;
  groomName: string;
  weddingDate: Date;
  ceremonyTime?: string;
  venue?: string;
  isRsvpOpen: boolean;
  // Removed analytics props as they should be hidden from guests
  onRsvpClick: () => void;
  ceremonyDetails?: string; // Added ceremonyDetails prop
  // Added separate venue props
  ceremonyVenue?: string;
  ceremonyVenueAddress?: string;
  receptionVenue?: string;
  receptionVenueAddress?: string;
}

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
const getCeremonyName = (ceremonyDetails?: string, ceremonyType?: string, ceremony?: string) => {
  return ceremonyDetails || ceremonyType || ceremony || 'Wedding Ceremony';
};

export function RSVPHeader({
  brideName,
  groomName,
  weddingDate,
  ceremonyTime,
  venue,
  isRsvpOpen,
  onRsvpClick,
  ceremonyDetails,
  ceremonyVenue,
  ceremonyVenueAddress,
  receptionVenue,
  receptionVenueAddress
}: RSVPHeaderProps) {
  // Removed responseRate calculation as analytics should be hidden from guests
  
  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-r from-red-50 via-pink-50 to-teal-50">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
        </div>
        <CardTitle className="text-4xl font-bold font-elegant text-red-600 mb-2">
          RSVP for Our Wedding
        </CardTitle>
        <h2 className="text-2xl font-semibold text-gray-800 font-serif">
          {brideName} <span className="text-red-500 font-normal">&</span> {groomName}
        </h2>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Wedding Details with Enhanced Typography and Better Contrast */}
        <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-lg p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm md:text-base">
            
            {/* Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-red-500" />
              <span className="font-serif text-gray-800 font-medium">
                {weddingDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            {ceremonyTime && (
              <div className="flex items-center space-x-2">
                <span className="text-teal-500 text-lg flex-shrink-0">{getCeremonyIcon(ceremonyDetails)}</span>
                <div>
                  <span className="font-elegant text-purple-700 font-medium">
                    {getCeremonyName(ceremonyDetails)} - {convertTo12HourFormat(ceremonyTime)}
                  </span>
                </div>
              </div>
            )}
            
            {/* Ceremony Venue */}
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="font-serif text-gray-800 font-medium">
                {ceremonyVenue || venue}
              </span>
            </div>
          </div>
          
          {/* Reception Info - Second Row */}
          {(receptionVenue || receptionVenueAddress) && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm md:text-base mt-3 pt-3 border-t border-gray-200">
              
              {/* Reception Venue */}
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500 text-lg">🏛️</span>
                <span className="font-serif text-gray-800 font-medium">
                  {receptionVenue || venue}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RSVP Button - Removed analytics section */}
        <div className="text-center">
          {isRsvpOpen ? (
            <Button
              onClick={onRsvpClick}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-all font-elegant"
            >
              <Heart className="w-5 h-5 mr-2 fill-current" />
              ❤️ RSVP Now
            </Button>
          ) : (
            <div className="text-center">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                RSVP Period Closed
              </Badge>
              <p className="text-sm text-gray-500 mt-2 font-serif">
                Thank you for your interest. The RSVP deadline has passed.
              </p>
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="text-center text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200 font-serif">
          <p>
            <span className="font-semibold font-wedding">Need help?</span> Contact us if you have any questions about the wedding or need assistance with your RSVP.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}