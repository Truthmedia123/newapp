import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestRSVP() {
  const [weddingId, setWeddingId] = useState('');
  const [weddingData, setWeddingData] = useState<any>(null);
  const [allWeddings, setAllWeddings] = useState<any[]>([]);

  useEffect(() => {
    loadAllWeddings();
  }, []);

  const loadAllWeddings = () => {
    const weddings = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wedding_')) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const wedding = JSON.parse(data);
            weddings.push({
              id: key.replace('wedding_', ''),
              ...wedding
            });
          } catch (e) {
            console.error('Error parsing wedding data:', e);
          }
        }
      }
    }
    setAllWeddings(weddings);
  };

  const loadWeddingData = () => {
    if (!weddingId) return;
    
    const stored = localStorage.getItem(`wedding_${weddingId}`);
    if (stored) {
      try {
        const wedding = JSON.parse(stored);
        setWeddingData(wedding);
      } catch (e) {
        console.error('Error parsing wedding data:', e);
        setWeddingData(null);
      }
    } else {
      setWeddingData(null);
    }
  };

  const createTestWedding = () => {
    const testWeddingId = 'test-wedding-123';
    const testWedding = {
      id: testWeddingId,
      weddingData: {
        brideName: 'Priya',
        groomName: 'Raj',
        weddingDate: '2024-12-25',
        ceremonyTime: '4:00 PM',
        receptionTime: '7:00 PM',
        venue: 'Grand Hyatt Goa',
        venueAddress: 'Bambolim, Goa',
        contactPhone: '+91 98765 43210',
        contactEmail: 'priya.raj@example.com',
        message: 'We are excited to celebrate our special day with you!'
      },
      rsvpLink: `${window.location.origin}/rsvp/goan/${testWeddingId}`,
      qrCodeUrl: 'test-qr-code',
      dashboardLink: `${window.location.origin}/rsvp/dashboard/${testWeddingId}`,
      createdAt: new Date()
    };

    localStorage.setItem(`wedding_${testWeddingId}`, JSON.stringify(testWedding));
    setWeddingId(testWeddingId);
    setWeddingData(testWedding);
    loadAllWeddings();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">RSVP System Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={createTestWedding} className="w-full">
                Create Test Wedding
              </Button>
              
              <div>
                <Label htmlFor="weddingId">Wedding ID</Label>
                <Input
                  id="weddingId"
                  value={weddingId}
                  onChange={(e) => setWeddingId(e.target.value)}
                  placeholder="Enter wedding ID"
                />
              </div>
              
              <Button onClick={loadWeddingData} className="w-full">
                Load Wedding Data
              </Button>
            </CardContent>
          </Card>

          {/* Wedding Data Display */}
          <Card>
            <CardHeader>
              <CardTitle>Wedding Data</CardTitle>
            </CardHeader>
            <CardContent>
              {weddingData ? (
                <div className="space-y-2">
                  <p><strong>ID:</strong> {weddingData.id}</p>
                  <p><strong>Bride:</strong> {weddingData.weddingData.brideName}</p>
                  <p><strong>Groom:</strong> {weddingData.weddingData.groomName}</p>
                  <p><strong>Date:</strong> {weddingData.weddingData.weddingDate}</p>
                  <p><strong>Venue:</strong> {weddingData.weddingData.venue}</p>
                  <p><strong>RSVP Link:</strong> 
                    <a href={weddingData.rsvpLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-2">
                      {weddingData.rsvpLink}
                    </a>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No wedding data loaded</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Weddings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Stored Weddings</CardTitle>
          </CardHeader>
          <CardContent>
            {allWeddings.length > 0 ? (
              <div className="space-y-4">
                {allWeddings.map((wedding) => (
                  <div key={wedding.id} className="border rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{wedding.weddingData.brideName} & {wedding.weddingData.groomName}</h3>
                        <p className="text-sm text-gray-600">ID: {wedding.id}</p>
                        <p className="text-sm text-gray-600">Date: {wedding.weddingData.weddingDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setWeddingId(wedding.id);
                            setWeddingData(wedding);
                          }}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(wedding.rsvpLink, '_blank')}
                        >
                          Test RSVP
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No weddings stored in localStorage</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
