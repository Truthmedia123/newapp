import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Clock, MapPin, Users, MessageCircle } from "lucide-react";

interface RSVPHeaderProps {
  brideName: string;
  groomName: string;
  weddingDate: Date;
  ceremonyTime?: string;
  venue?: string;
  isRsvpOpen: boolean;
  totalGuests?: number;
  totalResponses?: number;
  onRsvpClick: () => void;
}

export function RSVPHeader({
  brideName,
  groomName,
  weddingDate,
  ceremonyTime,
  venue,
  isRsvpOpen,
  totalGuests = 0,
  totalResponses = 0,
  onRsvpClick
}: RSVPHeaderProps) {
  const responseRate = totalResponses > 0 ? Math.round((totalResponses / (totalGuests || 1)) * 100) : 0;
  
  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-r from-red-50 via-pink-50 to-teal-50">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
        </div>
        <CardTitle className="text-4xl font-bold wedding-script text-red-600 mb-2">
          RSVP for Our Wedding
        </CardTitle>
        <h2 className="text-2xl font-semibold text-gray-800">
          {brideName} <span className="text-red-500 font-normal">&</span> {groomName}
        </h2>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Wedding Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <Calendar className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Date</p>
              <p className="text-sm text-gray-600">
                {weddingDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          {ceremonyTime && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <Clock className="w-5 h-5 text-teal-500" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Time</p>
                <p className="text-sm text-gray-600">{ceremonyTime}</p>
              </div>
            </div>
          )}
          
          {venue && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Venue</p>
                <p className="text-sm text-gray-600">{venue}</p>
              </div>
            </div>
          )}
        </div>

        {/* RSVP Stats */}
        <div className="flex justify-center gap-6 py-4 bg-white rounded-lg shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-2xl font-bold text-gray-800">{totalResponses}</span>
            </div>
            <p className="text-sm text-gray-600">Responses</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{responseRate}%</span>
            </div>
            <p className="text-sm text-gray-600">Response Rate</p>
          </div>
        </div>

        {/* RSVP Button */}
        <div className="text-center">
          {isRsvpOpen ? (
            <Button
              onClick={onRsvpClick}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-all"
            >
              <Heart className="w-5 h-5 mr-2 fill-current" />
              RSVP Now
            </Button>
          ) : (
            <div className="text-center">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                RSVP Period Closed
              </Badge>
              <p className="text-sm text-gray-500 mt-2">
                Thank you for your interest. The RSVP deadline has passed.
              </p>
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="text-center text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p>
            <span className="font-semibold">Need help?</span> Contact us if you have any questions about the wedding or need assistance with your RSVP.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}