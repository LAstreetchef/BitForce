import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Play, FileVideo, ArrowLeft, Loader2, Sparkles, Film } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import tokenRewardsVideo from "@assets/generated_videos/shiny_reward_tokens_appearing_magically.mp4";
import tokensGrowingVideo from "@assets/generated_videos/tokens_growing_bigger_and_multiplying.mp4";
import celebrationVideo from "@assets/generated_videos/celebration_with_valuable_coin_treasure.mp4";
import lemonadeStandVideo from "@assets/generated_videos/neighborhood_lemonade_stand_scene.mp4";

const videos = [
  {
    id: 1,
    title: "1. The Neighborhood Stand",
    description: "Intro scene - A colorful neighborhood with a welcoming lemonade stand",
    src: lemonadeStandVideo,
    filename: "neighborhood_lemonade_stand_scene.mp4",
    scriptLine: "Imagine you help your neighbors find the best lemonade stand in town..."
  },
  {
    id: 2,
    title: "2. Earning Reward Tokens",
    description: "Golden coins and tokens floating with sparkles - earning rewards",
    src: tokenRewardsVideo,
    filename: "shiny_reward_tokens_appearing_magically.mp4",
    scriptLine: "Every time you bring a new customer, you get special gold coins!"
  },
  {
    id: 3,
    title: "3. Tokens Growing in Value",
    description: "Coins multiplying and growing larger - showing how value increases",
    src: tokensGrowingVideo,
    filename: "tokens_growing_bigger_and_multiplying.mp4",
    scriptLine: "The more kids who join and help, the more valuable everyone's coins become."
  },
  {
    id: 4,
    title: "4. Success Celebration",
    description: "Confetti and treasure chest overflowing with coins - the payoff",
    src: celebrationVideo,
    filename: "celebration_with_valuable_coin_treasure.mp4",
    scriptLine: "It's like a team game where everyone wins together!"
  }
];

const fullScript = `"Imagine you help your neighbors find the best lemonade stand in town. Every time you bring a new customer, you get special gold coins! The cool part? The more kids who join and help, the more valuable everyone's coins become. That's how BFT works - you help people find great services, earn tokens, and as the team grows, your tokens become worth more. It's like a team game where everyone wins together!"`;

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

  const handleDownload = (src: string, filename: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <FileVideo className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">BFT Explainer Video</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kid-friendly explainer video about how and why ambassadors earn BFT tokens. 
            Get the complete video with captions and background music, or download individual clips.
          </p>
        </div>

        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-6 h-6 text-primary" />
              Complete Explainer Video
            </CardTitle>
            <CardDescription>
              All 4 clips combined with captions and cinematic background music (~24 seconds)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {combinedVideoExists ? (
              <>
                <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                  <video
                    src="/attached_assets/generated_videos/bft_explainer_complete.mp4"
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
                    onClick={() => handleDownload("/attached_assets/generated_videos/bft_explainer_complete.mp4", "bft_explainer_complete.mp4")}
                    data-testid="button-download-combined"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Complete Video
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
                    Click below to automatically combine all clips, add captions, and include background music.
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
                      Create Complete Video
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Voiceover Script (for 11-year-olds)
            </CardTitle>
            <CardDescription>The captions that appear in the combined video</CardDescription>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
              {fullScript}
            </blockquote>
            <p className="text-sm text-muted-foreground mt-4">
              Duration: ~24 seconds with captions synced to each clip
            </p>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4">Individual Video Clips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{video.title}</CardTitle>
                <CardDescription>{video.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                  <video
                    src={video.src}
                    controls
                    className="w-full h-full object-contain"
                    data-testid={`video-clip-${video.id}`}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm italic text-muted-foreground">
                    "{video.scriptLine}"
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownload(video.src, video.filename)}
                  data-testid={`button-download-${video.id}`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Clip
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
