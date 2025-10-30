import type { 
  User, InsertUser,
  Shipment, InsertShipment,
  Personnel, InsertPersonnel,
  Vehicle, InsertVehicle,
  ShipmentEvent, InsertShipmentEvent
} from "@shared/schema";

export interface IStorage {
  // Users
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsersByRole(role: string): Promise<User[]>;
  
  // Shipments
  getShipmentById(id: number): Promise<Shipment | undefined>;
  getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | undefined>;
  getAllShipments(): Promise<Shipment[]>;
  getShipmentsByClientId(clientId: number): Promise<Shipment[]>;
  getShipmentsByDriverId(driverId: number): Promise<Shipment[]>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipment(id: number, shipment: Partial<Shipment>): Promise<Shipment | undefined>;
  deleteShipment(id: number): Promise<boolean>;
  
  // Personnel
  getPersonnelById(id: number): Promise<Personnel | undefined>;
  getPersonnelByUserId(userId: number): Promise<Personnel | undefined>;
  getAllPersonnel(): Promise<Personnel[]>;
  createPersonnel(personnel: InsertPersonnel): Promise<Personnel>;
  updatePersonnel(id: number, personnel: Partial<Personnel>): Promise<Personnel | undefined>;
  
  // Vehicles
  getVehicleById(id: number): Promise<Vehicle | undefined>;
  getAllVehicles(): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  
  // Shipment Events
  getEventsByShipmentId(shipmentId: number): Promise<ShipmentEvent[]>;
  createShipmentEvent(event: InsertShipmentEvent): Promise<ShipmentEvent>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private shipments: Shipment[] = [];
  private personnel: Personnel[] = [];
  private vehicles: Vehicle[] = [];
  private shipmentEvents: ShipmentEvent[] = [];
  
  private userIdCounter = 1;
  private shipmentIdCounter = 1;
  private personnelIdCounter = 1;
  private vehicleIdCounter = 1;
  private eventIdCounter = 1;

  // Users
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.userIdCounter++,
      phone: user.phone ?? null,
    };
    this.users.push(newUser);
    return newUser;
  }

  async getAllUsersByRole(role: string): Promise<User[]> {
    return this.users.filter(u => u.role === role);
  }

  // Shipments
  async getShipmentById(id: number): Promise<Shipment | undefined> {
    return this.shipments.find(s => s.id === id);
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | undefined> {
    return this.shipments.find(s => s.trackingNumber === trackingNumber);
  }

  async getAllShipments(): Promise<Shipment[]> {
    return [...this.shipments];
  }

  async getShipmentsByClientId(clientId: number): Promise<Shipment[]> {
    return this.shipments.filter(s => s.clientId === clientId);
  }

  async getShipmentsByDriverId(driverId: number): Promise<Shipment[]> {
    return this.shipments.filter(s => s.assignedDriverId === driverId);
  }

  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    const newShipment: Shipment = {
      ...shipment,
      id: this.shipmentIdCounter++,
      createdAt: new Date(),
      deliveredAt: null,
      assignedDriverId: shipment.assignedDriverId ?? null,
      weight: shipment.weight ?? null,
      dimensions: shipment.dimensions ?? null,
      notes: shipment.notes ?? null,
    };
    this.shipments.push(newShipment);
    return newShipment;
  }

  async updateShipment(id: number, shipment: Partial<Shipment>): Promise<Shipment | undefined> {
    const index = this.shipments.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    
    this.shipments[index] = { ...this.shipments[index], ...shipment };
    return this.shipments[index];
  }

  async deleteShipment(id: number): Promise<boolean> {
    const index = this.shipments.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.shipments.splice(index, 1);
    return true;
  }

  // Personnel
  async getPersonnelById(id: number): Promise<Personnel | undefined> {
    return this.personnel.find(p => p.id === id);
  }

  async getPersonnelByUserId(userId: number): Promise<Personnel | undefined> {
    return this.personnel.find(p => p.userId === userId);
  }

  async getAllPersonnel(): Promise<Personnel[]> {
    return [...this.personnel];
  }

  async createPersonnel(personnel: InsertPersonnel): Promise<Personnel> {
    const newPersonnel: Personnel = {
      ...personnel,
      id: this.personnelIdCounter++,
      hireDate: new Date(),
      licenseNumber: personnel.licenseNumber ?? null,
      vehicleAssigned: personnel.vehicleAssigned ?? null,
      isActive: personnel.isActive ?? true,
    };
    this.personnel.push(newPersonnel);
    return newPersonnel;
  }

  async updatePersonnel(id: number, personnel: Partial<Personnel>): Promise<Personnel | undefined> {
    const index = this.personnel.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.personnel[index] = { ...this.personnel[index], ...personnel };
    return this.personnel[index];
  }

  // Vehicles
  async getVehicleById(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.find(v => v.id === id);
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return [...this.vehicles];
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: this.vehicleIdCounter++,
      lastUpdated: null,
      capacity: vehicle.capacity ?? null,
      currentDriverId: vehicle.currentDriverId ?? null,
      lastLat: vehicle.lastLat ?? null,
      lastLng: vehicle.lastLng ?? null,
    };
    this.vehicles.push(newVehicle);
    return newVehicle;
  }

  async updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    
    this.vehicles[index] = { ...this.vehicles[index], ...vehicle, lastUpdated: new Date() };
    return this.vehicles[index];
  }

  async deleteVehicle(id: number): Promise<boolean> {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index === -1) return false;
    
    this.vehicles.splice(index, 1);
    return true;
  }

  // Shipment Events
  async getEventsByShipmentId(shipmentId: number): Promise<ShipmentEvent[]> {
    return this.shipmentEvents.filter(e => e.shipmentId === shipmentId);
  }

  async createShipmentEvent(event: InsertShipmentEvent): Promise<ShipmentEvent> {
    const newEvent: ShipmentEvent = {
      ...event,
      id: this.eventIdCounter++,
      createdAt: new Date(),
      location: event.location ?? null,
      createdBy: event.createdBy ?? null,
    };
    this.shipmentEvents.push(newEvent);
    return newEvent;
  }
}

export const storage = new MemStorage();
