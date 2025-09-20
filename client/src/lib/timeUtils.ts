/**
 * Converts a 24-hour time string (HH:MM) to 12-hour format with AM/PM
 * @param time24 - Time in 24-hour format (e.g., "14:30")
 * @returns Time in 12-hour format with AM/PM (e.g., "2:30 PM")
 */
export function convertTo12HourFormat(time24: string): string {
  try {
    // Handle empty or undefined input
    if (!time24 || time24.trim() === '') return '';
    
    // Handle case where time might already be in 12-hour format
    if (time24.includes('AM') || time24.includes('PM')) {
      return time24;
    }
    
    // Handle HH:MM AM/PM format
    if (time24.includes(':') && (time24.endsWith(' AM') || time24.endsWith(' PM'))) {
      return time24;
    }
    
    // Split the time string
    const parts = time24.split(' ');
    const timePart = parts[0];
    const periodPart = parts[1] ? parts[1].toUpperCase() : '';
    
    // If we have a period part, it's likely already in 12-hour format
    if (periodPart === 'AM' || periodPart === 'PM') {
      return time24;
    }
    
    // Split hours and minutes
    const [hoursStr, minutesStr] = timePart.split(':');
    if (!hoursStr || !minutesStr) return time24;
    
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // Validate hours and minutes
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return time24;
    }
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error converting time format:', error, 'Input:', time24);
    return time24;
  }
}