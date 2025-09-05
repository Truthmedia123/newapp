import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, QrCode, Link, Upload, Download, Check } from 'lucide-react';
import { generateQRCode } from '@/utils/rsvpUtils';

interface Guest {
  wedding_id: number;
  guest_name: string;
  guest_email: string;
  max_guests?: number;
  allow_plus_one?: boolean;
}

interface GeneratedInvitation {
  id: number;
  guestName: string;
  guestEmail: string;
  invitationCode: string;
  rsvpLink: string;
}

export function RSVPInvitationSender() {
  const [weddingId, setWeddingId] = useState<string>('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [generatedInvitations, setGeneratedInvitations] = useState<GeneratedInvitation[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [csvText, setCsvText] = useState('');

  const addGuest = () => {
    if (!weddingId) {
      alert('Please enter a wedding ID first');
      return;
    }
    
    setGuests(prev => [...prev, {
      wedding_id: parseInt(weddingId),
      guest_name: '',
      guest_email: '',
      max_guests: 1,
      allow_plus_one: false
    }]);
  };

  const updateGuest = (index: number, field: keyof Guest, value: string | number | boolean) => {
    setGuests(prev => prev.map((guest, i) => 
      i === index ? { ...guest, [field]: value } : guest
    ));
  };

  const removeGuest = (index: number) => {
    setGuests(prev => prev.filter((_, i) => i !== index));
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const parsedGuests: Guest[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 3) {
        parsedGuests.push({
          wedding_id: parseInt(weddingId) || 1,
          guest_name: values[0] || '',
          guest_email: values[1] || '',
          max_guests: parseInt(values[2]) || 1,
          allow_plus_one: values[3]?.toLowerCase() === 'true'
        });
      }
    }
    
    setGuests(prev => [...prev, ...parsedGuests]);
    setCsvText('');
  };

  const generateInvitations = async () => {
    if (guests.length === 0) {
      alert('Please add at least one guest');
      return;
    }

    const validGuests = guests.filter(g => g.guest_name && g.guest_email);
    if (validGuests.length === 0) {
      alert('Please fill in guest names and emails');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/rsvp/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validGuests),
      });

      if (!response.ok) {
        throw new Error('Failed to generate invitations');
      }

      const result = await response.json();
      setGeneratedInvitations(result.invitations);
      
      // Clear the guest list
      setGuests([]);
      
    } catch (error) {
      console.error('Error generating invitations:', error);
      alert('Error generating invitations. Please try again.');
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

  const exportCSV = () => {
    if (generatedInvitations.length === 0) return;
    
    const csv = generatedInvitations.map(inv => 
      `${inv.guestName},${inv.guestEmail},${inv.invitationCode},${inv.rsvpLink}`
    ).join('\n');
    
    const headers = 'Guest Name,Guest Email,Invitation Code,RSVP Link\n';
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvp-invitations.csv';
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">RSVP Invitation Sender</h1>
        <p className="text-gray-600">Generate personalized RSVP links for your wedding guests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guest Management */}
        <Card>
          <CardHeader>
            <CardTitle>Guest List Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="weddingId">Wedding ID</Label>
              <Input
                id="weddingId"
                value={weddingId}
                onChange={(e) => setWeddingId(e.target.value)}
                placeholder="Enter wedding ID"
                type="number"
              />
            </div>

            {/* CSV Import */}
            <div>
              <Label htmlFor="csvImport">Import from CSV</Label>
              <Textarea
                id="csvImport"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Paste CSV data: Name,Email,MaxGuests,AllowPlusOne"
                rows={4}
              />
              <Button 
                onClick={() => parseCSV(csvText)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <Upload size={16} className="mr-2" />
                Import CSV
              </Button>
            </div>

            {/* Manual Guest Entry */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Guest List</Label>
                <Button onClick={addGuest} size="sm">
                  Add Guest
                </Button>
              </div>

              {guests.map((guest, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Guest {index + 1}</span>
                    <Button 
                      onClick={() => removeGuest(index)}
                      variant="outline"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Guest Name"
                      value={guest.guest_name}
                      onChange={(e) => updateGuest(index, 'guest_name', e.target.value)}
                    />
                    <Input
                      placeholder="Guest Email"
                      type="email"
                      value={guest.guest_email}
                      onChange={(e) => updateGuest(index, 'guest_email', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Max Guests"
                      type="number"
                      min="1"
                      value={guest.max_guests || 1}
                      onChange={(e) => updateGuest(index, 'max_guests', parseInt(e.target.value) || 1)}
                    />
                    <Select 
                      value={guest.allow_plus_one ? 'true' : 'false'}
                      onValueChange={(value) => updateGuest(index, 'allow_plus_one', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No Plus One</SelectItem>
                        <SelectItem value="true">Allow Plus One</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={generateInvitations}
              disabled={isGenerating || guests.length === 0}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : `Generate ${guests.length} Invitation Links`}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Invitations */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Generated Invitations</CardTitle>
              {generatedInvitations.length > 0 && (
                <Button onClick={exportCSV} variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Export CSV
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {generatedInvitations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Link size={48} className="mx-auto mb-4 opacity-50" />
                <p>No invitations generated yet</p>
                <p className="text-sm">Add guests and click "Generate Invitation Links"</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedInvitations.map((invitation) => (
                  <div key={invitation.id} className="border rounded-lg p-4 bg-gray-50">
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
                          onClick={() => window.open(generateQRCode(invitation.invitationCode), '_blank')}
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
                        Code: {invitation.invitationCode}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. Enter your wedding ID (create a wedding first in the admin panel)</p>
          <p>2. Add guests manually or import from CSV format: Name,Email,MaxGuests,AllowPlusOne</p>
          <p>3. Click "Generate Invitation Links" to create unique RSVP links</p>
          <p>4. Copy links or generate QR codes to share with guests</p>
          <p>5. Export the list as CSV for your records</p>
        </CardContent>
      </Card>
    </div>
  );
}
