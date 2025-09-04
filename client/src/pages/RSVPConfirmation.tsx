import React from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, Calendar, MapPin } from 'lucide-react';

export default function RSVPConfirmation() {
  const { code } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-emerald-100" />
            </div>
            <CardTitle className="text-3xl font-bold">RSVP Confirmed!</CardTitle>
            <p className="text-emerald-100 text-lg">Thank you for responding</p>
          </CardHeader>
          
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                We can't wait to celebrate with you!
              </h2>
              
              <p className="text-gray-600 text-lg">
                Your RSVP has been successfully submitted. We'll send you a confirmation email shortly with all the wedding details.
              </p>
              
              <div className="bg-emerald-50 p-6 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">What's Next?</span>
                </div>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>• Check your email for confirmation details</li>
                  <li>• Save the date in your calendar</li>
                  <li>• Share your excitement with the couple!</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                Back to Home
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.print()}
              >
                Print Confirmation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
