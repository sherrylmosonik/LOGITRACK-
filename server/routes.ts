import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertShipmentSchema, insertPersonnelSchema, insertVehicleSchema, insertShipmentEventSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const validatedUser = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(validatedUser.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getAllUsersByRole('client');
      if (existingEmail.some(u => u.email === validatedUser.email)) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(validatedUser);
      
      if (req.session) {
        req.session.userId = user.id;
        req.session.userRole = user.role;
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (req.session) {
        req.session.userId = user.id;
        req.session.userRole = user.role;
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    req.session?.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Shipment routes
  app.get("/api/shipments", async (req: Request, res: Response) => {
    try {
      const shipments = await storage.getAllShipments();
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });

  app.get("/api/shipments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const shipment = await storage.getShipmentById(id);
      
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shipment" });
    }
  });

  app.get("/api/shipments/tracking/:trackingNumber", async (req: Request, res: Response) => {
    try {
      const shipment = await storage.getShipmentByTrackingNumber(req.params.trackingNumber);
      
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      const events = await storage.getEventsByShipmentId(shipment.id);
      res.json({ shipment, events });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shipment" });
    }
  });

  app.post("/api/shipments", async (req: Request, res: Response) => {
    try {
      const validatedShipment = insertShipmentSchema.parse(req.body);
      const shipment = await storage.createShipment(validatedShipment);
      
      await storage.createShipmentEvent({
        shipmentId: shipment.id,
        eventType: 'created',
        description: 'Shipment created',
        location: shipment.pickupAddress,
        createdBy: req.session?.userId,
      });
      
      res.status(201).json(shipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create shipment" });
    }
  });

  app.patch("/api/shipments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const shipment = await storage.updateShipment(id, req.body);
      
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      if (req.body.status) {
        await storage.createShipmentEvent({
          shipmentId: id,
          eventType: req.body.status,
          description: `Status updated to ${req.body.status}`,
          createdBy: req.session?.userId,
        });
      }
      
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update shipment" });
    }
  });

  app.delete("/api/shipments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteShipment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      res.json({ message: "Shipment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete shipment" });
    }
  });

  // Personnel routes
  app.get("/api/personnel", async (req: Request, res: Response) => {
    try {
      const personnel = await storage.getAllPersonnel();
      res.json(personnel);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch personnel" });
    }
  });

  app.post("/api/personnel", async (req: Request, res: Response) => {
    try {
      const validatedPersonnel = insertPersonnelSchema.parse(req.body);
      const personnel = await storage.createPersonnel(validatedPersonnel);
      res.status(201).json(personnel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid personnel data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create personnel" });
    }
  });

  app.patch("/api/personnel/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const personnel = await storage.updatePersonnel(id, req.body);
      
      if (!personnel) {
        return res.status(404).json({ message: "Personnel not found" });
      }
      
      res.json(personnel);
    } catch (error) {
      res.status(500).json({ message: "Failed to update personnel" });
    }
  });

  // Vehicle routes
  app.get("/api/vehicles", async (req: Request, res: Response) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.post("/api/vehicles", async (req: Request, res: Response) => {
    try {
      const validatedVehicle = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(validatedVehicle);
      res.status(201).json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vehicle data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  });

  app.patch("/api/vehicles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.updateVehicle(id, req.body);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  app.delete("/api/vehicles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteVehicle(id);
      
      if (!success) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // Users route (for admin to get drivers/clients)
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const { role } = req.query;
      let users;
      
      if (role && typeof role === 'string') {
        users = await storage.getAllUsersByRole(role);
      } else {
        const admins = await storage.getAllUsersByRole('admin');
        const clients = await storage.getAllUsersByRole('client');
        const personnel = await storage.getAllUsersByRole('personnel');
        users = [...admins, ...clients, ...personnel];
      }
      
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
