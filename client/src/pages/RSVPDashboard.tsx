import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Users, CheckCircle, Clock, Download, Search } from "lucide-react";

interface RSVPDashboardData {
  wedding: any;
  statistics: {
    totalInvitations: number;
    respondedCount: number;
    pendingCount: number;
    attendingCount: number;
    totalGuests: number;
    responseRate: number;
  };
  invitations: any[];
  rsvpResponses: any[];
  csvData: any[];
}

export default function RSVPDashboard() {
  const [weddingId, setWeddingId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: dashboardData, isLoading, error } = useQuery<RSVPDashboardData>({
    queryKey: [`/api/rsvp/manage/${weddingId}`],
    enabled: shouldFetch && !!weddingId,
    retry: false,
  });

  const handleLoadDashboard = () => {
    if (weddingId.trim()) {
      setShouldFetch(true);
    } else {
      toast({
        title: "Wedding ID Required",
        description: "Please enter a valid wedding ID",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    if (!dashboardData?.csvData) return;

    const csvContent = [
      ['Guest Name', 'Email', 'Attending Ceremony', 'Attending Reception', 'Number of Guests', 'Dietary Restrictions', 'Message', 'Submitted At'],
      ...dashboardData.csvData.map(row => [
        row.guestName,
        row.guestEmail,
        row.attendingCeremony,
        row.attendingReception,
        row.numberOfGuests,
        row.dietaryRestrictions,
        row.message,
        new Date(row.submittedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dashboardData.wedding.brideName}-${dashboardData.wedding.groomName}-rsvp-responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({ title: "CSV Downloaded Successfully!" });
  };

  const filteredResponses = dashboardData?.rsvpResponses.filter(response =>
    response.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    response.guestEmail.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!shouldFetch) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>RSVP Dashboard</CardTitle>
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
            <Button onClick={handleLoadDashboard} className="w-full">
              Load Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-2">Loading dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-600">
              <p>Failed to load dashboard. Please check the wedding ID and try again.</p>
              <Button 
                onClick={() => setShouldFetch(false)} 
                variant="outline" 
                className="mt-4"
              >
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { wedding, statistics, rsvpResponses } = dashboardData;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            {wedding.brideName} & {wedding.groomName}
          </h1>
          <p className="text-gray-600">
            {new Date(wedding.weddingDate).toLocaleDateString()} at {wedding.venue}
          </p>
        </div>
        <Button onClick={() => setShouldFetch(false)} variant="outline">
          Back
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{statistics.totalInvitations}</span>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{statistics.respondedCount}</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-gray-500">
              {statistics.responseRate}% response rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Attending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{statistics.attendingCount}</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{statistics.totalGuests}</span>
              <Users className="h-5 w-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
        <Button onClick={handleExportCSV} className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Responses */}
      <Card>
        <CardHeader>
          <CardTitle>RSVP Responses ({filteredResponses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResponses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No guests match your search." : "No responses yet."}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResponses.map((response) => (
                <div key={response.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{response.guestName}</h3>
                      <p className="text-sm text-gray-600">{response.guestEmail}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {new Date(response.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant={response.attendingCeremony ? "default" : "secondary"}>
                      Ceremony: {response.attendingCeremony ? "Yes" : "No"}
                    </Badge>
                    <Badge variant={response.attendingReception ? "default" : "secondary"}>
                      Reception: {response.attendingReception ? "Yes" : "No"}
                    </Badge>
                    <Badge variant="outline">
                      {response.numberOfGuests} guest{response.numberOfGuests > 1 ? 's' : ''}
                    </Badge>
                  </div>

                  {response.dietaryRestrictions && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Dietary: </span>
                      <span className="text-sm text-gray-600">{response.dietaryRestrictions}</span>
                    </div>
                  )}

                  {response.message && (
                    <div className="bg-gray-50 p-3 rounded italic text-sm">
                      "{response.message}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}