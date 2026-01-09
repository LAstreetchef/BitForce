import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Package, 
  ArrowLeft, 
  LogIn, 
  Search, 
  Shield, 
  Lock, 
  Star,
  MessageSquareQuote,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { 
  products, 
  testimonials, 
  faqs, 
  comparisonFeatures, 
  categories,
  type Product 
} from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { BreachScannerModal } from "@/components/BreachScannerModal";
import { useToast } from "@/hooks/use-toast";

export default function PublicProducts() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const handleLearnMore = (product: Product) => {
    if (product.hasInteractiveFeature && product.id === "security-scanner") {
      setScannerOpen(true);
    } else {
      toast({
        title: "Coming Soon!",
        description: `We'll help you get started with ${product.name}. Contact us to learn more!`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-public-products">
      <header className="border-b bg-background sticky top-0 z-50">
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
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Our Services</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mb-6">
            We help everyday people with technology - from backing up family photos to setting up smart home devices. 
            Patient, friendly support with no tech jargon!
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 dark:bg-accent/20 px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Privacy Guaranteed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 dark:bg-accent/20 px-3 py-1.5 rounded-full">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 dark:bg-accent/20 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-products"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`button-filter-${category.id}`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-16" data-testid="grid-products">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onShare={handleShareProduct}
              onLearnMore={handleLearnMore}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No services match your search. Try different keywords.</p>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">Compare Our Services</h2>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <Badge className="bg-blue-600 text-white">Popular</Badge>
                        <span className="text-sm">Monthly</span>
                      </div>
                    </th>
                    <th className="text-center p-4 font-semibold">
                      <span className="text-sm">Single Session</span>
                    </th>
                    <th className="text-center p-4 font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <Badge className="bg-green-600 text-white">Best Value</Badge>
                        <span className="text-sm">Bundle</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="p-4 font-medium text-muted-foreground">{row.feature}</td>
                      <td className="p-4 text-center">{row.subscription}</td>
                      <td className="p-4 text-center">{row.session}</td>
                      <td className="p-4 text-center">{row.bundle}</td>
                    </tr>
                  ))}
                  <tr className="bg-accent/30 dark:bg-accent/10">
                    <td className="p-4 font-semibold">Price</td>
                    <td className="p-4 text-center font-bold text-primary">$29/mo</td>
                    <td className="p-4 text-center font-bold text-primary">$79</td>
                    <td className="p-4 text-center font-bold text-primary">$199</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquareQuote className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">What Our Customers Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover-elevate" data-testid={`card-testimonial-${testimonial.id}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <Badge variant="secondary">{testimonial.product}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} data-testid={`accordion-faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Choose the service that's right for you and get the tech help you deserve. 
            Our friendly AI Buddies are ready to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => handleLearnMore(products[0])} data-testid="button-get-started">
              Get Started Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/events">
              <Button size="lg" variant="outline" data-testid="button-become-ambassador">
                Become an Ambassador
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambassador CTA */}
        <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Interested in Becoming an AI Buddy?</h2>
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

      <footer className="border-t bg-background py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold">Bitforce AI Buddies</p>
              <p className="text-sm text-muted-foreground">Your Personal AI & Technology Concierge</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Privacy Policy</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                <span>Terms of Service</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Breach Scanner Modal */}
      <BreachScannerModal open={scannerOpen} onOpenChange={setScannerOpen} />
    </div>
  );
}
