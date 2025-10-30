# LogiTrack - Smart Logistics Management System

## Project Overview
LogiTrack is a comprehensive logistics management platform designed for the Kenyan market. It provides real-time shipment tracking, fleet management, and role-based dashboards for administrators, clients, and delivery personnel.

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/UI components
- **Backend**: Express.js, Node.js
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Storage**: In-memory storage (MemStorage) - easily swappable with database
- **Authentication**: Session-based with role support (admin, client, personnel)

## Key Features

### 1. Landing Page
- Professional hero section with generated warehouse imagery
- Service offerings (parcel delivery, route optimization, fleet management)
- User-specific workflow descriptions
- Customer testimonials
- Contact form
- Public shipment tracking

### 2. Authentication System
- Login/Signup pages with role selection
- Three user roles: Admin, Client, Personnel
- Session-based authentication
- Role-based route protection

### 3. Admin Dashboard (`/dashboard`)
- Real-time statistics (shipments, vehicles, personnel)
- Fleet map visualization showing active vehicles
- Comprehensive shipment management
- Create, update, and delete shipments
- Assign drivers to shipments
- Status updates with event logging
- Search and filter capabilities

### 4. Client Portal (`/client-portal`)
- Request new shipments
- View shipment history
- Track delivery status
- Detailed shipment information
- Payment method selection (prepaid/cash on delivery)

### 5. Personnel Dashboard (`/personnel`)
- View assigned deliveries
- Active delivery management
- Navigation assistance
- Delivery confirmation
- Completed delivery history

### 6. Public Shipment Tracking (`/track`)
- Search by tracking number
- Real-time status updates
- Event timeline with timestamps
- Pickup and delivery information

## User Roles & Credentials

### Demo Accounts
- **Admin**: `admin` / `admin123`
- **Client**: `client1` / `client123`
- **Personnel**: `driver1` / `driver123`

### Sample Data
- 2 pre-loaded shipments (TN100001, TN100002)
- 2 vehicles (KBZ 123A, KCA 456B)
- Multiple shipment events showing delivery progression

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── landing/         # Landing page components
│   │   ├── dashboard/       # Dashboard components (FleetMap)
│   │   ├── layout/          # Layout components (DashboardLayout)
│   │   └── ui/              # Shadcn UI components
│   ├── pages/               # Page components
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── ClientPortal.tsx
│   │   ├── PersonnelDashboard.tsx
│   │   └── TrackShipment.tsx
│   ├── lib/                 # Utilities
│   └── hooks/               # Custom hooks

server/
├── routes.ts                # API routes
├── storage.ts               # Data storage layer
└── index.ts                 # Server entry point

shared/
└── schema.ts                # Shared TypeScript types & Zod schemas
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Shipments
- `GET /api/shipments` - Get all shipments
- `GET /api/shipments/:id` - Get shipment by ID
- `GET /api/shipments/tracking/:trackingNumber` - Track shipment
- `POST /api/shipments` - Create shipment
- `PATCH /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create vehicle
- `PATCH /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Personnel
- `GET /api/personnel` - Get all personnel
- `POST /api/personnel` - Create personnel record
- `PATCH /api/personnel/:id` - Update personnel

### Users
- `GET /api/users?role=<role>` - Get users by role

## Data Models

### Users
- Supports three roles: admin, client, personnel
- Stores full name, email, phone, username, password

### Shipments
- Tracking number (unique identifier)
- Client and driver assignment
- Pickup/delivery addresses
- Recipient information
- Status tracking (pending, assigned, in_transit, delivered, cancelled)
- Payment information (method, status, amount)
- Package details (weight, dimensions, notes)

### Vehicles
- Plate number, type, capacity
- Current driver assignment
- Status (available, in_use, maintenance)
- GPS coordinates for tracking

### Personnel
- Links to user account
- Position (driver, dispatcher)
- License number
- Vehicle assignment
- Active status and hire date

### Shipment Events
- Event timeline for each shipment
- Event types (created, assigned, picked_up, in_transit, delivered, cancelled)
- Location tracking
- Timestamp and creator tracking

## Design System

### Colors
- Primary: Blue gradient (#2563eb)
- Card backgrounds with subtle elevation
- Status-specific colors (pending: yellow, in-transit: purple, delivered: green)

### Components
- Built on Shadcn/UI component library
- Responsive design for mobile, tablet, desktop
- Consistent spacing and typography
- Hover and active state interactions

### Layout
- Dashboard layout with sidebar navigation
- Fixed header with mobile menu
- Role-based navigation items

## Running the Project

The project runs with a single command:
```bash
npm run dev
```

This starts both:
- Express backend server on port 5000
- Vite frontend dev server (proxied through backend)

## Future Enhancements
- PostgreSQL database integration (schema ready)
- Real-time GPS tracking with live maps
- SMS/Email notifications
- M-Pesa payment integration
- Route optimization algorithms
- Mobile app (React Native)
- Advanced analytics and reporting
- Multi-tenant support for logistics companies

## Notes
- Session secret is stored in environment variables
- In-memory storage resets on server restart
- Sample data is auto-populated on startup for demo purposes
- All passwords in demo are plain text (should be hashed in production)
