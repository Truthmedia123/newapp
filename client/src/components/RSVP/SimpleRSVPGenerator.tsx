import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function SimpleRSVPGenerator() {
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    venue: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('RSVP Generator form submitted! Check console for data.');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">RSVP Generator</CardTitle>
          <p className="text-center text-gray-600">Create your wedding RSVP form</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full">
              Generate RSVP Form
            </Button>
          </form>

          {/* Display current form data for debugging */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Current Form Data:</h3>
            <pre className="text-sm text-gray-600">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
