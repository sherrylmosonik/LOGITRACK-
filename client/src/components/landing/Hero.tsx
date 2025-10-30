import { Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Warehouse_logistics_operation_scene_f1bac98c.png";

export default function Hero() {
  return (
    <section className="container mx-auto px-6 py-20 md:py-32">
      <div className="grid md:grid-template-columns-[1fr_480px] gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-primary">Smart logistics · Mobile & Web</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            LogiTrack — Fast,<br />
            transparent deliveries<br />
            with live tracking
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Manage shipments, track drivers in real-time and accept payments on delivery. Designed for shippers, dispatchers and drivers.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="text-base gap-2" onClick={() => window.location.href = '/signup'}>
              <Package className="w-5 h-5" />
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-base gap-2" onClick={() => window.location.href = '#how-it-works'}>
              <TrendingUp className="w-5 h-5" />
              Learn More
            </Button>
          </div>

          <div className="pt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-semibold">
                  {i}
                </div>
              ))}
            </div>
            <span>Trusted by 50+ regional carriers</span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={heroImage} 
              alt="Modern logistics warehouse with organized parcels"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-lg border">
            <div className="text-sm text-muted-foreground">Live Tracking</div>
            <div className="text-2xl font-bold">Real-Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}
