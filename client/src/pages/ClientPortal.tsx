import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Package, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Shipment, User } from "@shared/schema";

export default function ClientPortal() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newShipment, setNewShipment] = useState({
    trackingNumber: `TN${Date.now()}`,
    clientId: 1,
    pickupAddress: "",
    deliveryAddress: "",
    recipientName: "",
    recipientPhone: "",
    status: "pending",
    paymentMethod: "cash_on_delivery",
    paymentStatus: "pending",
    amount: "",
  });

  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/auth/me'],
  });

  const { data: shipments = [], isLoading } = useQuery<Shipment[]>({
    queryKey: ['/api/shipments'],
  });

  const createShipmentMutation = useMutation({
    mutationFn: async (shipment: any) => {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...shipment, clientId: currentUser?.id || 1 }),
      });
      if (!res.ok) throw new Error('Failed to create shipment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shipments'] });
      toast({ title: "Shipment request created successfully" });
      setIsCreateDialogOpen(false);
      setNewShipment({
        trackingNumber: `TN${Date.now()}`,
        clientId: 1,
        pickupAddress: "",
        deliveryAddress: "",
        recipientName: "",
        recipientPhone: "",
        status: "pending",
        paymentMethod: "cash_on_delivery",
        paymentStatus: "pending",
        amount: "",
      });
    },
    onError: () => {
      toast({ title: "Failed to create shipment", variant: "destructive" });
    },
  });

  const myShipments = shipments.filter(s => s.clientId === currentUser?.id);
  const filteredShipments = myShipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: myShipments.length,
    pending: myShipments.filter((s) => s.status === 'pending').length,
    inTransit: myShipments.filter((s) => s.status === 'in_transit').length,
    delivered: myShipments.filter((s) => s.status === 'delivered').length,
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

  const handleCreateShipment = () => {
    createShipmentMutation.mutate(newShipment);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Shipments</h1>
          <p className="text-muted-foreground">Track and manage your deliveries</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-new-shipment">
              <Plus className="w-4 h-4" />
              Request Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request New Shipment</DialogTitle>
              <DialogDescription>Fill in the shipment details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pickup Address</Label>
                  <Input
                    value={newShipment.pickupAddress}
                    onChange={(e) => setNewShipment({ ...newShipment, pickupAddress: e.target.value })}
                    placeholder="Enter pickup location"
                    data-testid="input-pickup"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Address</Label>
                  <Input
                    value={newShipment.deliveryAddress}
                    onChange={(e) => setNewShipment({ ...newShipment, deliveryAddress: e.target.value })}
                    placeholder="Enter delivery location"
                    data-testid="input-delivery"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recipient Name</Label>
                  <Input
                    value={newShipment.recipientName}
                    onChange={(e) => setNewShipment({ ...newShipment, recipientName: e.target.value })}
                    placeholder="Enter recipient name"
                    data-testid="input-recipient"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recipient Phone</Label>
                  <Input
                    value={newShipment.recipientPhone}
                    onChange={(e) => setNewShipment({ ...newShipment, recipientPhone: e.target.value })}
                    placeholder="+254 712 345 678"
                    data-testid="input-phone"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select
                    value={newShipment.paymentMethod}
                    onValueChange={(value) => setNewShipment({ ...newShipment, paymentMethod: value })}
                  >
                    <SelectTrigger data-testid="select-payment">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                      <SelectItem value="prepaid">Prepaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (KES)</Label>
                  <Input
                    type="number"
                    value={newShipment.amount}
                    onChange={(e) => setNewShipment({ ...newShipment, amount: e.target.value })}
                    placeholder="0.00"
                    data-testid="input-amount"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateShipment} disabled={createShipmentMutation.isPending} data-testid="button-submit">
                {createShipmentMutation.isPending ? "Creating..." : "Request Shipment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
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
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting pickup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">On the way</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold">Shipment History</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by tracking number..."
              className="pl-9 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading shipments...
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No shipments found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShipments.map((shipment) => (
              <Card key={shipment.id} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-lg">{shipment.trackingNumber}</p>
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        To: {shipment.recipientName} · {shipment.deliveryAddress}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        From: {shipment.pickupAddress}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">KES {shipment.amount}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {shipment.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
