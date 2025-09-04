export function generateInvitationCode(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function generateQRCode(invitationCode: string): string {
  const rsvpUrl = `${window.location.origin}/rsvp/${invitationCode}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(rsvpUrl)}`;
}

export function exportGuestList(guests: any[]): void {
  const csv = guests.map(guest => 
    `${guest.name},${guest.email},${guest.attending ? 'Yes' : 'No'}`
  ).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'guest-list.csv';
  a.click();
}

export function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const guest: any = {};
    headers.forEach((header, index) => {
      guest[header.toLowerCase().replace(/\s+/g, '')] = values[index] || '';
    });
    return guest;
  });
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatWeddingDate(date: string | Date): string {
  const weddingDate = new Date(date);
  return weddingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getTimeUntilWedding(weddingDate: string | Date): string {
  const now = new Date();
  const wedding = new Date(weddingDate);
  const diffTime = wedding.getTime() - now.getTime();
  
  if (diffTime < 0) {
    return 'Wedding has passed';
  }
  
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today!';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  }
}

export function generateWeddingSlug(brideName: string, groomName: string): string {
  return `${brideName.toLowerCase().replace(/\s+/g, '-')}-${groomName.toLowerCase().replace(/\s+/g, '-')}-wedding`;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function generateEventId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function calculateGuestCount(guests: any[]): { attending: number; total: number } {
  const attending = guests.filter(g => g.attending).length;
  const total = guests.length;
  return { attending, total };
}

export function getEventStatus(event: any): 'upcoming' | 'today' | 'past' {
  const now = new Date();
  const eventDate = new Date(event.date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  
  if (eventDay < today) return 'past';
  if (eventDay.getTime() === today.getTime()) return 'today';
  return 'upcoming';
}
