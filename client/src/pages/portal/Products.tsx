import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Star, Check, ExternalLink, Sparkles, Users, Clock, Repeat, DollarSign, Crown, Zap, Gift } from "lucide-react";
import { products, type Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Products() {
  const { toast } = useToast();

  const featuredProduct = products.find((p) => p.id === "bitforce-saver");

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

      {featuredProduct && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 via-purple-500 to-amber-500 animate-[gradient-x_3s_ease_infinite] bg-[length:200%_200%]" />
          
          <Card 
            className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-purple-500/5 border-0"
            data-testid="card-featured-product"
          >
            <div className="flex flex-col lg:flex-row relative">
              <div className="lg:w-2/5 relative overflow-hidden">
                <motion.img 
                  src={featuredProduct.image} 
                  alt={featuredProduct.name}
                  className="w-full h-64 lg:h-full object-cover"
                  data-testid="img-featured-product"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <motion.div
                    animate={{ 
                      y: [0, -4, 0],
                      scale: [1, 1.05, 1],
                      opacity: [1, 0.9, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-50 animate-pulse" />
                    <Badge className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-3 py-1">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured Product
                    </Badge>
                  </motion.div>
                  
                  <motion.div
                    animate={{ 
                      y: [0, -3, 0],
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3
                    }}
                  >
                    <Badge className="bg-purple-600 text-white border-purple-600 shadow-md">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {featuredProduct.badge}
                    </Badge>
                  </motion.div>
                </div>
              </div>
              
              <CardContent className="flex-1 p-6 lg:p-8 flex flex-col justify-center relative">
                <div className="space-y-4">
                  <div>
                    <motion.h2 
                      className="text-2xl lg:text-3xl font-bold text-foreground" 
                      data-testid="text-featured-name"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      {featuredProduct.name}
                    </motion.h2>
                    <motion.p 
                      className="text-lg text-primary font-medium mt-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {featuredProduct.tagline}
                    </motion.p>
                  </div>

                  <motion.div 
                    className="flex items-baseline gap-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <span className="text-3xl font-bold text-primary">{featuredProduct.price}</span>
                    <span className="text-muted-foreground">{featuredProduct.priceDetail}</span>
                  </motion.div>

                  <p className="text-muted-foreground text-base">
                    {featuredProduct.valueProposition}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {featuredProduct.bestFor.map((tag, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.2 }}
                      >
                        <Badge 
                          variant="secondary" 
                          className="text-sm"
                        >
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {featuredProduct.features.map((feature, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-start gap-2 text-sm"
                        data-testid={`text-featured-feature-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05, duration: 0.2 }}
                      >
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        <span>{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-3 pt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    <motion.div
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        size="lg"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg"
                        onClick={() => window.open(featuredProduct.externalUrl, '_blank', 'noopener,noreferrer')}
                        data-testid="button-featured-access"
                      >
                        Access BitForce Saver
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        size="lg"
                        variant="outline"
                        onClick={() => handleShareProduct(featuredProduct)}
                        data-testid="button-featured-share"
                      >
                        Share with Customer
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-3 rounded-md mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.3 }}
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{featuredProduct.commissionInfo}</span>
                  </motion.div>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div 
        className="pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        data-testid="section-plan-comparison"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2" data-testid="text-comparison-title">Choose Your AI Buddy Plan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three simple options to match your customer's needs. Compare features and help them pick the perfect fit.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {products
            .filter((p) => ["monthly-subscription", "one-time-session", "bundle-package"].includes(p.id))
            .sort((a, b) => {
              const order = ["monthly-subscription", "one-time-session", "bundle-package"];
              return order.indexOf(a.id) - order.indexOf(b.id);
            })
            .map((product, index) => {
              const isPopular = product.badgeType === "popular";
              const isBestValue = product.badgeType === "bestValue";
              const Icon = product.id === "monthly-subscription" ? Repeat : product.id === "one-time-session" ? Clock : Gift;
              const commissionAmount = product.commissionInfo.replace("Earn ", "").replace(" commission", "").replace(" per session sold", "").replace(" per bundle sold", "");
              const commissionNote = isPopular ? "Builds over time!" : isBestValue ? "Highest payout!" : "Great for quick sales";
              const ctaText = isPopular ? "Best for ongoing support" : isBestValue ? "Best value overall" : "Best for single issues";
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="relative"
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-primary text-white border-0 shadow-lg px-3 py-1" data-testid={`badge-popular-${product.id}`}>
                        <Crown className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {isBestValue && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-green-600 text-white border-0 shadow-lg px-3 py-1" data-testid={`badge-value-${product.id}`}>
                        <Zap className="w-3 h-3 mr-1" />
                        Best Value
                      </Badge>
                    </div>
                  )}
                  
                  <Card 
                    className={`h-full ${isPopular ? 'ring-2 ring-primary shadow-lg' : ''} ${isBestValue ? 'ring-2 ring-green-600 shadow-lg' : ''}`}
                    data-testid={`card-plan-${product.id}`}
                  >
                    <CardHeader className="pb-2 pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-lg ${isPopular ? 'bg-primary/10' : isBestValue ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                          <Icon className={`w-5 h-5 ${isPopular ? 'text-primary' : isBestValue ? 'text-green-600' : 'text-muted-foreground'}`} />
                        </div>
                        <CardTitle className="text-lg" data-testid={`text-plan-name-${product.id}`}>{product.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-plan-tagline-${product.id}`}>{product.tagline}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-baseline gap-1">
                        <span 
                          className={`text-3xl font-bold ${isPopular ? 'text-primary' : isBestValue ? 'text-green-600' : ''}`}
                          data-testid={`text-plan-price-${product.id}`}
                        >
                          {product.price}
                        </span>
                        <span className="text-muted-foreground text-sm" data-testid={`text-plan-price-detail-${product.id}`}>{product.priceDetail}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {product.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm" data-testid={`text-plan-feature-${product.id}-${idx}`}>
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-primary' : isBestValue ? 'text-green-600' : 'text-green-600'}`} />
                            <span>{feature.text}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Best for:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.bestFor.map((type, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs" data-testid={`badge-bestfor-${product.id}-${idx}`}>
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div 
                        className={`p-3 rounded-lg ${isPopular ? 'bg-primary/5' : isBestValue ? 'bg-green-50 dark:bg-green-950/30' : 'bg-muted/50'}`}
                        data-testid={`block-commission-${product.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className={`w-4 h-4 ${isPopular ? 'text-primary' : isBestValue ? 'text-green-600' : 'text-muted-foreground'}`} />
                          <div>
                            <p 
                              className={`font-semibold text-sm ${isPopular ? 'text-primary' : isBestValue ? 'text-green-600' : ''}`}
                              data-testid={`text-plan-commission-${product.id}`}
                            >
                              Earn {commissionAmount}
                            </p>
                            <p className="text-xs text-muted-foreground">{commissionNote}</p>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-center text-xs text-muted-foreground font-medium pt-2" data-testid={`text-plan-cta-${product.id}`}>
                        {ctaText}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            <Users className="w-4 h-4 inline-block mr-1" />
            All plans include patient, friendly support in plain language - no tech jargon!
          </p>
        </div>
      </motion.div>

      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-4" data-testid="text-all-products-title">All Products</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products
            .filter((product) => product.category !== "health" && product.id !== "bitforce-saver")
            .map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onShare={handleShareProduct}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
