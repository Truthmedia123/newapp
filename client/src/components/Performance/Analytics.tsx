import React from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface AnalyticsProps {
  trackingId?: string;
}

export const Analytics: React.FC<AnalyticsProps> = () => {
  // Umami analytics is loaded via script in index.html
  return null;
};

// Analytics utility functions for Umami
export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami(eventName, data);
  }
};

export const trackPageView = (url: string, referrer?: string) => {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami('pageview', { url, referrer });
  }
};

export const trackUserInteraction = (element: string, action: string) => {
  trackEvent('user_interaction', { element, action });
};

export const trackPerformance = (metric: string, value: number) => {
  trackEvent('performance_metric', { metric, value });
};

// Custom hook for analytics
export const useAnalytics = () => {
  const trackClick = (element: string) => {
    trackUserInteraction(element, 'click');
  };

  const trackView = (page: string) => {
    trackPageView(page);
  };

  const trackSearch = (query: string, results: number) => {
    trackEvent('search', { query, results });
  };

  const trackVendorView = (vendorId: string, vendorName: string) => {
    trackEvent('vendor_view', { vendorId, vendorName });
  };

  const trackWishlistAction = (action: 'add' | 'remove', vendorId: string) => {
    trackEvent(`wishlist_${action}`, { vendorId });
  };

  return {
    trackClick,
    trackView,
    trackSearch,
    trackVendorView,
    trackWishlistAction,
  };
};

// Extend Window interface for umami
declare global {
  interface Window {
    umami: (...args: any[]) => void;
  }
}