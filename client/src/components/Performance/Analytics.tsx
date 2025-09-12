import React, { useEffect } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface AnalyticsProps {
  trackingId?: string;
}

export const Analytics: React.FC<AnalyticsProps> = ({ trackingId = 'GA_MEASUREMENT_ID' }) => {
  useEffect(() => {
    // Initialize Google Analytics
    if (typeof window !== 'undefined' && trackingId) {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [trackingId]);

  return null;
};

// Analytics utility functions
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }
};

export const trackUserInteraction = (element: string, action: string) => {
  trackEvent({
    action,
    category: 'User Interaction',
    label: element,
  });
};

export const trackPerformance = (metric: string, value: number) => {
  trackEvent({
    action: 'performance_metric',
    category: 'Performance',
    label: metric,
    value,
  });
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
    trackEvent({
      action: 'search',
      category: 'Search',
      label: query,
      value: results,
    });
  };

  const trackVendorView = (vendorId: string, vendorName: string) => {
    trackEvent({
      action: 'vendor_view',
      category: 'Vendor',
      label: vendorName,
    });
  };

  const trackWishlistAction = (action: 'add' | 'remove', vendorId: string) => {
    trackEvent({
      action: `wishlist_${action}`,
      category: 'Wishlist',
      label: vendorId,
    });
  };

  return {
    trackClick,
    trackView,
    trackSearch,
    trackVendorView,
    trackWishlistAction,
  };
};

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}