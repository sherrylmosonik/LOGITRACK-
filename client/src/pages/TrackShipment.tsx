import { useState } from "react";
import { Package, Search, MapPin, CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function TrackShipment() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchedTrackingNumber, setSearchedTrackingNumber] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/shipments/tracking', searchedTrackingNumber],
    enabled: !!searchedTrackingNumber,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedTrackingNumber(trackingNumber);
  };

  const shipment = data?.shipment;
  const events = data?.events || [];

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      created: Clock,
      assigned: Truck,
      picked_up: Package,
      in_transit: MapPin,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      assigned: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      in_transit: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      delivered: "bg-green-500/10 text-green-700 dark:text-green-400",
      cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
    };
    return colors[status] || "bg-gray-500/10";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Package className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">LogiTrack</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Track Your Shipment</h1>
            <p className="text-muted-foreground">Enter your tracking number to see real-time updates</p>
          </div>

          <Card className="p-6 mb-8">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter tracking number (e.g., TN123456)"
                  className="pl-10 h-12"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  data-testid="input-tracking"
                />
              </div>
              <Button type="submit" size="lg" className="gap-2" data-testid="button-track">
                <Search className="w-5 h-5" />
                Track
              </Button>
            </form>
          </Card>

          {isLoading && (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                Searching for shipment...
              </div>
            </Card>
          )}

          {error && (
            <Card className="p-12">
              <div className="text-center space-y-3">
                <XCircle className="w-16 h-16 text-destructive mx-auto" />
                <h3 className="text-lg font-semibold">Shipment Not Found</h3>
                <p className="text-muted-foreground">
                  We couldn't find a shipment with tracking number "{searchedTrackingNumber}"
                </p>
              </div>
            </Card>
          )}

          {shipment && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{shipment.trackingNumber}</h2>
                    <p className="text-muted-foreground">
                      Recipient: {shipment.recipientName}
                    </p>
                  </div>
                  <Badge className={getStatusColor(shipment.status)} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                    {shipment.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Pickup Address</p>
                      <p className="text-sm">{shipment.pickupAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Delivery Address</p>
                      <p className="text-sm">{shipment.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Recipient Contact</p>
                      <p className="text-sm">{shipment.recipientPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Payment</p>
                      <p className="text-sm capitalize">{shipment.paymentMethod.replace('_', ' ')} · KES {shipment.amount}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Shipment Timeline</h3>
                <div className="space-y-6">
                  {events.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No tracking events yet</p>
                  ) : (
                    events.map((event, index) => {
                      const Icon = getStatusIcon(event.eventType);
                      const isLast = index === events.length - 1;
                      
                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-primary' : 'bg-muted'
                            }`}>
                              <Icon className={`w-5 h-5 ${index === 0 ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                            </div>
                            {!isLast && (
                              <div className="w-px h-12 bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <p className="font-semibold mb-1">{event.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.createdAt).toLocaleString()}
                            </p>
                            {event.location && (
                              <p className="text-sm text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
