# Roles and API (Admin / User)

This document describes the initial RBAC (role-based access control) model and the demo API endpoints added to the backend.

## Roles

- `admin`
  - Full access to administrative functions.
  - Can authorize and revoke roles for users.
  - Can access any protected endpoint (for demo endpoints, admin is allowed anywhere).

- `user`
  - Regular marketplace participant.
  - Can create (post) listings and interact with marketplace features (buy/sell requests).
  - Cannot access admin-only endpoints.

## How roles are stored (DB)

In `database/schema.sql`:

- `roles` table: stores role names (e.g. `admin`, `user`).
- `user_roles` table: many-to-many mapping between `users` and `roles`.

Seed note: roles are seeded automatically by the schema, but assigning an initial admin user should be performed via a secure seed script.

## Demo Authorization Model (current implementation)

- For the demo, the server accepts a request header `x-user-role` (or `x-role`) with a comma-separated list of roles for the caller.
  - Example: `x-user-role: admin` or `x-user-role: user`
- In production, replace this header-based check with real authentication (JWT) and populate roles from user claims or the DB.

## Demo API Endpoints

- Admin endpoints (require role `admin`):
  - `GET /admin/health` — checks admin access.
  - `POST /admin/authorize` — body `{ userId, role }` — (demo) returns a message that the user was authorized with the role.
  - `PUT /admin/revoke/:userId/:role` — (demo) returns a message that role was revoked.

- Listing endpoints (require role `user` or `admin`):
  - `POST /listings` — body `{ title, description?, price }` — creates a demo listing and returns it.

## Next steps to productionize

1. Implement proper authentication (JWT or OAuth) and attach role claims to the user session.
2. Replace header-based checks with a guard that reads roles from the decoded JWT or DB.
3. Implement DB integration in controllers (`user_roles` inserts/removes, listings insert into `listings` table, image uploads to S3).
4. Add migration and seed scripts to assign an initial admin safely.

---

If you want, I can:
- Add JWT auth scaffolding (login/register endpoints) and role management backed by the DB, or
- Implement the admin user seed and a CLI script to assign the initial admin role.
