import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Loader2, Sparkles, Film } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ExplainerVideos() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [combinedVideoExists, setCombinedVideoExists] = useState(false);

  useEffect(() => {
    checkVideoStatus();
  }, []);

  const checkVideoStatus = async () => {
    try {
      const response = await fetch("/api/video/explainer-status");
      const data = await response.json();
      setCombinedVideoExists(data.exists);
    } catch (err) {
      console.error("Failed to check video status:", err);
    }
  };

  const handleCombineVideos = async () => {
    setIsProcessing(true);
    toast({
      title: "Processing Video",
      description: "Combining clips, adding captions and music. This may take a minute...",
    });

    try {
      const response = await apiRequest("POST", "/api/video/combine-explainer");
      const data = await response.json();
      
      if (data.success) {
        setCombinedVideoExists(true);
        toast({
          title: "Video Ready!",
          description: "Your combined explainer video is ready to download.",
        });
      } else {
        throw new Error(data.message || "Failed to combine videos");
      }
    } catch (err: any) {
      toast({
        title: "Processing Failed",
        description: err.message || "Could not combine videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = "/api/video/explainer-complete";
    link.download = "bft_explainer_complete.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Film className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">BFT Explainer Video</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn how ambassadors earn BFT tokens by helping neighbors find the services they need.
          </p>
        </div>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-6 h-6 text-primary" />
              Complete Explainer Video
            </CardTitle>
            <CardDescription>
              Full video with captions and background music (~24 seconds)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {combinedVideoExists ? (
              <>
                <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                  <video
                    src="/api/video/explainer-complete"
                    controls
                    className="w-full h-full object-contain"
                    data-testid="video-combined"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={handleDownload}
                    data-testid="button-download-combined"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Video
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleCombineVideos}
                    disabled={isProcessing}
                    data-testid="button-regenerate"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-muted/50 rounded-lg p-8 mb-4">
                  <Sparkles className="w-12 h-12 mx-auto text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Create Your Video?</h3>
                  <p className="text-muted-foreground mb-4">
                    Click below to generate the complete explainer video with captions and music.
                  </p>
                </div>
                <Button 
                  size="lg"
                  onClick={handleCombineVideos}
                  disabled={isProcessing}
                  data-testid="button-combine-videos"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Video...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Video
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
