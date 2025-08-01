import { useState } from 'react';

interface PolicyLinkConfig {
  primary: string;
  fallback: string;
}

const policyLinks: Record<string, PolicyLinkConfig> = {
  terms: {
    primary: 'https://merchant.razorpay.com/policy/PqfBTEACVz2o95/terms',
    fallback: 'https://razorpay.com/terms/'
  },
  privacy: {
    primary: 'https://merchant.razorpay.com/policy/PqfBTEACVz2o95/privacy',
    fallback: 'https://razorpay.com/privacy/'
  },
  refund: {
    primary: 'https://merchant.razorpay.com/policy/PqfBTEACVz2o95/refund',
    fallback: 'https://razorpay.com/refund/'
  },
  shipping: {
    primary: 'https://merchant.razorpay.com/policy/PqfBTEACVz2o95/shipping',
    fallback: 'https://razorpay.com/shipping/'
  }
};

export const usePolicyLink = (policyType: keyof typeof policyLinks) => {
  const [currentUrl, setCurrentUrl] = useState(policyLinks[policyType].primary);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If we haven't tried the fallback yet, try the primary URL first
    if (!hasTriedFallback) {
      // We'll let the browser handle the navigation
      // If it fails, the user can manually try the fallback
      return;
    }
    
    // If we've already tried the fallback, use it
    e.preventDefault();
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  const handleError = () => {
    if (!hasTriedFallback) {
      setCurrentUrl(policyLinks[policyType].fallback);
      setHasTriedFallback(true);
    }
  };

  return {
    url: currentUrl,
    handleClick,
    handleError
  };
}; 