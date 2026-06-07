# 🥗 NutriGuide Backend

REST API backend untuk aplikasi **NutriGuide** — platform panduan nutrisi personal yang membantu pengguna mengelola asupan makanan, menghitung kebutuhan gizi, dan mendapatkan rekomendasi makanan sesuai profil tubuh.

---

## 📋 Daftar Isi

- [Tech Stack](#-tech-stack)
- [Arsitektur](#-arsitektur)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Environment Variables](#-environment-variables)
- [Database](#-database)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Struktur Folder](#-struktur-folder)

---

## 🛠 Tech Stack

| Kategori         | Teknologi                          |
| ---------------- | ---------------------------------- |
| **Runtime**      | Node.js (ESM)                      |
| **Framework**    | Express.js v4                      |
| **Bahasa**       | TypeScript                         |
| **ORM**          | Prisma Client v5                   |
| **Database**     | PostgreSQL 15                      |
| **Auth**         | JWT (Access + Refresh Token)       |
| **Validasi**     | Zod                                |
| **Password**     | bcrypt                             |
| **Email**        | Nodemailer (Gmail SMTP)            |
| **Scheduler**    | node-cron                          |
| **Security**     | Helmet, CORS, express-rate-limit   |
| **Logging**      | Morgan                             |
| **Testing**      | Vitest + vitest-mock-extended      |
| **Container**    | Docker                             |
| **CI/CD**        | GitHub Actions → Docker Hub → VM   |

---

## 🏗 Arsitektur

Aplikasi menggunakan arsitektur **MVC + Service Layer**:

```
Request → Routes → Middleware (Auth/Validate) → Controller → Service → Prisma (DB)
```

```
src/
├── routes/          # Definisi endpoint & binding middleware
├── middlewares/     # Auth JWT, validasi Zod, error handler
├── controllers/    # Request/response handling
├── services/       # Business logic
├── models/         # Prisma client instance
└── utils/          # Helper (email, scheduler, ID generator)
```

---

## 📦 Prasyarat

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** 15+ (atau via Docker)
- **Docker** & **Docker Compose** (opsional, untuk database lokal)

---

## 🚀 Instalasi & Setup

### 1. Clone repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup database (via Docker)

```bash
docker compose up -d
```

Ini akan menjalankan PostgreSQL di `localhost:5432` dengan konfigurasi:
- **User:** `postgres`
- **Password:** `password`
- **Database:** `nutri_guide`

### 4. Konfigurasi environment

```bash
cp .env.example .env
# Edit file .env sesuai kebutuhan
```

### 5. Jalankan migrasi & seed database

```bash
npm run db:generate    # Generate Prisma Client
npm run db:migrate     # Jalankan migrasi database
npm run db:seed        # Seed data awal (foods, recipes, articles)
```

---

## 🔐 Environment Variables

Buat file `.env` di root folder `backend/`:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/nutri_guide?schema=public"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=1d

# Email (Gmail SMTP)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD="your_app_password"

# Frontend URL (untuk CORS)
FRONTEND_URL=http://localhost:5173
```

> ⚠️ Untuk `SMTP_PASSWORD`, gunakan **App Password** dari Google Account, bukan password biasa.

---

## 🗄 Database

### Schema (Prisma)

Database terdiri dari **10 model** utama:

| Model              | Deskripsi                                     |
| ------------------ | --------------------------------------------- |
| `User`             | Data pengguna (email, password hash, OTP)     |
| `Session`          | Sesi refresh token pengguna                   |
| `Profile`          | Profil fisik (usia, BB, TB, gender, goal)     |
| `Preference`       | Preferensi diet & budget harian               |
| `Food`             | Database makanan (kalori, makro, harga)        |
| `Recipe`           | Resep makanan (bahan, langkah, waktu)         |
| `FoodHistory`      | Riwayat konsumsi makanan pengguna             |
| `Recommendation`   | Rekomendasi makanan harian                    |
| `RecFood`          | Junction table: rekomendasi ↔ makanan          |
| `Notification`     | Notifikasi & pengingat makan                  |
| `Article`          | Artikel edukasi nutrisi                       |

### Perintah Database

```bash
npm run db:generate    # Generate Prisma Client
npm run db:migrate     # Jalankan migrasi (development)
npm run db:studio      # Buka Prisma Studio (GUI)
npm run db:seed        # Seed data awal
```

---

## ▶️ Menjalankan Aplikasi

### Development

```bash
npm run dev
```

Server berjalan di `http://localhost:3000` dengan hot-reload via **nodemon + tsx**.

### Production

```bash
npm run build          # Compile TypeScript → dist/
npm start              # Jalankan dari dist/
```

### Health Check

```
GET http://localhost:3000/health
```

---

## 📡 API Endpoints

**Base URL:** `http://localhost:3000`

Semua response menggunakan format standar:

```json
{
  "status": "success" | "error",
  "message": "...",
  "data": ...
}
```

### Authentication (`/api/auth`)

| Method | Endpoint                    | Auth | Deskripsi                    |
| ------ | --------------------------- | ---- | ---------------------------- |
| POST   | `/api/auth/register`        | ❌   | Register user baru           |
| POST   | `/api/auth/login`           | ❌   | Login → access + refresh token |
| POST   | `/api/auth/logout`          | ✅   | Logout & invalidate token    |
| POST   | `/api/auth/refresh-token`   | ❌   | Refresh access token         |
| POST   | `/api/auth/forgot-password` | ❌   | Kirim OTP reset password     |
| POST   | `/api/auth/reset-password`  | ❌   | Reset password dengan OTP    |

### Profile (`/api/profile`) 🔒

| Method | Endpoint                     | Deskripsi                |
| ------ | ---------------------------- | ------------------------ |
| POST   | `/api/profile`               | Buat profil baru         |
| GET    | `/api/profile`               | Ambil profil user        |
| PUT    | `/api/profile`               | Update profil            |
| GET    | `/api/profile/preferences`   | Ambil preferensi diet    |
| PUT    | `/api/profile/preferences`   | Update preferensi diet   |

### Foods (`/api/foods`) 🔒

| Method | Endpoint              | Deskripsi                         |
| ------ | --------------------- | --------------------------------- |
| GET    | `/api/foods`          | List makanan (`?search=&category=`) |
| GET    | `/api/foods/:foodId`  | Detail makanan                    |

### Nutrition (`/api/nutrition`) 🔒

| Method | Endpoint                       | Deskripsi                           |
| ------ | ------------------------------ | ----------------------------------- |
| GET    | `/api/nutrition/calculate`     | Hitung BMR, TDEE, & target kalori   |
| GET    | `/api/nutrition/food/:foodId`  | Info nutrisi makanan + resep        |

### Recommendations (`/api/recommendations`) 🔒

| Method | Endpoint                | Deskripsi                              |
| ------ | ----------------------- | -------------------------------------- |
| GET    | `/api/recommendations`  | Rekomendasi makanan harian (`?budget=&preference=`) |

### Recipes (`/api/recipes`) 🔒

| Method | Endpoint                  | Deskripsi            |
| ------ | ------------------------- | -------------------- |
| GET    | `/api/recipes`            | List resep (`?foodId=`) |
| GET    | `/api/recipes/:recipeId`  | Detail resep         |

### History (`/api/history`) 🔒

| Method | Endpoint                      | Deskripsi              |
| ------ | ----------------------------- | ---------------------- |
| POST   | `/api/history`                | Tambah riwayat makan   |
| GET    | `/api/history`                | List riwayat (`?date=`) |
| GET    | `/api/history/summary`        | Ringkasan harian       |
| DELETE | `/api/history/:historyId`     | Hapus riwayat          |

### Articles (`/api/articles`) 🔒

| Method | Endpoint                      | Deskripsi                  |
| ------ | ----------------------------- | -------------------------- |
| GET    | `/api/articles`               | List artikel (`?category=`) |
| GET    | `/api/articles/:articleId`    | Detail artikel             |

### Notifications (`/api/notifications`) 🔒

| Method | Endpoint                          | Deskripsi                |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/api/notifications/settings`     | Ambil setting notifikasi |
| PUT    | `/api/notifications/settings`     | Update setting notifikasi|
| GET    | `/api/notifications/daily`        | Notifikasi harian        |
| POST   | `/api/notifications/token`        | Simpan device token      |
| DELETE | `/api/notifications/token`        | Hapus device token       |

> 🔒 = Memerlukan header `Authorization: Bearer <accessToken>`

> 📄 Dokumentasi API lengkap tersedia di [`list-api.md`](./list-api.md)

---

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm test                # Jalankan semua test
npm run test:watch      # Mode watch
npm run test:coverage   # Dengan coverage report
```

**Test yang tersedia:**
- `auth.service.test.ts` — Register, login, logout, refresh token, reset password
- `history.service.test.ts` — CRUD riwayat makan
- `nutrition.service.test.ts` — Kalkulasi BMR/TDEE
- `profile.service.test.ts` — CRUD profil pengguna
- `recommendation.service.test.ts` — Algoritma rekomendasi makanan

### Type Checking

```bash
npm run type-check
```

---

## 🐳 Deployment

### Docker (Standalone)

```bash
docker build -t nutriguide-backend .
docker run -p 3000:3000 --env-file .env nutriguide-backend
```

### CI/CD (GitHub Actions)

Pipeline otomatis pada push ke branch `main`:

1. **Build** Docker image
2. **Push** ke Docker Hub (`son07/nutriguide-backend:latest`)
3. **Deploy** ke VM via SSH (`docker compose pull && up -d`)

### Production Docker Compose

Konfigurasi lengkap tersedia di folder `deployment-nutriguide/` dengan:
- **Nginx** reverse proxy (port 80/443 + SSL)
- **Backend** container
- **Frontend** container
- **PostgreSQL** database

---

## 📁 Struktur Folder

```
backend/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── migrations/                  # Migration files
│   ├── seed.ts                      # Seed script
│   ├── seed-foods.sql               # Data makanan
│   ├── seed-recipes.sql             # Data resep
│   └── seed-articles.sql            # Data artikel
├── src/
│   ├── index.ts                     # Entry point & server setup
│   ├── routes/
│   │   ├── index.ts                 # Route registration
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── food.routes.ts
│   │   ├── nutrition.routes.ts
│   │   ├── recommendation.routes.ts
│   │   ├── recipe.routes.ts
│   │   ├── history.routes.ts
│   │   ├── article.routes.ts
│   │   └── notification.routes.ts
│   ├── controllers/                 # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── food.controller.ts
│   │   ├── nutrition.controller.ts
│   │   ├── recommendation.controller.ts
│   │   ├── recipe.controller.ts
│   │   ├── history.controller.ts
│   │   ├── article.controller.ts
│   │   └── notification.controller.ts
│   ├── services/                    # Business logic
│   │   ├── auth.service.ts
│   │   ├── profile.service.ts
│   │   ├── food.service.ts
│   │   ├── nutrition.service.ts
│   │   ├── recommendation.service.ts
│   │   ├── recipe.service.ts
│   │   ├── history.service.ts
│   │   ├── article.service.ts
│   │   └── notification.service.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # JWT authentication
│   │   ├── validate.middleware.ts   # Zod validation
│   │   └── error.middleware.ts      # Global error handler
│   ├── models/
│   │   └── prisma.ts                # Prisma client instance
│   ├── utils/
│   │   ├── email.ts                 # Nodemailer helper
│   │   ├── idGenerator.ts           # UUID generator
│   │   ├── scheduler.ts            # Cron job scheduler
│   │   └── trigger-notifications.ts # Notification trigger
│   └── __tests__/                   # Unit tests
│       ├── __mocks__/
│       ├── middlewares/
│       ├── services/
│       │   ├── auth.service.test.ts
│       │   ├── history.service.test.ts
│       │   ├── nutrition.service.test.ts
│       │   ├── profile.service.test.ts
│       │   └── recommendation.service.test.ts
│       └── utils/
├── Dockerfile                       # Container build
├── docker-compose.yml               # PostgreSQL dev setup
├── tsconfig.json                    # TypeScript config
├── vitest.config.ts                 # Test config
├── package.json
└── .env                             # Environment variables
```

---

## 📝 Scripts

| Script              | Perintah                          | Deskripsi                      |
| ------------------- | --------------------------------- | ------------------------------ |
| `dev`               | `npm run dev`                     | Development server (hot-reload)|
| `build`             | `npm run build`                   | Compile TypeScript             |
| `start`             | `npm start`                       | Jalankan production build      |
| `start:prod`        | `npm run start:prod`              | Migrate + start production     |
| `type-check`        | `npm run type-check`              | Type checking tanpa build      |
| `test`              | `npm test`                        | Jalankan unit tests            |
| `test:watch`        | `npm run test:watch`              | Test mode watch                |
| `test:coverage`     | `npm run test:coverage`           | Test dengan coverage report    |
| `db:generate`       | `npm run db:generate`             | Generate Prisma Client         |
| `db:migrate`        | `npm run db:migrate`              | Jalankan migrasi               |
| `db:studio`         | `npm run db:studio`               | Buka Prisma Studio             |
| `db:seed`           | `npm run db:seed`                 | Seed database                  |

---

## 👥 Tim Pengembang

**Kelompok 4** — Tugas Besar Implementasi Perangkat Lunak (IMPAL)

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik.
