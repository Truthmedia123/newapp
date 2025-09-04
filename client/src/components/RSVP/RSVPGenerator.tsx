import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Mail, Link, QrCode, Plus, Trash2, Edit } from 'lucide-react';
import { generateInvitationCode, generateQRCode, generateWeddingSlug } from '@/utils/rsvpUtils';

interface RSVPGeneratorProps {
  weddingId?: string;
}

interface WeddingEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  dressCode: string;
  isPrivate: boolean;
  maxGuests: number;
}

interface RSVPQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'boolean' | 'number';
  options: string[];
  required: boolean;
  eventSpecific: string | null;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  maxGuests: number;
  allowPlusOne: boolean;
  invitedEvents: string[];
  isFamily: boolean;
}

export function RSVPGenerator({ weddingId }: RSVPGeneratorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [weddingData, setWeddingData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    events: [] as WeddingEvent[],
    questions: [] as RSVPQuestion[],
    guests: [] as Guest[]
  });

  // Step 1: Basic Wedding Info
  const BasicInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Wedding Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brideName">Bride's Name</Label>
            <Input
              id="brideName"
              value={weddingData.brideName}
              onChange={(e) => setWeddingData({...weddingData, brideName: e.target.value})}
              placeholder="Enter bride's name"
            />
          </div>
          <div>
            <Label htmlFor="groomName">Groom's Name</Label>
            <Input
              id="groomName"
              value={weddingData.groomName}
              onChange={(e) => setWeddingData({...weddingData, groomName: e.target.value})}
              placeholder="Enter groom's name"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="weddingDate">Main Wedding Date</Label>
          <Input
            id="weddingDate"
            type="date"
            value={weddingData.weddingDate}
            onChange={(e) => setWeddingData({...weddingData, weddingDate: e.target.value})}
          />
        </div>
      </CardContent>
    </Card>
  );

  // Step 2: Event Builder
  const EventBuilderStep = () => {
    const [newEvent, setNewEvent] = useState<Partial<WeddingEvent>>({
      name: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      address: '',
      dressCode: '',
      isPrivate: false,
      maxGuests: 100
    });

    const addEvent = () => {
      if (newEvent.name && newEvent.date && newEvent.startTime && newEvent.venue) {
        const event: WeddingEvent = {
          id: Math.random().toString(36).substring(2, 9),
          name: newEvent.name,
          description: newEvent.description || '',
          date: newEvent.date,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime || '',
          venue: newEvent.venue,
          address: newEvent.address || '',
          dressCode: newEvent.dressCode || '',
          isPrivate: newEvent.isPrivate || false,
          maxGuests: newEvent.maxGuests || 100
        };
        
        setWeddingData({
          ...weddingData,
          events: [...weddingData.events, event]
        });
        
        setNewEvent({
          name: '',
          description: '',
          date: '',
          startTime: '',
          endTime: '',
          venue: '',
          address: '',
          dressCode: '',
          isPrivate: false,
          maxGuests: 100
        });
      }
    };

    const deleteEvent = (eventId: string) => {
      setWeddingData({
        ...weddingData,
        events: weddingData.events.filter(e => e.id !== eventId)
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Wedding Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Creation Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={newEvent.name}
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                placeholder="e.g., Ceremony, Reception"
              />
            </div>
            <div>
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={newEvent.venue}
                onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                placeholder="Venue name"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newEvent.address}
                onChange={(e) => setNewEvent({...newEvent, address: e.target.value})}
                placeholder="Full address"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Event description"
              />
            </div>
            <div>
              <Label htmlFor="dressCode">Dress Code</Label>
              <Input
                id="dressCode"
                value={newEvent.dressCode}
                onChange={(e) => setNewEvent({...newEvent, dressCode: e.target.value})}
                placeholder="e.g., Formal, Casual"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPrivate"
                checked={newEvent.isPrivate}
                onCheckedChange={(checked) => setNewEvent({...newEvent, isPrivate: checked})}
              />
              <Label htmlFor="isPrivate">Private Event</Label>
            </div>
            <div className="md:col-span-2">
              <Button onClick={addEvent} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {weddingData.events.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-emerald-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{event.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 3: Custom Questions
  const QuestionsStep = () => {
    const [newQuestion, setNewQuestion] = useState<Partial<RSVPQuestion>>({
      question: '',
      type: 'text',
      options: [],
      required: false,
      eventSpecific: null
    });

    const addQuestion = () => {
      if (newQuestion.question) {
        const question: RSVPQuestion = {
          id: Math.random().toString(36).substring(2, 9),
          question: newQuestion.question,
          type: newQuestion.type as any,
          options: newQuestion.options || [],
          required: newQuestion.required || false,
          eventSpecific: newQuestion.eventSpecific
        };
        
        setWeddingData({
          ...weddingData,
          questions: [...weddingData.questions, question]
        });
        
        setNewQuestion({
          question: '',
          type: 'text',
          options: [],
          required: false,
          eventSpecific: null
        });
      }
    };

    const deleteQuestion = (questionId: string) => {
      setWeddingData({
        ...weddingData,
        questions: weddingData.questions.filter(q => q.id !== questionId)
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>RSVP Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Creation Form */}
          <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                placeholder="e.g., Do you have any dietary restrictions?"
              />
            </div>
            <div>
              <Label htmlFor="questionType">Question Type</Label>
              <Select
                value={newQuestion.type}
                onValueChange={(value) => setNewQuestion({...newQuestion, type: value as any})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Input</SelectItem>
                  <SelectItem value="select">Single Choice</SelectItem>
                  <SelectItem value="multiselect">Multiple Choice</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={newQuestion.required}
                onCheckedChange={(checked) => setNewQuestion({...newQuestion, required: checked})}
              />
              <Label htmlFor="required">Required Question</Label>
            </div>
            <Button onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {weddingData.questions.map((question) => (
              <Card key={question.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{question.question}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{question.type}</Badge>
                        {question.required && <Badge variant="destructive">Required</Badge>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 4: Guest List Management
  const GuestListStep = () => {
    const [newGuest, setNewGuest] = useState<Partial<Guest>>({
      name: '',
      email: '',
      maxGuests: 1,
      allowPlusOne: false,
      invitedEvents: [],
      isFamily: false
    });

    const addGuest = () => {
      if (newGuest.name && newGuest.email) {
        const guest: Guest = {
          id: Math.random().toString(36).substring(2, 9),
          name: newGuest.name,
          email: newGuest.email,
          maxGuests: newGuest.maxGuests || 1,
          allowPlusOne: newGuest.allowPlusOne || false,
          invitedEvents: newGuest.invitedEvents || [],
          isFamily: newGuest.isFamily || false
        };
        
        setWeddingData({
          ...weddingData,
          guests: [...weddingData.guests, guest]
        });
        
        setNewGuest({
          name: '',
          email: '',
          maxGuests: 1,
          allowPlusOne: false,
          invitedEvents: [],
          isFamily: false
        });
      }
    };

    const deleteGuest = (guestId: string) => {
      setWeddingData({
        ...weddingData,
        guests: weddingData.guests.filter(g => g.id !== guestId)
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Guest List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Guest Creation Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor="guestName">Guest Name</Label>
              <Input
                id="guestName"
                value={newGuest.name}
                onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label htmlFor="guestEmail">Email</Label>
              <Input
                id="guestEmail"
                type="email"
                value={newGuest.email}
                onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="maxGuests">Max Guests</Label>
              <Input
                id="maxGuests"
                type="number"
                min="1"
                value={newGuest.maxGuests}
                onChange={(e) => setNewGuest({...newGuest, maxGuests: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allowPlusOne"
                checked={newGuest.allowPlusOne}
                onCheckedChange={(checked) => setNewGuest({...newGuest, allowPlusOne: checked})}
              />
              <Label htmlFor="allowPlusOne">Allow Plus One</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isFamily"
                checked={newGuest.isFamily}
                onCheckedChange={(checked) => setNewGuest({...newGuest, isFamily: checked})}
              />
              <Label htmlFor="isFamily">Family Member</Label>
            </div>
            <div className="md:col-span-2">
              <Button onClick={addGuest} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Guest
              </Button>
            </div>
          </div>

          {/* Guests List */}
          <div className="space-y-4">
            {weddingData.guests.map((guest) => (
              <Card key={guest.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{guest.name}</h3>
                      <p className="text-sm text-gray-600">{guest.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{guest.maxGuests} guest{guest.maxGuests > 1 ? 's' : ''}</Badge>
                        {guest.allowPlusOne && <Badge variant="outline">Plus One</Badge>}
                        {guest.isFamily && <Badge variant="default">Family</Badge>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGuest(guest.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 5: Preview & Generate
  const PreviewStep = () => {
    const generateRSVPLinks = () => {
      // Generate invitation codes for all guests
      const invitations = weddingData.guests.map(guest => ({
        ...guest,
        invitationCode: generateInvitationCode(),
        qrCode: generateQRCode(generateInvitationCode())
      }));
      
      console.log('Generated invitations:', invitations);
      // Here you would typically save to database and send emails
    };

    const generateQRCodes = () => {
      // Generate QR codes for all invitations
      console.log('Generating QR codes...');
    };

    const sendInvitations = () => {
      // Send email invitations
      console.log('Sending invitations...');
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>RSVP Preview & Generate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wedding Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              {weddingData.brideName} & {weddingData.groomName}
            </h3>
            <p className="text-gray-600 mb-4">
              {new Date(weddingData.weddingDate).toLocaleDateString()}
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{weddingData.events.length}</div>
                <div className="text-sm text-gray-600">Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{weddingData.questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{weddingData.guests.length}</div>
                <div className="text-sm text-gray-600">Guests</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={generateRSVPLinks} className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Generate RSVP Links
            </Button>
            <Button onClick={generateQRCodes} variant="outline" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Generate QR Codes
            </Button>
            <Button onClick={sendInvitations} variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Invitations
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">RSVP Generator</h1>
        <p className="text-gray-600">Create beautiful, customized RSVP forms for your wedding</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className={`flex items-center ${step < 5 ? 'flex-1' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${currentStep >= step ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step}
            </div>
            {step < 5 && <div className={`flex-1 h-0.5 mx-4 ${currentStep > step ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && <BasicInfoStep />}
      {currentStep === 2 && <EventBuilderStep />}
      {currentStep === 3 && <QuestionsStep />}
      {currentStep === 4 && <GuestListStep />}
      {currentStep === 5 && <PreviewStep />}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button 
          onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
          disabled={currentStep === 5}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
