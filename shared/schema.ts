import { pgTable, text, serial, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone"),
  role: text("role").notNull(), // 'admin', 'client', 'personnel'
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").unique().notNull(),
  clientId: integer("client_id").references(() => users.id).notNull(),
  assignedDriverId: integer("assigned_driver_id").references(() => users.id),
  pickupAddress: text("pickup_address").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone").notNull(),
  status: text("status").notNull(), // 'pending', 'assigned', 'in_transit', 'delivered', 'cancelled'
  paymentMethod: text("payment_method").notNull(), // 'prepaid', 'cash_on_delivery'
  paymentStatus: text("payment_status").notNull(), // 'pending', 'paid'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  dimensions: text("dimensions"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deliveredAt: timestamp("delivered_at"),
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  createdAt: true,
  deliveredAt: true,
});
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipments.$inferSelect;

export const personnel = pgTable("personnel", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  position: text("position").notNull(), // 'driver', 'dispatcher'
  licenseNumber: text("license_number"),
  vehicleAssigned: text("vehicle_assigned"),
  isActive: boolean("is_active").default(true).notNull(),
  hireDate: timestamp("hire_date").defaultNow().notNull(),
});

export const insertPersonnelSchema = createInsertSchema(personnel).omit({
  id: true,
  hireDate: true,
});
export type InsertPersonnel = z.infer<typeof insertPersonnelSchema>;
export type Personnel = typeof personnel.$inferSelect;

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  plateNumber: text("plate_number").unique().notNull(),
  vehicleType: text("vehicle_type").notNull(), // 'van', 'truck', 'motorcycle'
  capacity: decimal("capacity", { precision: 10, scale: 2 }),
  currentDriverId: integer("current_driver_id").references(() => users.id),
  status: text("status").notNull(), // 'available', 'in_use', 'maintenance'
  lastLat: decimal("last_lat", { precision: 10, scale: 6 }),
  lastLng: decimal("last_lng", { precision: 10, scale: 6 }),
  lastUpdated: timestamp("last_updated"),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  lastUpdated: true,
});
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export const shipmentEvents = pgTable("shipment_events", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").references(() => shipments.id).notNull(),
  eventType: text("event_type").notNull(), // 'created', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'
  description: text("description").notNull(),
  location: text("location"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertShipmentEventSchema = createInsertSchema(shipmentEvents).omit({
  id: true,
  createdAt: true,
});
export type InsertShipmentEvent = z.infer<typeof insertShipmentEventSchema>;
export type ShipmentEvent = typeof shipmentEvents.$inferSelect;
