import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  Music, 
  Download,
  Copy,
  Check
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";

interface SocialSharingProps {
  dropData?: {
    id: string;
    amount: number;
    message: string;
    created_at: string;
    sender?: {
      display_name: string;
      avatar_url?: string;
    };
  };
  milestoneData?: {
    type: 'first_drop' | 'streak' | 'level_up' | 'big_drop';
    title: string;
    description: string;
    value: number;
  };
}

const SocialSharing = ({ dropData, milestoneData }: SocialSharingProps) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareData, setShareData] = useState<any>(null);

  useEffect(() => {
    if (dropData || milestoneData) {
      generateShareCard();
    }
  }, [dropData, milestoneData]);

  const generateShareCard = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1080;
    canvas.height = 1920; // Instagram Story aspect ratio

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e293b'); // brand-navy
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < canvas.width; i += 50) {
      for (let j = 0; j < canvas.height; j += 50) {
        ctx.fillRect(i, j, 1, 1);
      }
    }

    // Add logo
    const logoSize = 120;
    const logoX = (canvas.width - logoSize) / 2;
    const logoY = 200;
    
    // Create logo background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2 + 20, 0, 2 * Math.PI);
    ctx.fill();

    // Add logo text (simplified)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💰', logoX + logoSize/2, logoY + logoSize/2 + 15);

    // Add main content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    
    if (dropData) {
      // Drop sharing
      ctx.fillText(`₹${dropData.amount}`, canvas.width/2, 600);
      
      ctx.font = '36px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText('just dropped karma!', canvas.width/2, 680);
      
      if (dropData.message) {
        ctx.font = '28px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`"${dropData.message}"`, canvas.width/2, 750);
      }
    } else if (milestoneData) {
      // Milestone sharing
      ctx.fillText(milestoneData.title, canvas.width/2, 600);
      
      ctx.font = '36px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(milestoneData.description, canvas.width/2, 680);
      
      if (milestoneData.value) {
        ctx.font = '48px Arial';
        ctx.fillStyle = '#fbbf24'; // brand-yellow
        ctx.fillText(`${milestoneData.value}`, canvas.width/2, 750);
      }
    }

    // Add hashtag
    ctx.font = '24px Arial';
    ctx.fillStyle = '#ec4899'; // brand-pink
    ctx.fillText('#CashKarmaDropWeek', canvas.width/2, 900);

    // Add app branding
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('generosity, gamified', canvas.width/2, 1000);
    ctx.fillText('cashkarma.app', canvas.width/2, 1030);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setShareData({
          url,
          blob,
          text: generateShareText()
        });
      }
    }, 'image/png');

    setIsGenerating(false);
  };

  const generateShareText = () => {
    if (dropData) {
      return `Just dropped ₹${dropData.amount} of karma! ${dropData.message ? `"${dropData.message}"` : ''} 💰✨ #CashKarmaDropWeek #GenerosityGamified`;
    } else if (milestoneData) {
      return `🎉 ${milestoneData.title}: ${milestoneData.description} ${milestoneData.value}! #CashKarmaDropWeek #KarmaLegend`;
    }
    return 'Join the karma revolution! 💰✨ #CashKarmaDropWeek #GenerosityGamified';
  };

  const shareToInstagram = async () => {
    if (!shareData?.url) return;
    
    try {
      setIsSharing(true);
      
      // For Instagram, we need to download the image first
      const link = document.createElement('a');
      link.href = shareData.url;
      link.download = 'cash-karma-share.png';
      link.click();
      
      toast.success('Image downloaded!', {
        description: 'Open Instagram and share the downloaded image to your story.',
        duration: 5000,
      });
    } catch (error) {
      toast.error('Failed to share to Instagram');
    } finally {
      setIsSharing(false);
    }
  };

  const shareToTwitter = async () => {
    try {
      setIsSharing(true);
      
      const text = encodeURIComponent(shareData?.text || generateShareText());
      const url = encodeURIComponent('https://cashkarma.app');
      
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      
      toast.success('Opened Twitter!', {
        description: 'Your tweet is ready to share.',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Failed to share to Twitter');
    } finally {
      setIsSharing(false);
    }
  };

  const shareToWhatsApp = async () => {
    try {
      setIsSharing(true);
      
      const text = encodeURIComponent(shareData?.text || generateShareText());
      const url = encodeURIComponent('https://cashkarma.app');
      
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
      
      toast.success('Opened WhatsApp!', {
        description: 'Your message is ready to share.',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Failed to share to WhatsApp');
    } finally {
      setIsSharing(false);
    }
  };

  const shareToTikTok = async () => {
    try {
      setIsSharing(true);
      
      // TikTok doesn't have a direct share URL, so we'll copy the text
      await navigator.clipboard.writeText(shareData?.text || generateShareText());
      
      toast.success('Text copied!', {
        description: 'Paste this in your TikTok video description.',
        duration: 5000,
      });
    } catch (error) {
      toast.error('Failed to copy text');
    } finally {
      setIsSharing(false);
    }
  };

  const useWebShareAPI = async () => {
    if (!navigator.share) {
      toast.error('Web Share API not supported', {
        description: 'Try using one of the other share options.',
      });
      return;
    }

    try {
      setIsSharing(true);
      
      await navigator.share({
        title: 'Cash Karma',
        text: shareData?.text || generateShareText(),
        url: 'https://cashkarma.app',
      });
      
      toast.success('Shared successfully!');
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareData?.text || generateShareText());
      setCopied(true);
      toast.success('Text copied to clipboard!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const downloadImage = () => {
    if (!shareData?.url) return;
    
    const link = document.createElement('a');
    link.href = shareData.url;
    link.download = 'cash-karma-share.png';
    link.click();
    
    toast.success('Image downloaded!');
  };

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Generating your share card...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Karma
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Canvas for generating image */}
          <canvas
            ref={canvasRef}
            className="hidden"
            style={{ display: 'none' }}
          />
          
          {/* Preview placeholder */}
          <div className="aspect-[9/16] bg-gradient-to-br from-brand-navy to-brand-navy/80 rounded-lg border-2 border-brand-pink/30 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-brand-pink to-brand-yellow rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-white">
                <h3 className="text-xl font-bold">
                  {dropData ? `₹${dropData.amount}` : milestoneData?.title || 'Karma Drop'}
                </h3>
                <p className="text-sm opacity-80">
                  {dropData ? 'just dropped karma!' : milestoneData?.description || 'Share your generosity'}
                </p>
              </div>
              <div className="text-brand-pink text-sm font-medium">
                #CashKarmaDropWeek
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Share to Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={shareToInstagram}
              disabled={isSharing}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Instagram className="w-5 h-5 text-pink-500" />
              <span className="text-xs">Instagram Story</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={shareToTwitter}
              disabled={isSharing}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Twitter className="w-5 h-5 text-blue-500" />
              <span className="text-xs">X (Twitter)</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={shareToWhatsApp}
              disabled={isSharing}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <MessageCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={shareToTikTok}
              disabled={isSharing}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Music className="w-5 h-5 text-black" />
              <span className="text-xs">TikTok</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={useWebShareAPI}
              disabled={isSharing}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Native Share
            </Button>
            
            <Button
              variant="outline"
              onClick={copyShareText}
              disabled={isSharing}
              className="flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </Button>
            
            <Button
              variant="outline"
              onClick={downloadImage}
              disabled={isSharing}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hashtag Campaign */}
      <Card className="bg-gradient-to-r from-brand-pink/10 to-brand-yellow/10 border-brand-pink/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">#CashKarmaDropWeek</h3>
            <p className="text-muted-foreground text-sm">
              Join the movement! Share your drops and tag us for a chance to be featured.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">#CashKarmaDropWeek</Badge>
              <Badge variant="secondary">#GenerosityGamified</Badge>
              <Badge variant="secondary">#KarmaLegend</Badge>
              <Badge variant="secondary">#GoodVibesOnly</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialSharing; 