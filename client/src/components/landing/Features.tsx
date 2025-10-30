import { Package, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Package,
    title: "Parcel & last-mile delivery",
    description: "Pickup scheduling, proof-of-delivery and customer notifications for fast deliveries.",
  },
  {
    icon: MapPin,
    title: "Route optimization",
    description: "Optimize driver routes to reduce fuel and time — integrates with maps for routing and ETA.",
  },
  {
    icon: Users,
    title: "Fleet & personnel management",
    description: "Driver assignments, shift management and role-based access controls for teams.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-muted/30" id="services">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Services we offer
          </h2>
          <p className="text-lg text-muted-foreground">
            Flexible services tailored to different business needs: last-mile delivery, B2B logistics and fleet operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 hover-elevate transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
