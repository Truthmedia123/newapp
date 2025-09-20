import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Heart, Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";
import { convertTo12HourFormat } from "@/lib/timeUtils";

// Function to get ceremony icon based on ceremony type
const getCeremonyIcon = (ceremonyType?: string) => {
  const type = ceremonyType?.toLowerCase() || '';
  if (type.includes('nikah')) return '🕌';
  if (type.includes('church') || type.includes('catholic')) return '⛪';
  if (type.includes('lagna') || type.includes('kazaar') || type.includes('hindu')) return '🕉️';
  if (type.includes('nuptials')) return '💍';
  return '💒'; // default
};

// Function to format date
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

interface WeddingData {
  brideName: string;
  groomName: string;
  weddingDate: string;
  ceremonyDetails: string;
  ceremonyTime: string;
  ceremonyVenue: string;
  ceremonyVenueAddress?: string;
  receptionTime?: string;
  receptionVenue?: string;
  receptionVenueAddress?: string;
  rsvpDeadline?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export default function RSVPGuestPage() {
  const { code } = useParams();
  const [showRSVPForm, setShowRSVPForm] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    attendingCeremony: true,
    attendingReception: true,
    numberOfGuests: 1,
    message: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);


  // Fetch wedding data for the invitation
  const { data: weddingData, isLoading, error } = useQuery<WeddingData>({
    queryKey: ['weddingData', code],
    queryFn: async () => {
      const response = await fetch(`/api/rsvp/invitation/${code}`);
      if (!response.ok) {
        throw new Error('Failed to load wedding details');
      }
      const data = await response.json();
      
      return {
        brideName: data.wedding.bride_name,
        groomName: data.wedding.groom_name,
        weddingDate: data.wedding.wedding_date,
        ceremonyDetails: data.wedding.ceremony_details || 'Wedding Ceremony',
        ceremonyTime: data.wedding.ceremony_time,
        ceremonyVenue: data.wedding.ceremony_venue || data.wedding.venue,
        ceremonyVenueAddress: data.wedding.ceremony_venue_address || data.wedding.venue_address,
        receptionTime: data.wedding.reception_time,
        receptionVenue: data.wedding.reception_venue,
        receptionVenueAddress: data.wedding.reception_venue_address,
        rsvpDeadline: data.wedding.rsvp_deadline,
        contactEmail: data.wedding.contact_email,
        contactPhone: data.wedding.contact_phone,
      };
    },
    enabled: !!code,
  });

  const openRSVPForm = () => {
    setShowRSVPForm(true);
  };

  const closeRSVPForm = () => {
    setShowRSVPForm(false);
    setSubmitSuccess(false);
    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      attendingCeremony: true,
      attendingReception: true,
      numberOfGuests: 1,
      message: ''
    });
  };

  // RSVP submission mutation
  const rsvpMutation = useMutation({
    mutationFn: async (rsvpData: any) => {
      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationCode: code,
          ...rsvpData
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit RSVP');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setSubmitSuccess(true);
    },
    onError: (error: Error) => {
      console.error('RSVP submission error:', error);
      alert(`Failed to submit RSVP: ${error.message}`);
    }
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rsvpMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-rose-600">Loading wedding details...</p>
        </div>
      </div>
    );
  }

  if (error || !weddingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-rose-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Wedding Details</h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the wedding information. Please check the invitation link or contact the couple.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-500 mb-6">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Wedding Invitation
          </h1>
          <p className="text-xl text-gray-600">
            You're invited to celebrate the love of
          </p>
        </div>

        {/* Couple Names */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-script text-rose-600 mb-6">
            {weddingData.brideName}
          </h2>
          <div className="flex items-center justify-center my-4">
            <div className="w-16 h-px bg-rose-200"></div>
            <span className="mx-4 text-2xl text-rose-400">&</span>
            <div className="w-16 h-px bg-rose-200"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-script text-rose-600">
            {weddingData.groomName}
          </h2>
        </div>

        {/* Wedding Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white text-center">
            <h3 className="text-2xl font-bold">Wedding Details</h3>
          </div>
          
          <div className="p-8">
            {/* Date */}
            <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-800">Date</h4>
                <p className="text-gray-600">{formatDate(weddingData.weddingDate)}</p>
              </div>
            </div>
            
            {/* Ceremony */}
            <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center mr-4">
                <span className="text-xl">{getCeremonyIcon(weddingData.ceremonyDetails)}</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-800">Ceremony</h4>
                <p className="text-gray-600">{weddingData.ceremonyDetails}</p>
                <p className="text-gray-600">{convertTo12HourFormat(weddingData.ceremonyTime)}</p>
              </div>
            </div>
            
            {/* Reception */}
            {weddingData.receptionTime && (
              <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mr-4">
                  <span className="text-xl">🥂</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-800">Reception</h4>
                  <p className="text-gray-600">{convertTo12HourFormat(weddingData.receptionTime)}</p>
                  <p className="text-gray-600">{weddingData.receptionVenue || weddingData.ceremonyVenue}</p>
                </div>
              </div>
            )}
            
            {/* Venue */}
            <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-800">Venue</h4>
                <p className="text-gray-600">{weddingData.ceremonyVenue}</p>
                {weddingData.ceremonyVenueAddress && (
                  <p className="text-gray-600">{weddingData.ceremonyVenueAddress}</p>
                )}
              </div>
            </div>
            
            {/* RSVP Deadline */}
            {weddingData.rsvpDeadline && (
              <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 text-green-500 flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-800">RSVP Deadline</h4>
                  <p className="text-gray-600">{formatDate(weddingData.rsvpDeadline)}</p>
                </div>
              </div>
            )}
            
            {/* Contact Info */}
            {(weddingData.contactEmail || weddingData.contactPhone) && (
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-800">Contact Info</h4>
                  {weddingData.contactPhone && (
                    <p className="text-gray-600 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {weddingData.contactPhone}
                    </p>
                  )}
                  {weddingData.contactEmail && (
                    <p className="text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {weddingData.contactEmail}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RSVP Button */}
        <div className="text-center">
          <button
            onClick={openRSVPForm}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
          >
            RSVP Now
          </button>
        </div>
      </div>

      {/* RSVP Form Modal */}
      {showRSVPForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="font-script text-3xl">RSVP for Our Wedding</h2>
                <button 
                  onClick={closeRSVPForm}
                  className="text-white hover:text-rose-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="font-light mt-2">{weddingData.brideName} & {weddingData.groomName}</p>
            </div>
            
            {/* Form Content */}
            <div className="p-8">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="text-green-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">RSVP Submitted Successfully!</h3>
                  <p className="text-gray-600 mb-6">Thank you for your response. We can't wait to celebrate with you!</p>
                  <button
                    onClick={closeRSVPForm}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Guest Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={(e) => handleInputChange("guestName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.guestEmail}
                    onChange={(e) => handleInputChange("guestEmail", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => handleInputChange("guestPhone", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                {/* Attendance */}
                <div>
                  <label className="block text-gray-700 font-medium mb-4">Will you be attending? *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-rose-300 transition-colors">
                      <input 
                        type="radio" 
                        name="attending" 
                        value="yes" 
                        checked={formData.attendingCeremony}
                        onChange={(e) => handleInputChange("attendingCeremony", e.target.value === "yes")}
                        className="mr-3 text-rose-500" 
                      />
                      <div>
                        <div className="font-medium text-green-600">✓ Joyfully Accept</div>
                        <div className="text-sm text-gray-600">Can't wait to celebrate!</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-rose-300 transition-colors">
                      <input 
                        type="radio" 
                        name="attending" 
                        value="no" 
                        checked={!formData.attendingCeremony}
                        onChange={(e) => handleInputChange("attendingCeremony", e.target.value === "yes")}
                        className="mr-3 text-rose-500" 
                      />
                      <div>
                        <div className="font-medium text-red-600">✗ Regretfully Decline</div>
                        <div className="text-sm text-gray-600">Will be there in spirit</div>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Guest Count */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Number of Guests</label>
                  <select 
                    value={formData.numberOfGuests}
                    onChange={(e) => handleInputChange("numberOfGuests", parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
                

                
                {/* Special Message */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Special Message for the Couple</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    placeholder="Share your wishes, memories, or anything you'd like the couple to know..."
                  />
                </div>
                
                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeRSVPForm}
                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={rsvpMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    {rsvpMutation.isPending ? 'Submitting...' : 'Submit RSVP'}
                  </button>
                </div>
              </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}