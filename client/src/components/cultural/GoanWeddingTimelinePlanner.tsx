import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { 
  Calendar,
  Clock,
  MapPin,
  Camera,
  Music,
  Utensils,
  Flower2,
  Heart,
  Crown,
  Home,
  Star,
  Plus,
  Download,
  Share
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '../../hooks/use-toast';

// TypeScript Interfaces
interface CeremonyEvent {
  id: string;
  name: string;
  description: string;
  culturalSignificance: string;
  estimatedDuration: number;
  traditionalTiming: string;
  requiredVendors: string[];
  culturalItems: string[];
  category: 'pre-wedding' | 'wedding-day' | 'post-wedding' | 'custom';
  isRequired: boolean;
  scheduledDateTime?: Date;
}

// Traditional Goan Wedding Ceremonies (condensed)
const traditionalCeremonies: CeremonyEvent[] = [
  {
    id: 'roce-ceremony',
    name: 'Roce Ceremony',
    description: 'Traditional pre-wedding blessing with coconut milk application',
    culturalSignificance: 'Purification ritual performed 3 days before the wedding. Family members apply coconut milk mixed with turmeric.',
    estimatedDuration: 180,
    traditionalTiming: '3 days before wedding, evening (6:00 PM)',
    requiredVendors: ['photographer', 'decorator', 'caterer', 'musician'],
    culturalItems: ['Fresh coconut milk', 'Turmeric powder', 'Traditional brass vessels', 'Marigold flowers'],
    category: 'pre-wedding',
    isRequired: true
  },
  {
    id: 'chuddo-ceremony',
    name: 'Chuddo Ceremony',
    description: 'Goan equivalent of Haldi ceremony',
    culturalSignificance: 'Applied one day before the wedding, the turmeric paste is blessed and applied by married women.',
    estimatedDuration: 120,
    traditionalTiming: '1 day before wedding, morning (10:00 AM)',
    requiredVendors: ['photographer', 'decorator', 'entertainer'],
    culturalItems: ['Turmeric paste (haldi)', 'Rose petals', 'Traditional brass plates', 'White clothes'],
    category: 'pre-wedding',
    isRequired: true
  },
  {
    id: 'church-ceremony',
    name: 'Church Wedding Ceremony',
    description: 'Sacred Catholic wedding ceremony',
    culturalSignificance: 'The most important part of the Goan Catholic wedding, conducted according to Catholic traditions.',
    estimatedDuration: 90,
    traditionalTiming: 'Wedding day, morning (10:00 AM - 11:30 AM)',
    requiredVendors: ['photographer', 'videographer', 'florist', 'musician'],
    culturalItems: ['Wedding rings', 'Church flowers', 'Wedding certificate', 'Traditional attire'],
    category: 'wedding-day',
    isRequired: true
  },
  {
    id: 'reception-dinner',
    name: 'Wedding Reception',
    description: 'Grand celebration with traditional Goan feast',
    culturalSignificance: 'Community celebration featuring authentic Goan cuisine, folk dances, and blessings from elders.',
    estimatedDuration: 300,
    traditionalTiming: 'Wedding day, evening (7:00 PM - 12:00 AM)',
    requiredVendors: ['caterer', 'decorator', 'dj', 'photographer', 'videographer'],
    culturalItems: ['Traditional Goan dishes', 'Cashew feni', 'Folk dance costumes', 'Decorated mandap'],
    category: 'wedding-day',
    isRequired: true
  },
  {
    id: 'porton',
    name: 'Porton (Portanim)',
    description: 'Bride\'s return to maternal home',
    culturalSignificance: 'Traditional ceremony where the bride returns to her mother\'s home for blessings.',
    estimatedDuration: 150,
    traditionalTiming: '3-7 days after wedding',
    requiredVendors: ['photographer', 'caterer'],
    culturalItems: ['Traditional gifts', 'Family blessing items', 'Traditional sweets'],
    category: 'post-wedding',
    isRequired: false
  }
];

const GoanWeddingTimelinePlanner: React.FC = () => {
  const [weddingDate, setWeddingDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CeremonyEvent[]>(traditionalCeremonies);
  const [selectedEvent, setSelectedEvent] = useState<CeremonyEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const { toast } = useToast();

  // Generate timeline dates
  const timelineDates = useMemo(() => {
    const dates = [];
    for (let i = -7; i <= 7; i++) {
      dates.push(addDays(weddingDate, i));
    }
    return dates;
  }, [weddingDate]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      if (!event.scheduledDateTime) return false;
      return format(event.scheduledDateTime, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  // Category styling
  const getCategoryColor = (category: CeremonyEvent['category']) => {
    switch (category) {
      case 'pre-wedding': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'wedding-day': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'post-wedding': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: CeremonyEvent['category']) => {
    switch (category) {
      case 'pre-wedding': return <Heart className="h-4 w-4" />;
      case 'wedding-day': return <Crown className="h-4 w-4" />;
      case 'post-wedding': return <Home className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  // Schedule event
  const scheduleEvent = (eventId: string, dateTime: Date) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, scheduledDateTime: dateTime } : event
    ));
    toast({
      title: 'Event Scheduled',
      description: `Event scheduled for ${format(dateTime, 'PPp')}`
    });
  };

  // Generate checklist
  const generateEventChecklist = (event: CeremonyEvent) => {
    return [
      `Book venue for ${event.name}`,
      ...event.requiredVendors.map(vendor => `Confirm ${vendor} for ${event.name}`),
      ...event.culturalItems.map(item => `Arrange ${item}`),
      `Send invitations for ${event.name}`,
      `Prepare traditional attire`
    ];
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Goan Wedding Timeline Planner
          </h1>
          <p className="text-gray-600 mt-2">Plan your authentic Goan Catholic wedding with cultural traditions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Wedding Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Wedding Date</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div>
              <Label htmlFor="wedding-date">Select your wedding date</Label>
              <Input
                id="wedding-date"
                type="date"
                value={format(weddingDate, 'yyyy-MM-dd')}
                onChange={(e) => setWeddingDate(new Date(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Selected:</strong> {format(weddingDate, 'PPPP')}</p>
              <p><strong>Season:</strong> {weddingDate.getMonth() >= 5 && weddingDate.getMonth() <= 9 ? 'Monsoon Season' : 'Dry Season'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-fit">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="ceremonies">Ceremonies</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        {/* Timeline View */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">15-Day Wedding Timeline</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {timelineDates.map((date, index) => (
              <Card
                key={index}
                className={`min-h-[200px] ${
                  format(date, 'yyyy-MM-dd') === format(weddingDate, 'yyyy-MM-dd')
                    ? 'ring-2 ring-pink-500 bg-pink-50'
                    : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {format(date, 'EEE')}
                    <br />
                    {format(date, 'MMM d')}
                    {format(date, 'yyyy-MM-dd') === format(weddingDate, 'yyyy-MM-dd') && (
                      <Badge className="ml-2 bg-pink-500">Wedding Day</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {getEventsForDate(date).map((event) => (
                    <div
                      key={event.id}
                      className={`p-2 rounded border cursor-pointer hover:shadow-md ${getCategoryColor(event.category)}`}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventDialog(true);
                      }}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        {getCategoryIcon(event.category)}
                        <span className="text-xs font-medium truncate">{event.name}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.estimatedDuration}min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Ceremonies Tab */}
        <TabsContent value="ceremonies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((ceremony) => (
              <Card key={ceremony.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(ceremony.category)}
                      <span>{ceremony.name}</span>
                      {ceremony.isRequired && <Badge className="bg-red-500">Required</Badge>}
                    </div>
                    <Badge className={getCategoryColor(ceremony.category)}>
                      {ceremony.category.replace('-', ' ')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{ceremony.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{ceremony.estimatedDuration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{ceremony.traditionalTiming}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Cultural Significance</h4>
                    <p className="text-xs text-gray-600 line-clamp-3">{ceremony.culturalSignificance}</p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedEvent(ceremony);
                      setShowEventDialog(true);
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-6">
          {events
            .filter(event => event.scheduledDateTime)
            .map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getCategoryIcon(event.category)}
                    <span>{event.name} Checklist</span>
                    <Badge className={getCategoryColor(event.category)}>
                      {event.scheduledDateTime && format(event.scheduledDateTime, 'MMM d')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {generateEventChecklist(event).map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`${event.id}-${index}`} />
                        <Label htmlFor={`${event.id}-${index}`} className="text-sm">
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Photographers', icon: <Camera className="h-5 w-5" />, count: 3 },
              { name: 'Musicians', icon: <Music className="h-5 w-5" />, count: 2 },
              { name: 'Caterers', icon: <Utensils className="h-5 w-5" />, count: 1 },
              { name: 'Decorators', icon: <Flower2 className="h-5 w-5" />, count: 1 },
              { name: 'Venues', icon: <MapPin className="h-5 w-5" />, count: 4 }
            ].map((vendor) => (
              <Card key={vendor.name} className="text-center">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-center text-blue-500">
                      {vendor.icon}
                    </div>
                    <h3 className="font-medium">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.count} recommended</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Browse {vendor.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  {getCategoryIcon(selectedEvent.category)}
                  <span>{selectedEvent.name}</span>
                  <Badge className={getCategoryColor(selectedEvent.category)}>
                    {selectedEvent.category.replace('-', ' ')}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Cultural Significance</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.culturalSignificance}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Duration</h4>
                    <p className="text-sm">{selectedEvent.estimatedDuration} minutes</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Traditional Timing</h4>
                    <p className="text-sm">{selectedEvent.traditionalTiming}</p>
                  </div>
                </div>

                {selectedEvent.requiredVendors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Required Vendors</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.requiredVendors.map((vendor, index) => (
                        <Badge key={index} variant="outline">
                          {vendor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.culturalItems.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Cultural Items Needed</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedEvent.culturalItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox id={`item-${index}`} />
                          <Label htmlFor={`item-${index}`} className="text-sm">
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      const defaultTime = new Date(weddingDate);
                      scheduleEvent(selectedEvent.id, defaultTime);
                      setShowEventDialog(false);
                    }}
                  >
                    Schedule Event
                  </Button>
                  <Button variant="outline">
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoanWeddingTimelinePlanner;