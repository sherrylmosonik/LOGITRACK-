import { MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Vehicle {
  id: number;
  plateNumber: string;
  status: string;
  currentDriverId: number | null;
  lastLat: string | null;
  lastLng: string | null;
}

interface FleetMapProps {
  vehicles: Vehicle[];
}

export default function FleetMap({ vehicles }: FleetMapProps) {
  const activeVehicles = vehicles.filter(v => v.status === 'in_use' && v.lastLat && v.lastLng);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Fleet Tracking</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Navigation className="w-4 h-4" />
          <span>{activeVehicles.length} vehicles active</span>
        </div>
      </div>
      
      <div className="relative bg-muted/30 rounded-lg h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(0deg, hsl(var(--muted-foreground)) 0px, hsl(var(--muted-foreground)) 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, hsl(var(--muted-foreground)) 0px, hsl(var(--muted-foreground)) 1px, transparent 1px, transparent 40px)`
        }}></div>
        
        <div className="relative z-10 text-center space-y-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {activeVehicles.slice(0, 8).map((vehicle, idx) => (
              <div
                key={vehicle.id}
                className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border shadow-sm"
                style={{
                  position: 'relative',
                  left: `${(idx % 3) * 60 - 60}px`,
                  top: `${Math.floor(idx / 3) * 80 - 80}px`,
                }}
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{vehicle.plateNumber}</span>
              </div>
            ))}
          </div>
          {activeVehicles.length === 0 && (
            <p className="text-muted-foreground">No active vehicles</p>
          )}
        </div>
      </div>
    </Card>
  );
}
