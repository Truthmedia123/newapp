import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateInvitationCode, generateQRCode } from '@/utils/rsvpUtils';
import { Copy, QrCode, Link, Check } from 'lucide-react';

interface GeneratedInvitation {
  guestName: string;
  guestEmail: string;
  invitationCode: string;
  rsvpLink: string;
  qrCodeUrl: string;
}

export function SimpleRSVPGenerator() {
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    venue: '',
    message: '',
    guestName: '',
    guestEmail: ''
  });

  const [generatedInvitations, setGeneratedInvitations] = useState<GeneratedInvitation[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateInvitation = async () => {
    if (!formData.guestName || !formData.guestEmail) {
      alert('Please enter guest name and email');
      return;
    }

    setIsGenerating(true);
    
    try {
      const invitationCode = generateInvitationCode();
      const rsvpLink = `${window.location.origin}/rsvp/${invitationCode}`;
      const qrCodeUrl = generateQRCode(invitationCode);

      const newInvitation: GeneratedInvitation = {
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        invitationCode,
        rsvpLink,
        qrCodeUrl
      };

      setGeneratedInvitations(prev => [...prev, newInvitation]);
      
      // Clear guest fields for next invitation
      setFormData(prev => ({
        ...prev,
        guestName: '',
        guestEmail: ''
      }));

      console.log('Generated invitation:', newInvitation);
    } catch (error) {
      console.error('Error generating invitation:', error);
      alert('Error generating invitation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, code: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Wedding form submitted:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wedding Details Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Wedding Details</CardTitle>
            <p className="text-center text-gray-600">Enter your wedding information</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brideName">Bride's Name</Label>
                  <Input
                    id="brideName"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    placeholder="Enter bride's name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="groomName">Groom's Name</Label>
                  <Input
                    id="groomName"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    placeholder="Enter groom's name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="weddingDate">Wedding Date</Label>
                <Input
                  id="weddingDate"
                  name="weddingDate"
                  type="date"
                  value={formData.weddingDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="Enter wedding venue"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Welcome Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter a welcome message for your guests"
                  rows={3}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Guest Invitation Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Generate Invitations</CardTitle>
            <p className="text-center text-gray-600">Create instant RSVP links for guests</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="guestName">Guest Name</Label>
              <Input
                id="guestName"
                name="guestName"
                value={formData.guestName}
                onChange={handleInputChange}
                placeholder="Enter guest's name"
              />
            </div>

            <div>
              <Label htmlFor="guestEmail">Guest Email</Label>
              <Input
                id="guestEmail"
                name="guestEmail"
                type="email"
                value={formData.guestEmail}
                onChange={handleInputChange}
                placeholder="Enter guest's email"
              />
            </div>

            <Button 
              onClick={generateInvitation}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Instant RSVP Link'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Generated Invitations Display */}
      {generatedInvitations.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Generated RSVP Links</CardTitle>
            <p className="text-gray-600">Share these links with your guests</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedInvitations.map((invitation, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{invitation.guestName}</h3>
                      <p className="text-sm text-gray-600">{invitation.guestEmail}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(invitation.rsvpLink, invitation.invitationCode)}
                      >
                        {copiedCode === invitation.invitationCode ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <Copy size={16} />
                        )}
                        Copy Link
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(invitation.qrCodeUrl, '_blank')}
                      >
                        <QrCode size={16} />
                        QR Code
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Link size={16} className="text-blue-600" />
                      <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                        {invitation.rsvpLink}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Invitation Code: {invitation.invitationCode}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. Fill in your wedding details in the left form</p>
          <p>2. Add guest name and email in the right form</p>
          <p>3. Click "Generate Instant RSVP Link" to create a unique link</p>
          <p>4. Copy the link or QR code to share with your guest</p>
          <p>5. Guest can click the link to access their personalized RSVP form</p>
        </CardContent>
      </Card>
    </div>
  );
}
