// Enterprise-grade RSVP Generator Types and Interfaces

export type ReligionTemplate = 'hindu' | 'christian' | 'islamic';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
  scriptSupport?: string;
}

export interface IconConfiguration {
  primary: string;
  ceremonial: string[];
  decorative: string[];
}

export interface TemplateConfig {
  id: ReligionTemplate;
  name: string;
  displayName: string;
  description: string;
  culturalElements: string[];
  colorScheme: ColorPalette;
  typography: TypographyConfig;
  iconSet: IconConfiguration;
  ceremonialTerms: {
    ceremony: string;
    reception: string;
    invitation: string;
    blessing: string;
  };
}

export interface VenueDetails {
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  capacity: number;
  amenities?: string[];
  accessibilityFeatures?: string[];
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  role: 'primary' | 'secondary' | 'planner';
}

export interface WeddingPlannerInfo {
  company: string;
  contact: ContactInfo;
  website?: string;
}

export interface BrandingConfig {
  logoUrl?: string;
  companyName?: string;
  watermark?: boolean;
  customColors?: ColorPalette;
}

export interface GuestCapacityConfig {
  ceremonyCapacity: number;
  receptionCapacity: number;
  allowPlusOne: boolean;
  maxGuestsPerInvitation: number;
}

export interface CulturalCustomization {
  customSymbols?: string[];
  additionalLanguages?: string[];
  customCeremonyNames?: Record<string, string>;
  traditionalElements?: string[];
}

export interface LanguageConfig {
  primary: 'en' | 'hi' | 'ar' | 'ur';
  secondary?: string[];
  rtlSupport?: boolean;
}

export interface AnalyticsConfig {
  trackResponses: boolean;
  generateReports: boolean;
  realTimeUpdates: boolean;
  exportOptions: ExportFormat[];
  retentionPeriod: number;
  trackingEvents: TrackingEvent[];
}

export type ExportFormat = 'json' | 'csv' | 'excel' | 'pdf';

export interface TrackingEvent {
  name: string;
  category: 'engagement' | 'conversion' | 'sharing' | 'device';
  description: string;
}

export interface EnterpriseWeddingData {
  // Core Information
  brideName: string;
  groomName: string;
  weddingDate: Date;
  template: ReligionTemplate;
  
  // Venue Information
  ceremonyVenue: VenueDetails;
  receptionVenue?: VenueDetails;
  
  // Timing
  ceremonyTime: string;
  receptionTime?: string;
  
  // Contact & Business
  primaryContact: ContactInfo;
  secondaryContact?: ContactInfo;
  plannerInfo?: WeddingPlannerInfo;
  
  // Enterprise Features
  branding?: BrandingConfig;
  analytics: AnalyticsConfig;
  guestCapacity: GuestCapacityConfig;
  
  // Cultural Customization
  customElements?: CulturalCustomization;
  languagePreferences?: LanguageConfig;
  
  // Additional Information
  message?: string;
  specialInstructions?: string;
  dressCode?: string;
  giftRegistry?: string;
}

export interface BulkGenerationRequest {
  template: ReligionTemplate;
  weddings: EnterpriseWeddingData[];
  configuration: GenerationConfig;
}

export interface GenerationConfig {
  enableAnalytics: boolean;
  qrCodeSize: 'small' | 'medium' | 'large';
  exportFormat: ExportFormat[];
  batchSize: number;
  includeDashboard: boolean;
  enableSharing: boolean;
  customDomain?: string;
}

export interface GenerationResult {
  weddingId: string;
  template: ReligionTemplate;
  rsvpLink: string;
  qrCodeUrl: string;
  dashboardLink: string;
  analytics: AnalyticsConfig;
  createdAt: Date;
  expiresAt?: Date;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
}

export enum AttendanceStatus {
  ATTENDING = 'attending',
  NOT_ATTENDING = 'not_attending',
  MAYBE = 'maybe',
  PENDING = 'pending'
}

export enum ResponseSource {
  DIRECT_LINK = 'direct_link',
  QR_CODE = 'qr_code',
  SOCIAL_SHARE = 'social_share',
  EMAIL_INVITATION = 'email_invitation',
  WHATSAPP_SHARE = 'whatsapp_share'
}

export interface DeviceMetadata {
  userAgent: string;
  platform: string;
  screenSize: string;
  isMobile: boolean;
  browser: string;
}

export interface DietaryPreference {
  type: 'vegetarian' | 'vegan' | 'halal' | 'kosher' | 'gluten-free' | 'other';
  description?: string;
}

export interface AccessibilityRequirement {
  type: 'wheelchair' | 'hearing' | 'visual' | 'mobility' | 'other';
  description?: string;
}

export interface AccommodationRequest {
  needsAccommodation: boolean;
  nights?: number;
  preferences?: string;
  specialRequests?: string;
}

export interface CulturalPreference {
  language: string;
  dietaryRestrictions: string[];
  ceremonialParticipation: boolean;
  traditionalDress: boolean;
}

export interface EnterpriseRSVPResponse {
  // Guest Information
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  
  // Attendance Details
  ceremonyAttendance: AttendanceStatus;
  receptionAttendance: AttendanceStatus;
  numberOfGuests: number;
  guestNames?: string[];
  
  // Preferences
  dietaryRestrictions?: DietaryPreference[];
  accessibilityNeeds?: AccessibilityRequirement[];
  accommodationNeeds?: AccommodationRequest;
  
  // Cultural Specific
  culturalPreferences?: CulturalPreference[];
  languagePreference?: string;
  
  // Analytics
  submissionTimestamp: Date;
  deviceInfo: DeviceMetadata;
  responseTime: number; // seconds
  source: ResponseSource;
  
  // Wedding Context
  weddingId: string;
  template: ReligionTemplate;
  
  // Additional
  specialMessage?: string;
  giftContribution?: number;
  songRequests?: string[];
}

export interface AnalyticsReport {
  weddingId: string;
  summary: {
    totalInvitations: number;
    totalResponses: number;
    responseRate: number;
    attendingCount: number;
    notAttendingCount: number;
    pendingCount: number;
  };
  demographics: {
    deviceBreakdown: Record<string, number>;
    sourceBreakdown: Record<ResponseSource, number>;
    responseTimeAverage: number;
    geographicDistribution?: Record<string, number>;
  };
  timeline: {
    responsesOverTime: Array<{
      date: string;
      count: number;
    }>;
    peakResponseTimes: string[];
  };
  preferences: {
    dietaryRestrictions: Record<string, number>;
    accessibilityNeeds: Record<string, number>;
    culturalPreferences: Record<string, number>;
  };
  exportData: {
    lastExported: Date;
    exportCount: number;
    availableFormats: ExportFormat[];
  };
}

export interface SecurityConfig {
  inputSanitization: {
    htmlEscape: boolean;
    sqlInjectionPrevention: boolean;
    xssProtection: boolean;
  };
  
  dataRetention: {
    anonymizeAfterDays: number;
    purgeAfterDays: number;
    encryptPII: boolean;
  };
  
  accessControl: {
    rateLimiting: RateLimitConfig;
    ipWhitelisting?: string[];
    geoBlocking?: string[];
  };
}

export interface RateLimitConfig {
  generationsPerHour: number;
  responsesPerMinute: number;
  bulkOperationsPerDay: number;
}

export interface EnterpriseRSVPGeneratorProps {
  mode: 'single' | 'bulk' | 'template-preview';
  initialData?: Partial<EnterpriseWeddingData>;
  onGenerated?: (results: GenerationResult[]) => void;
  onError?: (error: Error) => void;
  configuration?: Partial<GenerationConfig>;
}

export interface WebhookEvent {
  type: 'rsvp_submitted' | 'wedding_created' | 'analytics_updated';
  weddingId: string;
  timestamp: Date;
  data: any;
}

export interface AcknowledgmentStatus {
  received: boolean;
  processed: boolean;
  timestamp: Date;
}