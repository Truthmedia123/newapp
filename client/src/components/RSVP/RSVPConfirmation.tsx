import React from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Heart, Calendar, MapPin, Clock, Share2, Home } from 'lucide-react';

export function RSVPConfirmation() {
  const { invitationCode } = useParams();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wedding RSVP Confirmation',
          text: 'I just RSVP\'d to the wedding! Can\'t wait to celebrate!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <CardContent className="p-8">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                RSVP Confirmed!
              </h1>
              <p className="text-lg text-gray-600">
                Thank you for responding to our wedding invitation
              </p>
            </div>

            {/* Wedding Details */}
            <div className="bg-white rounded-lg p-6 mb-6 border">
              <div className="mb-4">
                <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Sarah & Michael
                </h2>
                <p className="text-gray-600">are getting married!</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>June 15, 2024</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Grand Palace Hotel</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>4:00 PM</span>
                </div>
              </div>
            </div>

            {/* Confirmation Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Attending Ceremony
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Attending Reception
                </Badge>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600">
                  <strong>2 Guests</strong> confirmed
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  We can't wait to celebrate with you!
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• Save the date in your calendar</li>
                <li>• Check back for updates and details</li>
                <li>• Contact us if you have any questions</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share the News
              </Button>
              <Button onClick={() => window.location.href = '/'} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need to make changes? Contact us at{' '}
                <a href="mailto:rsvp@example.com" className="text-emerald-600 hover:underline">
                  rsvp@example.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
