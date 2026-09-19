# PetStay Architecture

## Current delivery

The repository currently ships a dependency-free web client for rapid product validation. The entry point is `index.html`; the first owner workflow includes stay discovery, booking review, pet creation, and a Pet Digital ID workspace with QR privacy controls, medical records, and care rules.

## Production target

The production system should keep the client and domain services decoupled:

```text
Next.js client
    -> TLS / reverse proxy
Django REST API + Django Channels
    -> PostgreSQL + PostGIS
    -> Redis (cache, channel layer, Celery broker)
Celery workers -> object storage, email/SMS, payment webhooks
```

Django apps should map to domain boundaries rather than UI screens:

- `authentication`: custom user, JWT, verification, RBAC
- `profiles`: owner, host, veterinarian, seller profiles
- `pets`: pet identity, QR tags, medical records, vaccination records
- `listings`: properties, services, calendars, location masking
- `bookings`: pricing, state transitions, overlap protection
- `stays`: check-in/out and activity feed
- `vets`: clinics, schedules, appointments, prescriptions
- `marketplace`: catalog, carts, orders, inventory
- `services`: adoption, grooming, training, transport
- `messaging`: conversations, messages, read receipts
- `payments`: provider adapters, transactions, refunds, payouts
- `notifications`: in-app events and async delivery
- `analytics`: reporting, commission, audit events

## Non-negotiable invariants

1. Hosts, veterinarians, and sellers cannot publish or accept work until verified.
2. A property cannot have overlapping active bookings.
3. A paid booking cannot become `CONFIRMED` until the payment webhook is verified and idempotently recorded.
4. Exact property address data is returned only to an authorized confirmed booking participant.
5. Pet medical data requires owner consent or an active booking/appointment relationship.
6. Reviews require a completed service or fulfilled order.
7. Every financial, moderation, verification, and dispute action creates an audit event.
8. Webhook handlers and booking commands are idempotent by external reference or idempotency key.

## Booking transaction boundary

The booking service should run in one database transaction. Lock the property row, validate dates and availability, calculate the quote, and create a `PAYMENT_PENDING` booking. The database should also carry a PostgreSQL exclusion constraint over a daterange for active statuses, so concurrent requests cannot bypass application checks.

```sql
EXCLUDE USING gist (
  property_id WITH =,
  daterange(check_in_date, check_out_date, '[)') WITH &&
) WHERE (status IN ('PAYMENT_PENDING', 'CONFIRMED', 'CHECKED_IN'));
```

Prices are stored as `NUMERIC`/`Decimal`, never floats. Quote responses should include a pricing version so a later admin rule change cannot silently alter an in-flight checkout.

## API conventions

- Versioned routes: `/api/v1/...`
- Consistent error shape: `{ "code": "...", "message": "...", "fields": {} }`
- Cursor pagination for feeds and catalogs
- Explicit serializers for public versus private pet and property projections
- OpenAPI generated from DRF schema
- JWT access tokens kept short-lived; refresh token rotation and revocation required

## Payment adapter boundary

Payment providers implement `initiate`, `verify`, `refund`, and `parse_webhook`. Each request has a connect/read timeout, bounded retry policy, structured logs with secrets and payment credentials redacted, and a unique provider reference. Webhooks are verified from the provider signature and stored before domain state changes.

## Security checklist

- Argon2 or Django's configured strong password hasher
- Object-level permissions on pet, medical, booking, and payout resources
- Upload allowlist, MIME sniffing, size limits, malware scanning, and private object URLs
- Rate limits on authentication, QR scans, messaging, and payment endpoints
- PostGIS coordinates rounded or masked in public search responses
- No sensitive medical data in logs, analytics payloads, or public QR responses
- Audit log is append-only to application users

## Delivery sequence

1. Foundation: Django project, custom user, JWT, PostgreSQL/PostGIS, Redis, CI, and OpenAPI.
2. Pet identity: pets, QR resolver, permissioned medical records, vaccination reminders.
3. Stays: verified hosts, listings, availability, quote service, booking state machine, payment adapters.
4. Live care: active stay feed, media uploads, Channels messaging, notifications.
5. Vets and marketplace: schedules, appointments, prescriptions, catalog, orders, inventory.
6. Services and admin: adoption, grooming, training, transport, moderation, disputes, analytics.

The current static client intentionally stays usable while those server boundaries are implemented behind its interaction contracts.
