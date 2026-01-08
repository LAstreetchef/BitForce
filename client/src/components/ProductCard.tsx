import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, DollarSign, Share2 } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onShare?: (product: Product) => void;
}

export function ProductCard({ product, onShare }: ProductCardProps) {
  return (
    <Card 
      className="overflow-visible flex flex-col h-full"
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
          data-testid={`img-product-${product.id}`}
        />
        {product.badge && (
          <Badge 
            className="absolute top-3 right-3 bg-primary text-primary-foreground"
            data-testid={`badge-product-${product.id}`}
          >
            {product.badge}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="font-bold text-lg" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.tagline}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
              {product.price}
            </div>
            <div className="text-xs text-muted-foreground">{product.priceDetail}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{product.description}</p>
        
        <div className="bg-accent/50 dark:bg-accent/20 p-3 rounded-md">
          <p className="text-sm font-medium">{product.valueProposition}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">What's Included:</h4>
          <ul className="space-y-1">
            {product.features.map((feature, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 text-sm"
                data-testid={`text-feature-${product.id}-${index}`}
              >
                <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto pt-4 border-t space-y-3">
          <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-2 rounded-md">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">{product.commissionInfo}</span>
          </div>
          
          {onShare && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onShare(product)}
              data-testid={`button-share-${product.id}`}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share with Customer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
