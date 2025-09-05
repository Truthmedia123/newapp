import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, MapPin, Clock, Users, CheckCircle } from 'lucide-react';

interface InvitationData {
  invitation: {
    id: number;
    guestName: string;
    guestEmail: string;
    invitationCode: string;
    maxGuests: number;
    allowPlusOne: boolean;
    status: string;
  };
  wedding: {
    id: number;
    brideName: string;
    groomName: string;
    weddingDate: string;
    venue: string;
    venueAddress: string;
    ceremonyTime: string;
    receptionTime?: string;
  };
  events: Array<{
    id: number;
    name: string;
    description?: string;
    date: string;
    startTime: string;
    endTime?: string;
    venue: string;
    address: string;
  }>;
  questions: Array<{
    id: number;
    question: string;
    type: string;
    options?: string;
    required: boolean;
  }>;
}

export function RSVPForm() {
  const { invitationCode } = useParams();
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
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
    responses: {} as Record<string, string>
  });

  useEffect(() => {
    if (invitationCode) {
      fetchInvitation();
    }
  }, [invitationCode]);

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/rsvp/invitation/${invitationCode}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Invitation not found. Please check your invitation link.');
        } else {
          setError('Failed to load invitation. Please try again.');
        }
        return;
      }

      const data = await response.json();
      setInvitationData(data);
      
      // Pre-fill form with invitation data
      setFormData(prev => ({
        ...prev,
        guestName: data.invitation.guestName,
        guestEmail: data.invitation.guestEmail,
        numberOfGuests: data.invitation.maxGuests
      }));
      
    } catch (error) {
      console.error('Error fetching invitation:', error);
      setError('Failed to load invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionResponse = (questionId: number, answer: string) => {
    setFormData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: answer
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationData) return;

    setSubmitting(true);
    
    try {
      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationCode,
          ...formData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit RSVP');
      }

      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit RSVP');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-green-500 mb-4">
              <CheckCircle className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">RSVP Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for responding, {formData.guestName}! 
              We can't wait to celebrate with you.
            </p>
            <div className="text-sm text-gray-500">
              You will receive a confirmation email shortly.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No invitation data available</p>
      </div>
    );
  }

  const { invitation, wedding, events, questions } = invitationData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Wedding Header */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Heart className="w-12 h-12 text-pink-500 mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-gray-800">
                {wedding.brideName} & {wedding.groomName}
              </h1>
              <p className="text-lg text-gray-600 mt-2">are getting married!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{new Date(wedding.weddingDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{wedding.venue}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{wedding.ceremonyTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RSVP Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <Users className="w-6 h-6 inline mr-2" />
              RSVP Response
            </CardTitle>
            <p className="text-center text-gray-600">
              Please respond by {new Date(wedding.weddingDate).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Guest Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName">Full Name</Label>
                    <Input
                      id="guestName"
                      value={formData.guestName}
                      onChange={(e) => handleInputChange('guestName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guestPhone">Phone Number (Optional)</Label>
                  <Input
                    id="guestPhone"
                    value={formData.guestPhone}
                    onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                  />
                </div>
              </div>

              {/* Event Attendance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Event Attendance</h3>
                
                {events.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{event.name}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()} at {event.startTime}
                        </p>
                        <p className="text-sm text-gray-500">{event.venue}</p>
                      </div>
                      <Badge variant="outline">
                        {event.name.toLowerCase().includes('ceremony') ? 'Ceremony' : 'Reception'}
                      </Badge>
                    </div>
                    
                    <RadioGroup
                      value={event.name.toLowerCase().includes('ceremony') 
                        ? (formData.attendingCeremony ? 'yes' : 'no')
                        : (formData.attendingReception ? 'yes' : 'no')
                      }
                      onValueChange={(value) => {
                        if (event.name.toLowerCase().includes('ceremony')) {
                          handleInputChange('attendingCeremony', value === 'yes');
                        } else {
                          handleInputChange('attendingReception', value === 'yes');
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`${event.id}-yes`} />
                        <Label htmlFor={`${event.id}-yes`}>Yes, I'll be there!</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${event.id}-no`} />
                        <Label htmlFor={`${event.id}-no`}>Sorry, I can't make it</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>

              {/* Guest Count */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Number of Guests</h3>
                <div>
                  <Label htmlFor="numberOfGuests">How many people will attend?</Label>
                  <Select
                    value={formData.numberOfGuests.toString()}
                    onValueChange={(value) => handleInputChange('numberOfGuests', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: invitation.maxGuests }, (_, i) => i + 1).map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom Questions */}
              {questions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  
                  {questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label htmlFor={`question-${question.id}`}>
                        {question.question}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      
                      {question.type === 'text' && (
                        <Input
                          id={`question-${question.id}`}
                          value={formData.responses[question.id] || ''}
                          onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
                          required={question.required}
                        />
                      )}
                      
                      {question.type === 'textarea' && (
                        <Textarea
                          id={`question-${question.id}`}
                          value={formData.responses[question.id] || ''}
                          onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
                          required={question.required}
                          rows={3}
                        />
                      )}
                      
                      {question.type === 'select' && question.options && (
                        <Select
                          value={formData.responses[question.id] || ''}
                          onValueChange={(value) => handleQuestionResponse(question.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {JSON.parse(question.options).map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Dietary Restrictions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dietary Restrictions</h3>
                <div>
                  <Label htmlFor="dietaryRestrictions">Any dietary restrictions or allergies?</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                    placeholder="Please let us know about any dietary restrictions or allergies..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Message for the Couple</h3>
                <div>
                  <Label htmlFor="message">Leave a message for {wedding.brideName} & {wedding.groomName}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Share your excitement, well wishes, or any other message..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit RSVP'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}