import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Shield, Scan, CheckCircle } from "lucide-react";
import { products, type Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { BreachScannerModal } from "@/components/BreachScannerModal";

export default function Products() {
  const { toast } = useToast();
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleShareProduct = async (product: Product) => {
    const shareText = `Check out ${product.name}! ${product.tagline} - Only ${product.price} (${product.priceDetail}). ${product.valueProposition}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: shareText,
        });
        toast({
          title: "Shared successfully!",
          description: "Product info shared with your customer.",
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard!",
          description: "Product info ready to share with your customer.",
        });
      } else {
        toast({
          title: "Share text",
          description: shareText,
        });
      }
    } catch {
      toast({
        title: "Product info",
        description: shareText,
      });
    }
  };

  return (
    <div className="space-y-6" data-testid="page-products">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Featured Products</h1>
          <Badge variant="secondary">Core Offerings</Badge>
        </div>
        <p className="text-muted-foreground">
          Our AI Buddy services are 100% in-house, sold through dedicated ambassadors. 
          Help others and get paid to learn AI!
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10" data-testid="card-scanner-tool">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Digital Footprint Scanner
                  <Badge variant="secondary">Ambassador Tool</Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  Help customers check if their email has been exposed in data breaches
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={() => setScannerOpen(true)}
              className="gap-2"
              data-testid="button-launch-scanner"
            >
              <Scan className="w-4 h-4" />
              Launch Scanner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Breach Detection</p>
                <p className="text-xs text-muted-foreground">Scan emails against known data breaches</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Password Checker</p>
                <p className="text-xs text-muted-foreground">Check if passwords have been compromised</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Security Recommendations</p>
                <p className="text-xs text-muted-foreground">Get actionable tips to improve security</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
            Use this tool during customer conversations to demonstrate value and build trust. 
            Great for identifying customers who may benefit from our security services.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onShare={handleShareProduct}
          />
        ))}
      </div>

      <BreachScannerModal 
        open={scannerOpen} 
        onOpenChange={setScannerOpen} 
      />
    </div>
  );
}
