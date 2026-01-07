import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2, Download, RefreshCw, Home, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DesignOptions {
  styles: string[];
  roomTypes: string[];
}

interface GeneratedDesign {
  b64_json: string;
  mimeType: string;
  roomType: string;
  style: string;
}

interface DesignVisualizationProps {
  leadId?: number;
  leadName?: string;
  onDesignGenerated?: () => void;
}

export function DesignVisualization({ leadId, leadName, onDesignGenerated }: DesignVisualizationProps) {
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [generatedDesign, setGeneratedDesign] = useState<GeneratedDesign | null>(null);

  const { data: options, isLoading: optionsLoading } = useQuery<DesignOptions>({
    queryKey: ["/api/design-options"],
  });

  const generateMutation = useMutation({
    mutationFn: async (params: { roomType: string; style: string; additionalDetails?: string }) => {
      const response = await apiRequest("POST", "/api/generate-renovation-design", params);
      return response.json();
    },
    onSuccess: async (data: GeneratedDesign) => {
      setGeneratedDesign(data);
      
      // Track design generation for gamification points
      try {
        await apiRequest("POST", "/api/design-generated", {
          leadId,
          roomType: data.roomType,
          style: data.style,
        });
      } catch (e) {
        console.error("Failed to track design generation:", e);
      }
      
      onDesignGenerated?.();
      toast({
        title: "Design Generated (+15 points)",
        description: `${formatLabel(data.roomType)} with ${formatLabel(data.style)} style is ready!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate design. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!selectedRoom || !selectedStyle) {
      toast({
        title: "Select Options",
        description: "Please select both a room type and design style.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      roomType: selectedRoom,
      style: selectedStyle,
      additionalDetails: additionalDetails || undefined,
    });
  };

  const handleDownload = () => {
    if (!generatedDesign) return;

    const link = document.createElement("a");
    link.href = `data:${generatedDesign.mimeType};base64,${generatedDesign.b64_json}`;
    link.download = `${generatedDesign.roomType}-${generatedDesign.style}-design.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "Design image saved to your device.",
    });
  };

  const formatLabel = (str: string) => {
    return str
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (optionsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <CardTitle>AI Design Visualization</CardTitle>
          </div>
          {leadName && (
            <Badge variant="secondary">{leadName}</Badge>
          )}
        </div>
        <CardDescription>
          Generate renovation concept images to show customers what their space could look like
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4" />
              Room Type
            </label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger data-testid="select-room-type">
                <SelectValue placeholder="Select room..." />
              </SelectTrigger>
              <SelectContent>
                {options?.roomTypes.map((room) => (
                  <SelectItem key={room} value={room}>
                    {formatLabel(room)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Design Style
            </label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger data-testid="select-design-style">
                <SelectValue placeholder="Select style..." />
              </SelectTrigger>
              <SelectContent>
                {options?.styles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {formatLabel(style)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Details (optional)</label>
          <Textarea
            placeholder="E.g., Include a kitchen island, use marble countertops, add pendant lighting..."
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="resize-none"
            rows={3}
            data-testid="input-additional-details"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !selectedRoom || !selectedStyle}
          className="w-full"
          data-testid="button-generate-design"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Design...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Design
            </>
          )}
        </Button>

        {generatedDesign && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Badge>{formatLabel(generatedDesign.roomType)}</Badge>
                <Badge variant="outline">{formatLabel(generatedDesign.style)}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  data-testid="button-regenerate"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  data-testid="button-download-design"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
            <div className="rounded-md overflow-hidden border">
              <img
                src={`data:${generatedDesign.mimeType};base64,${generatedDesign.b64_json}`}
                alt={`${generatedDesign.roomType} with ${generatedDesign.style} design`}
                className="w-full h-auto"
                data-testid="img-generated-design"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
