# Backend Implementation Task Plan

## Project

Build a production-ready REST API backend for the existing **You and Your Store** e-commerce frontend. The backend must be independent of the existing TanStack Start/React UI and must not rebuild or redesign the frontend.

## Required Stack

- Next.js API routes
- TypeScript
- MongoDB native driver
- Secure authentication and role-based authorization
- Cloudinary for product image storage
- REST API with consistent JSON responses
- TypeScript API client and shared types for TanStack Start integration

## Phase 1 — Project Foundation and Database

- [x] Inspect the existing project structure and confirm the backend integration boundary.
- [x] Configure environment variables for MongoDB, authentication, Cloudinary, Google OAuth, email delivery, payment providers, and application URLs.
- [x] Create the MongoDB connection layer using the native MongoDB driver only.
- [x] Define collection access utilities and shared database types.
- [x] Create collections for:
  - [ ] users
  - [ ] products
  - [ ] categories
  - [ ] carts
  - [ ] wishlists
  - [ ] orders
  - [ ] payments
  - [ ] coupons
  - [ ] reviews
  - [ ] newsletters
  - [ ] store settings
- [ ] Add secure indexes for common queries, uniqueness, search, stock, order ownership, and timestamps.
- [ ] Add database validation and reusable pagination utilities.
- [ ] Create clearly marked development-only seed data without presenting it as real inventory or reviews.

## Phase 2 — Authentication and Authorization

- [x] Implement email/password registration.
- [x] Hash passwords securely with a modern password-hashing algorithm.
- [x] Implement login and logout.
- [x] Implement secure session or token management.
- [x] Implement password reset request and completion flows.
- [ ] Add Google sign-in callback and account linking.
- [x] Define user roles and permissions, including customer and admin roles.
- [x] Add authentication middleware/helpers for protected routes.
- [x] Add admin authorization middleware.
- [ ] Add rate limiting for authentication and password-reset endpoints.
- [ ] Ensure roles and session state are always read from the server, never trusted from client input.

## Phase 3 — Product and Category APIs

- [x] Implement category CRUD endpoints.
- [x] Implement product CRUD endpoints.
- [x] Support product variants, specifications, images, and stock fields.
- [x] Add product search, filtering, sorting, and pagination.
- [ ] Add Cloudinary upload and deletion workflows.
- [x] Validate product data and prevent invalid stock or pricing values.
- [x] Protect create, update, delete, inventory, and image-management endpoints with admin authorization.
- [x] Add public read endpoints for the existing frontend.
- [x] Match the frontend-required product and category data shapes.

## Phase 4 — Frontend API Contract

- [ ] Define consistent success and error response formats.
- [ ] Define API error codes and HTTP status conventions.
- [ ] Create shared TypeScript types for products, categories, users, carts, orders, payments, coupons, reviews, and pagination.
- [ ] Build a frontend API client that can be copied into or imported by the TanStack Start application.
- [ ] Document authentication headers/cookies and request requirements.
- [ ] Document all public, customer, and admin endpoints.
- [ ] Add request and response examples for key workflows.

## Phase 5 — Cart and Wishlist

- [ ] Implement guest cart support using a secure guest identifier.
- [ ] Implement authenticated cart support.
- [ ] Synchronize guest cart contents after login.
- [ ] Validate product availability, variants, and stock on every cart mutation.
- [ ] Implement cart item add, update, remove, and clear endpoints.
- [ ] Implement wishlist create, list, add, remove, and clear endpoints.
- [ ] Scope all authenticated cart and wishlist queries to the current user.
- [ ] Prevent clients from controlling authoritative prices or stock values.

## Phase 6 — Coupons, Shipping, and Checkout

- [ ] Define coupon data and validation rules.
- [ ] Implement admin coupon CRUD endpoints.
- [ ] Validate coupons server-side, including expiration, usage limits, minimum order values, and eligibility.
- [ ] Implement Bangladesh shipping rules using BDT (৳).
- [ ] Support separate Dhaka and outside-Dhaka shipping fees.
- [ ] Calculate totals on the server from authoritative product prices.
- [ ] Validate aggregate quantities and stock before order creation.
- [ ] Use transactions or an equivalent reservation strategy to prevent overselling.
- [ ] Create immutable order-time product and price snapshots.
- [ ] Reject non-positive, non-integer, and excessive quantities.

## Phase 7 — Orders and Customer Account Features

- [ ] Implement order creation after successful server-side validation.
- [ ] Implement customer order history.
- [ ] Implement order detail and tracking endpoints.
- [ ] Implement order status transitions with authorization checks.
- [ ] Implement order cancellation rules.
- [ ] Implement return-request creation and processing.
- [ ] Implement admin order management endpoints.
- [ ] Prevent customers from accessing other users' orders.
- [ ] Add audit-friendly timestamps and status history where needed.

## Phase 8 — Bangladesh Payment Integrations

- [ ] Define a payment provider abstraction.
- [ ] Prepare SSLCommerz or aamarPay integration in test mode.
- [ ] Prepare bKash integration in test mode.
- [ ] Prepare Nagad integration in test mode.
- [ ] Prepare Rocket integration in test mode.
- [ ] Implement cash-on-delivery order handling.
- [ ] Verify payment notifications on the server.
- [ ] Verify provider signatures and callbacks before changing payment status.
- [ ] Never simulate successful online payments.
- [ ] Never trust payment status, amount, or transaction identifiers from the client.
- [ ] Add idempotency protection for payment callbacks and order payment updates.
- [ ] Keep all merchant credentials in environment variables.

## Phase 9 — Reviews and Customer Content

- [ ] Implement verified-purchase review creation.
- [ ] Confirm that the customer purchased the product before accepting a review.
- [ ] Prevent duplicate reviews where applicable.
- [ ] Implement review listing, rating summaries, and pagination.
- [ ] Implement admin review moderation.
- [ ] Add review status controls without exposing private moderation details publicly.

## Phase 10 — Admin Dashboard APIs

- [ ] Implement admin product management endpoints.
- [ ] Implement admin category management endpoints.
- [ ] Implement inventory management endpoints.
- [ ] Implement customer listing and customer-detail endpoints.
- [ ] Implement order management endpoints.
- [ ] Implement coupon management endpoints.
- [ ] Implement review moderation endpoints.
- [ ] Implement store settings management endpoints.
- [ ] Add secure filtering, sorting, pagination, and authorization to all admin endpoints.
- [ ] Add audit logging for sensitive administrative actions if required.

## Phase 11 — Newsletter and Store Settings

- [ ] Implement newsletter subscription endpoint.
- [ ] Normalize and validate email addresses.
- [ ] Prevent duplicate subscriptions.
- [ ] Add unsubscribe support if required by the email workflow.
- [ ] Implement public store information endpoints.
- [ ] Implement admin configuration for store information, contact details, shipping settings, and feature settings.

## Phase 12 — Security, Quality, and Operations

- [ ] Validate and sanitize every request body, query parameter, route parameter, and uploaded value.
- [ ] Prevent NoSQL injection and unsafe MongoDB operators from user input.
- [ ] Add rate limiting to authentication, checkout, payment, review, and public subscription endpoints.
- [ ] Add secure CORS configuration for the existing frontend origin.
- [ ] Add secure cookies or token handling.
- [ ] Add security headers and safe error responses.
- [ ] Ensure secrets and credentials are never logged or returned.
- [ ] Add structured server logging without sensitive data.
- [ ] Add automated tests for authentication, authorization, product access, cart validation, checkout totals, stock protection, coupons, and payment callbacks.
- [ ] Add integration tests against a test MongoDB database.
- [ ] Run type checking, linting, and API tests.
- [ ] Verify API behavior from the existing TanStack Start frontend client.

## Initial Implementation Order

1. Complete Phase 1: database schema, connection, environment configuration, indexes, and seed data.
2. Complete Phase 2: authentication and admin authorization.
3. Complete Phase 3: product and category APIs.
4. Complete Phase 4: frontend API client, shared types, response contracts, and documentation.
5. Continue through cart, checkout, orders, payments, reviews, admin APIs, and operational hardening.

## Completion Criteria

- The frontend can consume the backend without UI redesign.
- All prices, discounts, stock, roles, and payment states are authoritative on the server.
- Customer data is isolated by authenticated user.
- Admin endpoints are protected by server-side role checks.
- Bangladesh shipping and BDT pricing are supported.
- Payment providers remain in test mode until valid merchant credentials are configured.
- Development seed data is clearly separated from real data.
- API documentation and TypeScript client types are available for TanStack Start integration.
