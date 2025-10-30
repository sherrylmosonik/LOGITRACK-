import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Package, Truck, Users, TrendingUp, Plus, Search, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import FleetMap from "@/components/dashboard/FleetMap";
import type { Shipment, Vehicle, User } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);
  const [newShipment, setNewShipment] = useState({
    trackingNumber: `TN${Date.now()}`,
    clientId: 0,
    pickupAddress: "",
    deliveryAddress: "",
    recipientName: "",
    recipientPhone: "",
    status: "pending",
    paymentMethod: "cash_on_delivery",
    paymentStatus: "pending",
    amount: "",
  });

  const { data: shipments = [], isLoading: shipmentsLoading } = useQuery<Shipment[]>({
    queryKey: ['/api/shipments'],
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });

  const { data: clients = [] } = useQuery<User[]>({
    queryKey: ['/api/users?role=client'],
  });

  const createShipmentMutation = useMutation({
    mutationFn: async (shipment: any) => {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(shipment),
      });
      if (!res.ok) throw new Error('Failed to create shipment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shipments'] });
      toast({ title: "Shipment created successfully" });
      setIsCreateShipmentOpen(false);
      setNewShipment({
        trackingNumber: `TN${Date.now()}`,
        clientId: 0,
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

  const updateShipmentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/shipments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update shipment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shipments'] });
      toast({ title: "Status updated successfully" });
    },
  });

  const filteredShipments = shipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalShipments: shipments.length,
    activeShipments: shipments.filter((s) => s.status === 'in_transit').length,
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter((v) => v.status === 'in_use').length,
  };

  const handleCreateShipment = () => {
    createShipmentMutation.mutate({
      ...newShipment,
      amount: newShipment.amount,
    });
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage shipments, vehicles, and operations</p>
        </div>
        <Dialog open={isCreateShipmentOpen} onOpenChange={setIsCreateShipmentOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-create-shipment">
              <Plus className="w-4 h-4" />
              New Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
              <DialogDescription>Fill in the shipment details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tracking Number</Label>
                  <Input
                    value={newShipment.trackingNumber}
                    onChange={(e) => setNewShipment({ ...newShipment, trackingNumber: e.target.value })}
                    data-testid="input-tracking-number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select
                    value={newShipment.clientId.toString()}
                    onValueChange={(value) => setNewShipment({ ...newShipment, clientId: parseInt(value) })}
                  >
                    <SelectTrigger data-testid="select-client">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pickup Address</Label>
                  <Input
                    value={newShipment.pickupAddress}
                    onChange={(e) => setNewShipment({ ...newShipment, pickupAddress: e.target.value })}
                    data-testid="input-pickup-address"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Address</Label>
                  <Input
                    value={newShipment.deliveryAddress}
                    onChange={(e) => setNewShipment({ ...newShipment, deliveryAddress: e.target.value })}
                    data-testid="input-delivery-address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recipient Name</Label>
                  <Input
                    value={newShipment.recipientName}
                    onChange={(e) => setNewShipment({ ...newShipment, recipientName: e.target.value })}
                    data-testid="input-recipient-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recipient Phone</Label>
                  <Input
                    value={newShipment.recipientPhone}
                    onChange={(e) => setNewShipment({ ...newShipment, recipientPhone: e.target.value })}
                    data-testid="input-recipient-phone"
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
                    <SelectTrigger data-testid="select-payment-method">
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
                    data-testid="input-amount"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateShipmentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateShipment} disabled={createShipmentMutation.isPending} data-testid="button-submit-shipment">
                {createShipmentMutation.isPending ? "Creating..." : "Create Shipment"}
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
            <div className="text-2xl font-bold">{stats.totalShipments}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeShipments}</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Vehicles</CardTitle>
            <Truck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">Total vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeVehicles}</div>
            <p className="text-xs text-muted-foreground">On the road</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FleetMap vehicles={vehicles} />
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {shipments.slice(0, 5).map((shipment) => (
              <div key={shipment.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Package className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{shipment.trackingNumber}</p>
                  <p className="text-xs text-muted-foreground">{shipment.recipientName}</p>
                </div>
                <Badge className={getStatusColor(shipment.status)}>
                  {shipment.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold">All Shipments</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search shipments..."
                className="pl-9 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipmentsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading shipments...
                  </TableCell>
                </TableRow>
              ) : filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No shipments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                    <TableCell>{shipment.recipientName}</TableCell>
                    <TableCell className="max-w-xs truncate">{shipment.deliveryAddress}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>KES {shipment.amount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-actions-${shipment.id}`}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              updateShipmentStatusMutation.mutate({ id: shipment.id, status: 'in_transit' })
                            }
                          >
                            Mark In Transit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateShipmentStatusMutation.mutate({ id: shipment.id, status: 'delivered' })
                            }
                          >
                            Mark Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              updateShipmentStatusMutation.mutate({ id: shipment.id, status: 'cancelled' })
                            }
                          >
                            Cancel Shipment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
