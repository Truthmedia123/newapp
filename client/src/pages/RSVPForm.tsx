import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, MapPin, Clock, Heart, CheckCircle, AlertCircle, Users, Mail, Phone, MessageSquare } from "lucide-react";

interface InvitationData {
  invitation: any;
  wedding: any;
  events: any[];
  questions: any[];
}

export default function RSVPForm() {
  const { code } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    attendingCeremony: true,
    attendingReception: true,
    numberOfGuests: 1,
    dietaryRestrictions: "",
    message: "",
    responses: {} as Record<string, any>
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const totalSteps = 4;

  const { data: invitationData, isLoading, error } = useQuery<InvitationData>({
    queryKey: [`/api/rsvp/invitation/${code}`],
    enabled: !!code,
    retry: false,
  });

  useEffect(() => {
    if (invitationData?.invitation) {
      setFormData(prev => ({
        ...prev,
        guestName: invitationData.invitation.guestName || "",
        guestEmail: invitationData.invitation.guestEmail || "",
        numberOfGuests: invitationData.invitation.maxGuests || 1,
      }));
    }
  }, [invitationData]);

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.guestName.trim()) errors.guestName = "Name is required";
      if (!formData.guestEmail.trim()) errors.guestEmail = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
        errors.guestEmail = "Please enter a valid email address";
      }
    }
    
    if (step === 2) {
      if (formData.numberOfGuests < 1) errors.numberOfGuests = "At least 1 guest required";
      if (invitationData?.invitation.maxGuests && formData.numberOfGuests > invitationData.invitation.maxGuests) {
        errors.numberOfGuests = `Maximum ${invitationData.invitation.maxGuests} guests allowed`;
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationData || !validateStep(currentStep)) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationCode: code,
          ...formData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit RSVP');
      }

      setSubmitted(true);
      setShowConfetti(true);
      toast({
        title: "RSVP Submitted Successfully!",
        description: "Thank you for your response. The couple will be notified."
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionResponse = (questionId: string, answer: any) => {
    setFormData(prev => ({
      ...prev,
      responses: { ...prev.responses, [questionId]: answer }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-teal-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-2">Loading invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invitationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-teal-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <div className="text-center text-red-600">
              <p className="mb-4">Invalid or expired invitation link</p>
              <p className="text-sm text-gray-600">
                Please check the link or contact the couple for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-teal-50 flex items-center justify-center relative overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              >
                {['🎉', '💖', '🎊', '💒', '👰', '🤵'][Math.floor(Math.random() * 6)]}
              </div>
            ))}
          </div>
        )}
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/90">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="relative mb-6">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-pulse" />
                <Heart className="h-6 w-6 text-red-500 absolute -top-1 -right-1 animate-ping" />
              </div>
              <h2 className="text-3xl font-bold text-green-600 mb-3 wedding-script">
                RSVP Submitted!
              </h2>
              <p className="text-gray-600 mb-4 text-lg">
                Thank you for your response. We're excited to celebrate with you!
              </p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <p className="text-sm text-green-700 font-medium">
                  ✅ Confirmation email sent to {formData.guestEmail}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Save the date and we'll see you there! 💕
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { invitation, wedding, events, questions } = invitationData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Wedding Header */}
        <Card className="mb-8 border-0 shadow-2xl">
          <CardContent className="py-8">
            <div className="text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold wedding-script text-red-600 mb-2">
                {wedding.brideName} & {wedding.groomName}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                You're Invited to Our Wedding!
              </p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(wedding.weddingDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  Ceremony at {wedding.ceremonyTime}
                  {wedding.receptionTime && ` • Reception at ${wedding.receptionTime}`}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {wedding.venue}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events */}
        {events.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Wedding Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border-l-4 border-red-200 pl-4">
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} at {event.startTime}
                      {event.endTime && ` - ${event.endTime}`}
                    </p>
                    <p className="text-sm text-gray-600">{event.venue}</p>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    )}
                    {event.dressCode && (
                      <Badge variant="secondary" className="mt-1">
                        {event.dressCode}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* RSVP Form */}
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <div className="text-center">
              <CardTitle className="text-3xl wedding-script text-red-600 mb-4">
                Please Respond
              </CardTitle>
              <div className="flex justify-center mb-4">
                <Progress value={(currentStep / totalSteps) * 100} className="w-2/3" />
              </div>
              <p className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }} className="space-y-6">
              {/* Step 1: Guest Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h3 className="text-xl font-semibold text-gray-800">Your Information</h3>
                    <p className="text-sm text-gray-600 mt-1">Let us know who's coming</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="guestName" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="guestName"
                        value={formData.guestName}
                        onChange={(e) => handleInputChange("guestName", e.target.value)}
                        className={formErrors.guestName ? "border-red-500" : ""}
                        placeholder="Enter your full name"
                      />
                      {formErrors.guestName && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.guestName}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="guestEmail" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="guestEmail"
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => handleInputChange("guestEmail", e.target.value)}
                        className={formErrors.guestEmail ? "border-red-500" : ""}
                        placeholder="your.email@example.com"
                      />
                      {formErrors.guestEmail && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.guestEmail}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="guestPhone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number (Optional)
                      </Label>
                      <Input
                        id="guestPhone"
                        type="tel"
                        value={formData.guestPhone}
                        onChange={(e) => handleInputChange("guestPhone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Guest Count */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-teal-500 mx-auto mb-2" />
                    <h3 className="text-xl font-semibold text-gray-800">Party Size</h3>
                    <p className="text-sm text-gray-600 mt-1">How many guests will you bring?</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="numberOfGuests" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Number of Guests (Max: {invitation.maxGuests})
                      </Label>
                      <Input
                        id="numberOfGuests"
                        type="number"
                        min="1"
                        max={invitation.maxGuests}
                        value={formData.numberOfGuests}
                        onChange={(e) => handleInputChange("numberOfGuests", parseInt(e.target.value))}
                        className={formErrors.numberOfGuests ? "border-red-500" : ""}
                      />
                      {formErrors.numberOfGuests && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.numberOfGuests}
                        </p>
                      )}
                    </div>
                    
                    {formData.numberOfGuests > 1 && (
                      <Alert>
                        <Users className="h-4 w-4" />
                        <AlertDescription>
                          You're bringing {formData.numberOfGuests} guests total (including yourself).
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}
              
              {/* Step 3: Attendance */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h3 className="text-xl font-semibold text-gray-800">Attendance</h3>
                    <p className="text-sm text-gray-600 mt-1">Which events will you attend?</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-red-100 rounded-lg hover:border-red-200 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="attendingCeremony"
                          checked={formData.attendingCeremony}
                          onCheckedChange={(checked) => 
                            handleInputChange("attendingCeremony", checked as boolean)
                          }
                          className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                        />
                        <div className="flex-1">
                          <Label htmlFor="attendingCeremony" className="text-base font-medium cursor-pointer">
                            Wedding Ceremony
                          </Label>
                          <p className="text-sm text-gray-600">
                            {new Date(wedding.weddingDate).toLocaleDateString()} at {wedding.ceremonyTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {wedding.receptionTime && (
                      <div className="p-4 border-2 border-teal-100 rounded-lg hover:border-teal-200 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="attendingReception"
                            checked={formData.attendingReception}
                            onCheckedChange={(checked) => 
                              handleInputChange("attendingReception", checked as boolean)
                            }
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                          <div className="flex-1">
                            <Label htmlFor="attendingReception" className="text-base font-medium cursor-pointer">
                              Reception
                            </Label>
                            <p className="text-sm text-gray-600">
                              {new Date(wedding.weddingDate).toLocaleDateString()} at {wedding.receptionTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!formData.attendingCeremony && !formData.attendingReception && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          We're sad you can't make it! Your response is still valuable to help with planning.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Additional Information & Final Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="text-xl font-semibold text-gray-800">Additional Details</h3>
                    <p className="text-sm text-gray-600 mt-1">Help us make your experience perfect</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dietaryRestrictions" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Dietary Restrictions or Allergies
                      </Label>
                      <Input
                        id="dietaryRestrictions"
                        value={formData.dietaryRestrictions}
                        onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value)}
                        placeholder="e.g., Vegetarian, Gluten-free, Nut allergy"
                      />
                    </div>

                    {/* Custom Questions */}
                    {questions.map((question) => (
                      <div key={question.id} className="p-4 border rounded-lg">
                        <Label className="font-medium">
                          {question.question}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        
                        {question.type === "text" && (
                          <Input
                            className="mt-2"
                            value={formData.responses[question.id] || ""}
                            onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
                            required={question.required}
                          />
                        )}
                        
                        {question.type === "boolean" && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                              checked={formData.responses[question.id] || false}
                              onCheckedChange={(checked) => handleQuestionResponse(question.id, checked)}
                            />
                            <Label>Yes</Label>
                          </div>
                        )}
                        
                        {question.type === "number" && (
                          <Input
                            className="mt-2"
                            type="number"
                            value={formData.responses[question.id] || ""}
                            onChange={(e) => handleQuestionResponse(question.id, parseInt(e.target.value))}
                            required={question.required}
                          />
                        )}
                      </div>
                    ))}

                    <div>
                      <Label htmlFor="message" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Message for the Couple
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Send your best wishes to the happy couple... ✨"
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                {currentStep > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handlePrevStep}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 ${currentStep === 1 ? 'w-full' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : currentStep === totalSteps ? (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Submit RSVP
                    </>
                  ) : (
                    'Next Step'
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