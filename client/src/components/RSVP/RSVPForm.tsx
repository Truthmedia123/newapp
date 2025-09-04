import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Heart, CheckCircle } from 'lucide-react';
import { formatWeddingDate, getTimeUntilWedding } from '@/utils/rsvpUtils';

interface RSVPFormProps {
  invitationCode?: string;
}

interface Invitation {
  id: number;
  weddingId: number;
  guestName: string;
  guestEmail: string;
  invitationCode: string;
  maxGuests: number;
  allowPlusOne: boolean;
  invitedEvents: string[];
  isFamily: boolean;
  status: string;
  wedding: {
    brideName: string;
    groomName: string;
    weddingDate: string;
    venue: string;
    venueAddress: string;
    ceremonyTime: string;
    receptionTime?: string;
  };
  events: Array<{
    id: string;
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    address: string;
    dressCode: string;
  }>;
  questions: Array<{
    id: string;
    question: string;
    type: 'text' | 'select' | 'multiselect' | 'boolean' | 'number';
    options: string[];
    required: boolean;
    eventSpecific: string | null;
  }>;
}

interface Guest {
  name: string;
  attending: boolean;
  dietaryRestrictions?: string;
}

export function RSVPForm({ invitationCode: propInvitationCode }: RSVPFormProps) {
  const { invitationCode: paramInvitationCode } = useParams();
  const invitationCode = propInvitationCode || paramInvitationCode;
  
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [guests, setGuests] = useState<Guest[]>([{ name: '', attending: false }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (invitationCode) {
      fetchInvitation();
    }
  }, [invitationCode]);

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/rsvp/invitation/${invitationCode}`);
      if (response.ok) {
        const data = await response.json();
        setInvitation(data);
        initializeGuests(data);
      } else {
        console.error('Failed to fetch invitation');
      }
    } catch (error) {
      console.error('Failed to fetch invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeGuests = (invitation: Invitation) => {
    const initialGuests: Guest[] = [];
    for (let i = 0; i < invitation.maxGuests; i++) {
      initialGuests.push({
        name: i === 0 ? invitation.guestName : '',
        attending: i === 0
      });
    }
    setGuests(initialGuests);
  };

  const updateGuest = (index: number, field: keyof Guest, value: any) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setGuests(updatedGuests);
  };

  const addGuest = () => {
    if (invitation && guests.length < invitation.maxGuests) {
      setGuests([...guests, { name: '', attending: false }]);
    }
  };

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      const updatedGuests = guests.filter((_, i) => i !== index);
      setGuests(updatedGuests);
    }
  };

  const submitRSVP = async () => {
    if (!invitation) return;
    
    setSubmitting(true);
    try {
      const rsvpData = {
        invitationCode,
        weddingId: invitation.weddingId,
        guests: guests.filter(g => g.name.trim()),
        responses,
        eventResponses: {}
      };

      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData)
      });

      if (response.ok) {
        setSubmitted(true);
        // Redirect to confirmation page after a delay
        setTimeout(() => {
          window.location.href = `/rsvp/confirmation/${invitationCode}`;
        }, 2000);
      } else {
        console.error('Failed to submit RSVP');
      }
    } catch (error) {
      console.error('Failed to submit RSVP:', error);
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

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Invitation Not Found</h1>
          <p className="text-gray-600">The invitation you're looking for doesn't exist or has expired.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">RSVP Submitted!</h1>
          <p className="text-gray-600">Thank you for responding. We can't wait to celebrate with you!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">
              {invitation.wedding.brideName} & {invitation.wedding.groomName}
            </CardTitle>
            <p className="text-emerald-100 text-lg">Wedding Celebration</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatWeddingDate(invitation.wedding.weddingDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{invitation.wedding.venue}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {/* Guest Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guest Information
              </h3>
              <div className="space-y-4">
                {guests.map((guest, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Guest {index + 1}</h4>
                      {guests.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGuest(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`guest-${index}-name`}>Full Name</Label>
                        <Input
                          id={`guest-${index}-name`}
                          value={guest.name}
                          onChange={(e) => updateGuest(index, 'name', e.target.value)}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`guest-${index}-attending`}
                          checked={guest.attending}
                          onCheckedChange={(checked) => updateGuest(index, 'attending', checked)}
                        />
                        <Label htmlFor={`guest-${index}-attending`}>Will attend</Label>
                      </div>
                    </div>
                    
                    {guest.attending && (
                      <div className="mt-4">
                        <Label htmlFor={`guest-${index}-dietary`}>Dietary Restrictions</Label>
                        <Input
                          id={`guest-${index}-dietary`}
                          value={guest.dietaryRestrictions || ''}
                          onChange={(e) => updateGuest(index, 'dietaryRestrictions', e.target.value)}
                          placeholder="Any allergies or dietary requirements"
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                {invitation && guests.length < invitation.maxGuests && (
                  <Button onClick={addGuest} variant="outline" className="w-full">
                    Add Another Guest
                  </Button>
                )}
              </div>
            </div>

            {/* Event Responses */}
            {invitation.events.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Attendance
                </h3>
                <div className="space-y-4">
                  {invitation.events.map((event) => (
                    <Card key={event.id} className="border-l-4 border-l-emerald-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{event.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {event.startTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.venue}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <RadioGroup
                          value={responses[`event-${event.id}`] || 'yes'}
                          onValueChange={(value) => setResponses({...responses, [`event-${event.id}`]: value})}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id={`event-${event.id}-yes`} />
                            <Label htmlFor={`event-${event.id}-yes`}>Yes, I'll attend</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id={`event-${event.id}-no`} />
                            <Label htmlFor={`event-${event.id}-no`}>No, I can't attend</Label>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Questions */}
            {invitation.questions.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                <div className="space-y-4">
                  {invitation.questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label htmlFor={`question-${question.id}`}>
                        {question.question}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      
                      {question.type === 'text' && (
                        <Input
                          id={`question-${question.id}`}
                          value={responses[question.id] || ''}
                          onChange={(e) => setResponses({...responses, [question.id]: e.target.value})}
                          required={question.required}
                        />
                      )}
                      
                      {question.type === 'boolean' && (
                        <RadioGroup
                          value={responses[question.id] || ''}
                          onValueChange={(value) => setResponses({...responses, [question.id]: value})}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id={`question-${question.id}-yes`} />
                            <Label htmlFor={`question-${question.id}-yes`}>Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id={`question-${question.id}-no`} />
                            <Label htmlFor={`question-${question.id}-no`}>No</Label>
                          </div>
                        </RadioGroup>
                      )}
                      
                      {question.type === 'select' && (
                        <Select
                          value={responses[question.id] || ''}
                          onValueChange={(value) => setResponses({...responses, [question.id]: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {question.type === 'number' && (
                        <Input
                          id={`question-${question.id}`}
                          type="number"
                          value={responses[question.id] || ''}
                          onChange={(e) => setResponses({...responses, [question.id]: e.target.value})}
                          required={question.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              onClick={submitRSVP} 
              disabled={submitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 text-lg"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5 mr-2" />
                  Submit RSVP
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
