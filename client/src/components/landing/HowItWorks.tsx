import { Building2, Settings, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";

const userTypes = [
  {
    icon: Building2,
    role: "Shippers / Clients",
    steps: "Request a pickup → Choose pay-on-delivery or prepaid → Track delivery and get proof of delivery.",
  },
  {
    icon: Settings,
    role: "Dispatchers / Admins",
    steps: "Create shipments → assign drivers → monitor live fleet telemetry and export reports.",
  },
  {
    icon: Truck,
    role: "Drivers / Personnel",
    steps: "Receive assignments → navigate optimized routes → confirm deliveries and collect payments.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20" id="how-it-works">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How the app works — by user
          </h2>
          <p className="text-lg text-muted-foreground">
            Three tailored experiences for the people who use LogiTrack every day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => (
            <Card 
              key={index}
              className="p-6 hover-elevate transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <type.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-3">{type.role}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{type.steps}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
