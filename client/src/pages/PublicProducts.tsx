import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft, LogIn } from "lucide-react";
import { products, type Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";

export default function PublicProducts() {
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
          description: "Product info shared.",
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard!",
          description: "Product info ready to share.",
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950" data-testid="page-public-products">
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <Link href="/" data-testid="link-logo-home">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                B
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Bit Force
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/api/login">
              <Button size="sm" data-testid="button-login">
                <LogIn className="w-4 h-4 mr-2" />
                Ambassador Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Our Services</h1>
            <Badge variant="secondary">AI Buddy Services</Badge>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            We help everyday people with technology - from backing up family photos to setting up smart home devices. 
            Patient, friendly support with no tech jargon!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="grid-products">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onShare={handleShareProduct}
            />
          ))}
        </div>

        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Interested in becoming an AI Buddy?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join our team of ambassadors and earn while helping others with technology. 
            No tech degree required - just patience and a desire to help!
          </p>
          <Link href="/events">
            <Button size="lg" data-testid="button-learn-more">
              Learn About Joining
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t bg-white dark:bg-slate-900 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Bitforce AI Buddies - Your Personal AI & Technology Concierge</p>
        </div>
      </footer>
    </div>
  );
}
