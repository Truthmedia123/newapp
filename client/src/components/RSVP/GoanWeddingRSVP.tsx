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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-rose-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-pink-200/25 rounded-full blur-xl"></div>
      </div>

      {/* Header with Stunning Goan Wedding Theme */}
      <div className="relative z-10">
        {/* Top Decorative Border */}
        <div className="h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400"></div>
        
        <div className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Main Header Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
              {/* Header Gradient */}
              <div className="h-3 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"></div>
              
              <div className="p-8 md:p-12">
                {/* Decorative Elements */}
                <div className="flex justify-center items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Flower className="w-10 h-10 text-pink-400 animate-pulse" />
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1"></div>
                  <Crown className="w-12 h-12 text-purple-400 animate-bounce" />
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-1"></div>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <Flower className="w-10 h-10 text-pink-400 animate-pulse" />
                  </div>
                </div>
                
                {/* Couple Names */}
                <div className="text-center mb-8">
                  <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    {weddingData.brideName} & {weddingData.groomName}
                  </h1>
                  
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
                    <p className="text-2xl text-gray-700 font-medium">are getting married!</p>
                    <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
                  </div>
                  
                  <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-6 py-2">
                    <p className="text-lg text-gray-600 font-medium">Join us for our Goan Wedding Celebration</p>
                  </div>
                </div>
                
                {/* Wedding Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Wedding Date</h3>
                    </div>
                    <p className="text-xl font-bold text-pink-600">{new Date(weddingData.weddingDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Venue</h3>
                    </div>
                    <p className="text-lg font-bold text-purple-600">{weddingData.venue}</p>
                    <p className="text-sm text-gray-600 mt-1">{weddingData.venueAddress}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Ceremony Time</h3>
                    </div>
                    <p className="text-xl font-bold text-emerald-600">{weddingData.ceremonyTime}</p>
                    <p className="text-sm text-gray-600 mt-1">Reception at {weddingData.receptionTime}</p>
                  </div>
                </div>
                
                {/* Special Message */}
                {weddingData.message && (
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200 text-center">
                    <p className="text-lg text-gray-700 italic leading-relaxed">"{weddingData.message}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Form */}
      <div className="max-w-4xl mx-auto px-4 pb-16 relative z-10">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Heart className="w-8 h-8 text-white animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">RSVP Response</h2>
                <Heart className="w-8 h-8 text-white animate-pulse" />
              </div>
              <p className="text-pink-100 text-lg">
                Please respond by {new Date(weddingData.weddingDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <p className="text-white font-medium">We can't wait to celebrate with you! 🎉</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Guest Information */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Guest Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="guestName" className="text-gray-700 font-semibold text-lg">Full Name *</Label>
                    <Input
                      id="guestName"
                      value={formData.guestName}
                      onChange={(e) => handleInputChange('guestName', e.target.value)}
                      required
                      className="mt-2 h-12 text-lg border-2 border-pink-200 focus:border-pink-500 rounded-xl"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail" className="text-gray-700 font-semibold text-lg">Email *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                      required
                      className="mt-2 h-12 text-lg border-2 border-pink-200 focus:border-pink-500 rounded-xl"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="guestPhone" className="text-gray-700 font-semibold text-lg">Phone Number</Label>
                  <Input
                    id="guestPhone"
                    value={formData.guestPhone}
                    onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-2 h-12 text-lg border-2 border-pink-200 focus:border-pink-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Event Attendance */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  Event Attendance
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ceremony */}
                  <div className="bg-white rounded-2xl p-6 border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 shadow-lg">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl text-gray-800">Wedding Ceremony</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(weddingData.weddingDate).toLocaleDateString()} at {weddingData.ceremonyTime}
                      </p>
                      <p className="text-xs text-gray-500">{weddingData.venue}</p>
                    </div>
                    
                    <Badge className="w-full justify-center bg-pink-100 text-pink-800 text-sm py-2 mb-4">Traditional Goan Ceremony</Badge>
                    
                    <RadioGroup
                      value={formData.attendingCeremony ? 'yes' : 'no'}
                      onValueChange={(value) => handleInputChange('attendingCeremony', value === 'yes')}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-green-50 border border-green-200">
                        <RadioGroupItem value="yes" id="ceremony-yes" className="text-green-600" />
                        <Label htmlFor="ceremony-yes" className="text-green-700 font-semibold text-lg cursor-pointer">Yes, I'll be there! 🙏</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-red-50 border border-red-200">
                        <RadioGroupItem value="no" id="ceremony-no" className="text-red-600" />
                        <Label htmlFor="ceremony-no" className="text-red-700 font-semibold text-lg cursor-pointer">Sorry, I can't make it</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Reception */}
                  <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-lg">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl text-gray-800">Wedding Reception</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(weddingData.weddingDate).toLocaleDateString()} at {weddingData.receptionTime}
                      </p>
                      <p className="text-xs text-gray-500">{weddingData.venue}</p>
                    </div>
                    
                    <Badge className="w-full justify-center bg-purple-100 text-purple-800 text-sm py-2 mb-4">Goan Feast & Celebration</Badge>
                    
                    <RadioGroup
                      value={formData.attendingReception ? 'yes' : 'no'}
                      onValueChange={(value) => handleInputChange('attendingReception', value === 'yes')}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-green-50 border border-green-200">
                        <RadioGroupItem value="yes" id="reception-yes" className="text-green-600" />
                        <Label htmlFor="reception-yes" className="text-green-700 font-semibold text-lg cursor-pointer">Yes, I'll be there! 🎉</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-red-50 border border-red-200">
                        <RadioGroupItem value="no" id="reception-no" className="text-red-600" />
                        <Label htmlFor="reception-no" className="text-red-700 font-semibold text-lg cursor-pointer">Sorry, I can't make it</Label>
                      </div>
                    </RadioGroup>
                  </div>
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
              <div className="pt-8">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:via-purple-600 hover:to-pink-600 text-white py-4 text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Submitting your RSVP...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 animate-pulse" />
                      <span>Submit RSVP Response</span>
                      <Heart className="w-6 h-6 animate-pulse" />
                    </div>
                  )}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-gray-600 text-sm">
                    💕 Thank you for being part of our special day! 💕
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
