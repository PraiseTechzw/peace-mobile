# PEACE Backend Architecture

## Core style
- Framework: NestJS
- Data: PostgreSQL + Drizzle ORM
- Architecture: modular clean architecture with clear layers:
  - `controller` (transport)
  - `service` (application/use-case)
  - `repository` (data access via Drizzle)
  - `dto` (input validation)
  - `types` (domain contracts)

## Modules
- `auth`: registration, login, JWT issuance and strategy
- `users`: user account identity management
- `profiles`: profile metadata and anonymity settings
- `peer-educators`: peer educator data, specializations, availability
- `resources`: wellness resources and categories
- `wellness`: mood tracking and history
- `chat`: conversations, participants, and messages
- `bookings`: slots, session booking, booking lifecycle
- `notifications`: user notifications model
- `admin`: admin-only control surface
- `audit`: immutable audit event logging

## Security model
- Global input validation via `ValidationPipe`
- JWT-protected routes (except auth)
- Role metadata + role guards for restricted routes
- Repository layer prevents direct SQL in services

## Data model highlights
- `users` + `roles` + `user_roles` for RBAC
- `profiles` (1:1 with users), supports anonymity and preferences JSON
- `peer_educators` (1:1 with users), tag model in `peer_specializations`
- `booking_slots` (owned by peer educator), `bookings` (user + slot + status)
- `conversations` + `conversation_participants` + `messages` for chat
- `audit_logs` to track privileged/sensitive actions

## API style
- Prefix: `/api`
- Auth endpoints public
- Domain endpoints authenticated and scoped to request user
- Restful resources with query filtering where needed
