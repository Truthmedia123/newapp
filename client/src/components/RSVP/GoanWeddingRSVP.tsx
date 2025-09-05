import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle,
  Star,
  Flower,
  Crown,
  Sparkles
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

export function GoanWeddingRSVP() {
  const { weddingId } = useParams();
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    attendingCeremony: true,
    attendingReception: true,
    numberOfGuests: 1,
    dietaryRestrictions: '',
    message: '',
    // Goan wedding specific fields
    bringingChildren: false,
    transportationNeeded: false,
    accommodationNeeded: false,
    traditionalAttire: false
  });

  useEffect(() => {
    if (weddingId) {
      loadWeddingData();
    }
  }, [weddingId]);

  const loadWeddingData = () => {
    try {
      // Try to load from localStorage first
      const stored = localStorage.getItem(`wedding_${weddingId}`);
      if (stored) {
        const wedding = JSON.parse(stored);
        setWeddingData(wedding.weddingData);
        setLoading(false);
        return;
      }
      
      // If not found, show error
      setError('Wedding invitation not found. Please check your invitation link.');
      setLoading(false);
    } catch (error) {
      console.error('Error loading wedding data:', error);
      setError('Failed to load wedding details. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weddingData) return;

    setSubmitting(true);
    
    try {
      // Simulate API call - in real implementation, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store response locally
      const response = {
        weddingId,
        ...formData,
        submittedAt: new Date().toISOString()
      };
      
      const existingResponses = JSON.parse(localStorage.getItem('rsvp_responses') || '[]');
      existingResponses.push(response);
      localStorage.setItem('rsvp_responses', JSON.stringify(existingResponses));
      
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <Heart className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Invitation Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-green-500 mb-4">
              <CheckCircle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">RSVP Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for responding, {formData.guestName}! 
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We can't wait to celebrate with you at this beautiful Goan wedding!
            </p>
            <div className="space-y-2">
              <Button onClick={() => window.location.href = '/'} className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No wedding data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header with Goan Wedding Theme */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10"></div>
        <div className="relative z-10 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative Elements */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <Flower className="w-8 h-8 text-pink-400" />
              <Star className="w-6 h-6 text-yellow-400" />
              <Crown className="w-8 h-8 text-purple-400" />
              <Star className="w-6 h-6 text-yellow-400" />
              <Flower className="w-8 h-8 text-pink-400" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {weddingData.brideName} & {weddingData.groomName}
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <p className="text-xl text-gray-600">are getting married!</p>
              <Sparkles className="w-5 h-5 text-pink-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
              <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-3">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">{new Date(weddingData.weddingDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-3">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">{weddingData.venue}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-3">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">{weddingData.ceremonyTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Form */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Heart className="w-6 h-6" />
              RSVP Response
              <Heart className="w-6 h-6" />
            </CardTitle>
            <p className="text-pink-100">
              Please respond by {new Date(weddingData.weddingDate).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-500" />
                  Guest Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName" className="text-gray-700 font-medium">Full Name *</Label>
                    <Input
                      id="guestName"
                      value={formData.guestName}
                      onChange={(e) => handleInputChange('guestName', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail" className="text-gray-700 font-medium">Email *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guestPhone" className="text-gray-700 font-medium">Phone Number</Label>
                  <Input
                    id="guestPhone"
                    value={formData.guestPhone}
                    onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Event Attendance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  Event Attendance
                </h3>
                
                {/* Ceremony */}
                <div className="border rounded-lg p-4 bg-gradient-to-r from-pink-50 to-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">Wedding Ceremony</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(weddingData.weddingDate).toLocaleDateString()} at {weddingData.ceremonyTime}
                      </p>
                      <p className="text-sm text-gray-500">{weddingData.venue}</p>
                    </div>
                    <Badge className="bg-pink-100 text-pink-800">Traditional Goan Ceremony</Badge>
                  </div>
                  
                  <RadioGroup
                    value={formData.attendingCeremony ? 'yes' : 'no'}
                    onValueChange={(value) => handleInputChange('attendingCeremony', value === 'yes')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="ceremony-yes" />
                      <Label htmlFor="ceremony-yes" className="text-green-700 font-medium">Yes, I'll be there! 🙏</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="ceremony-no" />
                      <Label htmlFor="ceremony-no" className="text-red-700">Sorry, I can't make it</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Reception */}
                <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">Wedding Reception</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(weddingData.weddingDate).toLocaleDateString()} at {weddingData.receptionTime}
                      </p>
                      <p className="text-sm text-gray-500">{weddingData.venue}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Goan Feast & Celebration</Badge>
                  </div>
                  
                  <RadioGroup
                    value={formData.attendingReception ? 'yes' : 'no'}
                    onValueChange={(value) => handleInputChange('attendingReception', value === 'yes')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="reception-yes" />
                      <Label htmlFor="reception-yes" className="text-green-700 font-medium">Yes, I'll be there! 🎉</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="reception-no" />
                      <Label htmlFor="reception-no" className="text-red-700">Sorry, I can't make it</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Guest Count */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-500" />
                  Number of Guests
                </h3>
                <div>
                  <Label htmlFor="numberOfGuests" className="text-gray-700 font-medium">How many people will attend?</Label>
                  <select
                    id="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={(e) => handleInputChange('numberOfGuests', parseInt(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Goan Wedding Specific Questions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Flower className="w-5 h-5 text-pink-500" />
                  Goan Wedding Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bringingChildren"
                      checked={formData.bringingChildren}
                      onCheckedChange={(checked) => handleInputChange('bringingChildren', checked)}
                    />
                    <Label htmlFor="bringingChildren" className="text-gray-700">
                      I will be bringing children to the wedding
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="transportationNeeded"
                      checked={formData.transportationNeeded}
                      onCheckedChange={(checked) => handleInputChange('transportationNeeded', checked)}
                    />
                    <Label htmlFor="transportationNeeded" className="text-gray-700">
                      I need transportation assistance
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accommodationNeeded"
                      checked={formData.accommodationNeeded}
                      onCheckedChange={(checked) => handleInputChange('accommodationNeeded', checked)}
                    />
                    <Label htmlFor="accommodationNeeded" className="text-gray-700">
                      I need accommodation assistance
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="traditionalAttire"
                      checked={formData.traditionalAttire}
                      onCheckedChange={(checked) => handleInputChange('traditionalAttire', checked)}
                    />
                    <Label htmlFor="traditionalAttire" className="text-gray-700">
                      I will be wearing traditional Goan attire
                    </Label>
                  </div>
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Dietary Preferences
                </h3>
                <div>
                  <Label htmlFor="dietaryRestrictions" className="text-gray-700 font-medium">
                    Any dietary restrictions or allergies? (Goan cuisine includes seafood, pork, etc.)
                  </Label>
                  <Textarea
                    id="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                    placeholder="Please let us know about any dietary restrictions, allergies, or preferences..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  Message for the Couple
                </h3>
                <div>
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    Leave a message for {weddingData.brideName} & {weddingData.groomName}
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Share your excitement, well wishes, or any other message for the happy couple..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Submit RSVP
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
