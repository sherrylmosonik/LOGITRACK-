import { useQuery } from "@tanstack/react-query";
import { Package, MapPin, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Shipment, User } from "@shared/schema";

export default function PersonnelDashboard() {
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/auth/me'],
  });

  const { data: shipments = [] } = useQuery<Shipment[]>({
    queryKey: ['/api/shipments'],
  });

  const myAssignments = shipments.filter(s => s.assignedDriverId === currentUser?.id);
  const pending = myAssignments.filter(s => s.status === 'assigned');
  const inTransit = myAssignments.filter(s => s.status === 'in_transit');
  const completed = myAssignments.filter(s => s.status === 'delivered');

  const stats = {
    total: myAssignments.length,
    pending: pending.length,
    inTransit: inTransit.length,
    completed: completed.length,
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Deliveries</h1>
        <p className="text-muted-foreground">Your delivery assignments and route information</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">To be picked up</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">On the way</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Active Deliveries</h3>
        {pending.length === 0 && inTransit.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No active deliveries
          </div>
        ) : (
          <div className="space-y-4">
            {[...pending, ...inTransit].map((shipment) => (
              <Card key={shipment.id} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-lg">{shipment.trackingNumber}</p>
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Pickup</p>
                            <p className="text-sm text-muted-foreground">{shipment.pickupAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Package className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Delivery to {shipment.recipientName}</p>
                            <p className="text-sm text-muted-foreground">{shipment.deliveryAddress}</p>
                            <p className="text-sm text-muted-foreground">{shipment.recipientPhone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <Badge variant="outline" className="text-xs">
                          {shipment.paymentMethod === 'cash_on_delivery' ? `Collect KES ${shipment.amount}` : 'Prepaid'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="gap-2" data-testid={`button-start-${shipment.id}`}>
                        <MapPin className="w-4 h-4" />
                        Navigate
                      </Button>
                      <Button size="sm" variant="outline" data-testid={`button-complete-${shipment.id}`}>
                        Mark Delivered
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Recent Deliveries</h3>
        {completed.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No completed deliveries yet
          </div>
        ) : (
          <div className="space-y-3">
            {completed.slice(0, 10).map((shipment) => (
              <div key={shipment.id} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{shipment.trackingNumber}</p>
                  <p className="text-sm text-muted-foreground">{shipment.deliveryAddress}</p>
                </div>
                <Badge className={getStatusColor('delivered')}>Delivered</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
