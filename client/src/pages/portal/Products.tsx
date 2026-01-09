import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { products, type Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const { toast } = useToast();

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onShare={handleShareProduct}
          />
        ))}
      </div>
    </div>
  );
}
