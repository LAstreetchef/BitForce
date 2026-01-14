import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Play, FileVideo, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

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
            <h1 className="text-3xl font-bold">BFT Explainer Video Clips</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kid-friendly video clips explaining how and why ambassadors earn BFT tokens. 
            Download these clips and combine them with the voiceover script below.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Voiceover Script (for 11-year-olds)
            </CardTitle>
            <CardDescription>Read this script while playing the video clips in order</CardDescription>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
              {fullScript}
            </blockquote>
            <p className="text-sm text-muted-foreground mt-4">
              Duration: ~30-45 seconds when read at a natural pace
            </p>
          </CardContent>
        </Card>

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

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Create Your Final Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Download all 4 video clips above</li>
              <li>Record yourself (or have someone) read the voiceover script</li>
              <li>Use a video editor (like iMovie, CapCut, or Canva) to combine clips with audio</li>
              <li>Add the clips in order (1-4) matching the script sections</li>
              <li>Export and share your explainer video</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
