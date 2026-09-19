# PetStay

PetStay is a pet-first care ecosystem combining an Airbnb-style accommodation marketplace, digital pet identity, veterinary care, e-commerce, and local pet services in one trusted experience.

The product is designed for pet owners, verified hosts, veterinarians, sellers, service providers, and platform administrators. The current repository contains a dependency-free frontend prototype and the deployment boundary for the production system.

## Product scope

### Pet owners

- Create profiles for multiple pets
- Generate Digital Pet IDs and QR Pet Tags
- Store vaccinations, medical records, allergies, medications, and emergency contacts
- Find and book verified pet stays with availability, pricing, services, and cancellation policies
- Track active stays, photos, feeding, walks, medication, and health observations
- Find veterinarians and book appointments
- Buy pet products and track orders
- Book grooming, training, and transportation services
- Manage messages, payments, notifications, saved places, and reviews

### Providers

- Hosts list pet-friendly homes, define availability, capacity, rules, services, and pricing
- Veterinarians manage clinics, qualifications, schedules, patients, prescriptions, and appointments
- Sellers manage products, inventory, orders, shipping, reviews, and earnings
- Service providers offer adoption, grooming, training, and transportation workflows

### Administration

Administrators manage users, verifications, pets, listings, bookings, payments, products, orders, appointments, reviews, reports, disputes, promotions, commissions, and audit logs.

## Core modules

- Authentication, email/phone verification, JWT, and role-based access control
- Pet profiles, Digital Pet IDs, QR tags, safe public tag resolution, and scan telemetry
- Accommodation listings, location search, availability calendars, filters, maps, and masked addresses
- Booking state machine: `PENDING`, `PAYMENT_PENDING`, `CONFIRMED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`, `REJECTED`, and `DISPUTED`
- Dynamic pricing for nightly rates, extra pets, cleaning, platform fees, commissions, and payouts
- Live stay activity feeds with media updates and owner/host communication
- Veterinary profiles, appointment scheduling, medical records, prescriptions, and vaccination reminders
- Pet marketplace catalog, cart, checkout, inventory, orders, shipping, and product reviews
- Adoption, grooming, training, transportation, messaging, notifications, and reporting
- Payment abstraction for bKash, Nagad, cards, bank payments, and future gateways

## Architecture target

```text
Next.js / React client
	|
   HTTPS REST + WebSockets
	|
NGINX / API gateway
	|
Django + Django REST Framework + Django Channels
	|
PostgreSQL + PostGIS  <->  Redis cache/channel layer
	|
Celery workers  --->  S3-compatible object storage
```

Recommended Django domain apps:

```text
backend/
└── apps/
    ├── authentication/  profiles/       pets/
    ├── listings/        bookings/       stays/
    ├── vets/            marketplace/   services/
    ├── messaging/       payments/       notifications/
    └── analytics/
```

The detailed architecture, database boundary, security rules, and delivery sequence are documented in [docs/architecture.md](docs/architecture.md). The reserved Django setup boundary is described in [backend/README.md](backend/README.md).

## Important business rules

1. Hosts, veterinarians, and sellers must be verified before publishing or accepting work.
2. A property cannot accept overlapping active bookings.
3. Owners need at least one registered pet before booking a stay.
4. A paid booking becomes confirmed only after an idempotently verified payment event.
5. Exact host addresses stay private until an authorized booking is confirmed.
6. Medical records are available only to owners and explicitly authorized hosts or veterinarians.
7. Reviews are available only after a completed service or fulfilled order.
8. Financial, verification, moderation, and dispute actions are audit logged.

## Security and privacy

- Strong password hashing, JWT rotation, RBAC, object-level permissions, and rate limiting
- Input validation, upload allowlists, size limits, malware scanning, and private object URLs
- Public QR profiles expose only safe contact and medical-alert data, never private records
- Public listing results expose approximate locations, not exact host addresses
- Payment credentials, passwords, private medical information, and sensitive personal data are never exposed in API responses or logs
- Payment webhooks are signature-verified and idempotent

## Current frontend slice

The current dependency-free prototype includes:

- Owner dashboard with upcoming stays, appointments, and pet profiles
- Stay discovery cards with location search and saved-place interactions
- Booking review modal with dynamic stay totals
- Add-pet modal and toast notifications
- Responsive sidebar navigation for desktop and mobile
- Pet Digital ID workspace with QR privacy settings, medical records, vaccination timeline, and care rules

## Run locally

Open `index.html` in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Docker deployment

The repository includes a production NGINX container for static hosting:

```bash
docker build -t petstay .
docker run --rm -p 8080:80 petstay
```

Then visit `http://localhost:8080`. Deployment providers that build from a `Dockerfile` can use the repository root directly; the container listens on port `80`.

## Delivery roadmap

1. Foundation: custom user, JWT, RBAC, PostgreSQL/PostGIS, Redis, CI, and OpenAPI.
2. Pet identity: pet records, QR resolver, permissioned medical data, and vaccination alerts.
3. Stays: verified hosts, listings, availability, quote engine, booking state machine, and payments.
4. Live care: active stay feeds, media uploads, WebSockets, and notifications.
5. Veterinary and marketplace: appointments, prescriptions, catalog, orders, and inventory.
6. Services and operations: adoption, grooming, training, transport, admin, disputes, and analytics.