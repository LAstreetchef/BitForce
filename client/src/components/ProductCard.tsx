import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, DollarSign, Share2, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onShare?: (product: Product) => void;
  onLearnMore?: (product: Product) => void;
}

export function ProductCard({ product, onShare, onLearnMore }: ProductCardProps) {
  const getBadgeStyles = () => {
    switch (product.badgeType) {
      case "popular":
        return "bg-blue-600 text-white border-blue-600";
      case "bestValue":
        return "bg-green-600 text-white border-green-600";
      case "new":
        return "bg-purple-600 text-white border-purple-600";
      case "included":
        return "bg-amber-500 text-white border-amber-500";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <Card 
      className="overflow-visible flex flex-col h-full hover-elevate transition-all duration-300"
      data-testid={`card-product-${product.id}`}
    >
      <div className={`relative ${product.category === "concierge" ? "bg-slate-100 dark:bg-slate-800" : ""}`}>
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-48 rounded-t-md ${product.category === "concierge" ? "object-contain p-2" : "object-cover"}`}
          data-testid={`img-product-${product.id}`}
        />
        {product.badge && (
          <Badge 
            className={`absolute top-3 right-3 ${getBadgeStyles()} shadow-md`}
            data-testid={`badge-product-${product.id}`}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            {product.badge}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{product.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
              {product.price}
            </div>
            <div className="text-xs text-muted-foreground">{product.priceDetail}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mt-3">
          {product.bestFor.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs font-normal"
              data-testid={`badge-bestfor-${product.id}-${index}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{product.description}</p>
        
        <div className="bg-accent/50 dark:bg-accent/20 p-3 rounded-md">
          <p className="text-sm italic text-muted-foreground">{product.backstory}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">What's Included:</h4>
          <ul className="space-y-1.5">
            {product.features.slice(0, 4).map((feature, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 text-sm"
                data-testid={`text-feature-${product.id}-${index}`}
              >
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto pt-4 border-t space-y-3">
          <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-2 rounded-md">
            <DollarSign className="w-4 h-4 shrink-0" />
            <span className="font-medium">{product.commissionInfo}</span>
          </div>
          
          <div className="flex gap-2">
            {product.externalUrl ? (
              <Button 
                className="flex-1"
                onClick={() => window.open(product.externalUrl, '_blank', 'noopener,noreferrer')}
                data-testid={`button-access-${product.id}`}
              >
                Access Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            ) : onLearnMore && (
              <Button 
                className="flex-1"
                onClick={() => onLearnMore(product)}
                data-testid={`button-learn-more-${product.id}`}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            {onShare && (
              <Button 
                variant="outline"
                size="icon"
                onClick={() => onShare(product)}
                data-testid={`button-share-${product.id}`}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
