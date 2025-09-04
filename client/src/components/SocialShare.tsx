import React, { useState } from 'react';
import { Button } from './ui/button';
import { Share2, Facebook, Twitter, MessageCircle, Mail, Link, Copy } from 'lucide-react';
import { useAnalytics } from './Performance/Analytics';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url = window.location.href,
  title = document.title,
  description = "Check out this amazing wedding vendor on The Goan Wedding!",
  image = "/assets/hero.jpg",
  hashtags = ['GoaWedding', 'WeddingVendors', 'TheGoanWedding'],
  size = 'md',
  showText = false,
  variant = 'outline',
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const { trackUserInteraction } = useAnalytics();

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = encodeURIComponent(image);
  const encodedHashtags = hashtags.join(',');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
  };

  const handleShare = (platform: string) => {
    trackUserInteraction(`share-${platform}`, title);
    
    if (platform === 'native' && navigator.share) {
      navigator.share({
        title,
        text: description,
        url,
      }).catch(console.error);
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        trackUserInteraction('share-copy', title);
      });
    } else {
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="relative">
      <Button
        variant={variant}
        size="icon"
        onClick={() => setShowShareMenu(!showShareMenu)}
        className={`${sizeClasses[size]} ${showText ? 'w-auto px-3' : ''}`}
        aria-label="Share"
      >
        <Share2 className={iconSizes[size]} />
        {showText && <span className={`ml-2 ${textSizes[size]}`}>Share</span>}
      </Button>

      {showShareMenu && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 min-w-48">
          <div className="space-y-1">
            {/* Native Share (if supported) */}
            {navigator.share && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('native')}
                className="w-full justify-start"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}

            {/* Facebook */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="w-full justify-start text-blue-600 hover:bg-blue-50"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>

            {/* Twitter */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="w-full justify-start text-blue-400 hover:bg-blue-50"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>

            {/* WhatsApp */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('whatsapp')}
              className="w-full justify-start text-green-600 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>

            {/* Email */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('email')}
              className="w-full justify-start text-gray-600 hover:bg-gray-50"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>

            {/* Copy Link */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('copy')}
              className="w-full justify-start text-gray-600 hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

// Social Share Buttons (for specific platforms)
export const SocialShareButtons: React.FC<SocialShareProps> = (props) => {
  const { trackUserInteraction } = useAnalytics();

  const handleShare = (platform: string) => {
    trackUserInteraction(`share-${platform}`, props.title || '');
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url || window.location.href)}`,
            '_blank',
            'width=600,height=400'
          );
          handleShare('facebook');
        }}
        className="text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(props.url || window.location.href)}&text=${encodeURIComponent(props.title || '')}`,
            '_blank',
            'width=600,height=400'
          );
          handleShare('twitter');
        }}
        className="text-blue-400 border-blue-200 hover:bg-blue-50"
      >
        <Twitter className="h-4 w-4 mr-2" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(props.title || '')}%20${encodeURIComponent(props.url || window.location.href)}`,
            '_blank'
          );
          handleShare('whatsapp');
        }}
        className="text-green-600 border-green-200 hover:bg-green-50"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        WhatsApp
      </Button>
    </div>
  );
};

// Hook for social sharing
export const useSocialShare = () => {
  const share = async (data: {
    title?: string;
    text?: string;
    url?: string;
  }) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return false;
      }
    }
    return false;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };

  return {
    share,
    copyToClipboard,
    isSupported: !!navigator.share,
  };
};