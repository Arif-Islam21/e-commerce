# Backend API Contract

All endpoints return JSON using one of these envelopes:

```json
{ "success": true, "data": {} }
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Readable message" } }
```

## Status conventions

- `200` successful read/update
- `201` successful creation
- `204` successful deletion with no body
- `400` malformed or invalid input (`VALIDATION_ERROR`)
- `401` missing or invalid authentication (`UNAUTHORIZED`)
- `403` authenticated but not allowed (`FORBIDDEN`)
- `404` resource does not exist (`NOT_FOUND`)
- `409` uniqueness or state conflict (`CONFLICT`)
- `429` rate limit exceeded (`RATE_LIMITED`)
- `500` unexpected server failure (`INTERNAL_ERROR`)

Authentication uses the secure `auth_token` HttpOnly cookie. Browser clients should send requests with credentials included; do not send roles or user IDs as client-controlled authorization fields.

## Public catalog

- `GET /api/categories?page=1&pageSize=20&search=...`
- `GET /api/categories/:id`
- `GET /api/products?page=1&pageSize=20&search=...&categoryId=...&status=active&minPrice=0&maxPrice=10000&sort=createdAt&order=desc`
- `GET /api/products/:id`

List responses return `{ items, pagination }`, where pagination contains `page`, `pageSize`, `total`, `totalPages`, `hasNextPage`, and `hasPreviousPage`.

## Authentication

- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/password-reset/request` — `{ email }`
- `POST /api/auth/password-reset/complete` — `{ token, password }`
- `GET /api/auth/google` — starts Google sign-in flow

Admin-only writes must use the authenticated admin session. Request and response schemas remain server-authoritative and are validated before database access.
