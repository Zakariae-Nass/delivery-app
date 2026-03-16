# DelivTrack API

NestJS REST API for a delivery tracking application with JWT authentication, Single Table Inheritance (STI), and optional profile completion flow.

---

## Tech Stack

- **NestJS 11** — Framework
- **TypeORM + PostgreSQL** — Database ORM
- **Passport JWT** — Authentication
- **bcrypt** — Password hashing
- **class-validator** — DTO validation
- **Swagger** — API documentation
- **Multer** — File uploads

---

## Environment Setup

1. **Configure `.env`**
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=delivery_app

   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

   ADMIN_SECRET_KEY=super-secret-admin-key-12345

   UPLOAD_PATH=./uploads
   PORT=5000
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE delivery_app;
   ```

4. **Start the server** (TypeORM `synchronize: true` auto-creates tables):
   ```bash
   npm run start:dev
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

---

## Swagger Documentation

```
http://localhost:5000/api/docs
```

---

## Profile Completion Flow

```
DELIVERY USER
─────────────────────────────────────────────────────────────
Register (username, email, password, phone)    → 40%
  └─ Add location                              → 60%
       └─ Add rate + vehicleType               → 80%
            └─ Upload documents (CIN, licence) → 100%
                  └─ Admin approves docs       → Ready to deliver

ADMIN / AGENCY
─────────────────────────────────────────────────────────────
Register (username, email, password, phone)    → 80%
  └─ Add location                              → 100%
```

---

## API Endpoints

### Auth (`/auth`)

| Method | Endpoint                   | Auth    | Description                          |
|--------|----------------------------|---------|--------------------------------------|
| POST   | `/auth/register/delivery`  | None    | Register a delivery user             |
| POST   | `/auth/register/admin`     | Header  | Register admin (X-Admin-Secret hdr)  |
| POST   | `/auth/register/agency`    | None    | Register an agency user              |
| POST   | `/auth/login`              | None    | Login — returns tokens + completeness|
| POST   | `/auth/refresh`            | Refresh | Get new access token                 |
| POST   | `/auth/logout`             | JWT     | Logout                               |
| GET    | `/auth/me`                 | JWT     | Current user + profile status        |

### Users (`/users`) — All roles

| Method | Endpoint                 | Auth | Description              |
|--------|--------------------------|------|--------------------------|
| PATCH  | `/users/location`        | JWT  | Create/update location   |
| GET    | `/users/profile-status`  | JWT  | Get profile completeness |

### Delivery (`/delivery`) — Role: `delivery`

| Method | Endpoint               | Auth | Description                       |
|--------|------------------------|------|-----------------------------------|
| PATCH  | `/delivery/profile`    | JWT  | Update rate and/or vehicleType    |
| POST   | `/delivery/documents`  | JWT  | Upload CIN + licence (multipart)  |
| GET    | `/delivery/documents`  | JWT  | Get document verification status  |
| GET    | `/delivery/dashboard`  | JWT  | Dashboard with delivery readiness |

### Admin (`/admin`) — Role: `admin`

| Method | Endpoint                | Auth | Description                     |
|--------|-------------------------|------|---------------------------------|
| GET    | `/admin/deliveries`     | JWT  | List all delivery users (paged) |
| GET    | `/admin/deliveries/:id` | JWT  | Get delivery user details       |
| PATCH  | `/admin/verify/:id`     | JWT  | Approve or reject documents     |

### Agency (`/agency`) — Role: `agency`

| Method | Endpoint            | Auth | Description      |
|--------|---------------------|------|------------------|
| GET    | `/agency/dashboard` | JWT  | Agency dashboard |

---

## Seed Credentials

| Role     | Email                 | Password   | Status                 |
|----------|-----------------------|------------|------------------------|
| admin    | admin@delivtrack.com  | Admin1234  | Complete               |
| delivery | ali@delivtrack.com    | Driver123  | Complete, approved     |
| delivery | sami@delivtrack.com   | Driver123  | Incomplete (base only) |
| delivery | nour@delivtrack.com   | Driver123  | Complete, pending      |
| delivery | malek@delivtrack.com  | Driver123  | Complete, rejected     |
| agency   | agency@delivtrack.com | Agency123  | Complete               |

---

## Testing Scenarios

### 1. Complete profile flow (delivery)
```
POST /auth/register/delivery        → userId, 40%
POST /auth/login                    → tokens, missingFields
PATCH /users/location               → 60%
PATCH /delivery/profile             → 80%
POST /delivery/documents            → 100%, status: pending
# Admin approves:
PATCH /admin/verify/:id  { "status": "approved" }
GET  /delivery/dashboard            → readyToAcceptDeliveries: true
```

### 2. Re-upload rejected documents
```
POST /auth/login (malek)            → warnings about rejected docs
POST /delivery/documents            → re-uploads, resets to pending
GET  /delivery/documents            → status: pending
```

### 3. Admin verifies documents
```
POST /auth/login (admin)
GET  /admin/deliveries              → list with docStatus
PATCH /admin/verify/:id { "status": "approved" }
PATCH /admin/verify/:id { "status": "rejected", "reason": "Blurry image" }
```

---

## File Upload Notes

- Files stored at `./uploads/documents/{userId}/`
- Allowed types: `.jpg`, `.jpeg`, `.png`, `.pdf`
- Max size: 5 MB per file
- Re-uploading resets document status to `pending`

---

## Optional Guards

```typescript
@RequireCompleteProfile()   // Rejects if profileCompleteness < 100
@RequireApprovedDocs()      // Rejects if docVerification.status !== 'approved'
```

Apply alongside `JwtAuthGuard`:
```typescript
@UseGuards(JwtAuthGuard, ProfileCompleteGuard, DocumentsApprovedGuard)
@RequireCompleteProfile()
@RequireApprovedDocs()
async someRoute() { ... }
```
