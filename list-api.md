# Nutri Guide API Documentation

**Base URL:** `http://localhost:3000`

**Response Format:** Semua response menggunakan format JSON:
```json
{ "status": "success" | "error", "message": "...", "data": ... }
```

**Auth Header (🔒):** `Authorization: Bearer <accessToken>`

---

## 1. Health Check

### `GET /health`
**Response 200:**
```json
{
  "status": "success",
  "message": "Server is healthy",
  "data": {
    "uptime": 123.456,
    "timestamp": "2026-05-02T13:00:00.000Z",
    "db": "connected"
  }
}
```

---

## 2. Auth (`/api/auth`)

### `POST /api/auth/register`
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response 201 (Success):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user_id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com",
    "is_active": true,
    "created_at": "2026-05-02T13:00:00.000Z",
    "updated_at": "2026-05-02T13:00:00.000Z"
  }
}
```
**Response 409 (Error - Email sudah terdaftar):**
```json
{ "status": "error", "message": "Email already registered", "data": null }
```
**Response 400 (Validation Error):**
```json
{ "status": "error", "message": "Name is required / Invalid email format / Password must be at least 8 characters", "data": null }
```

---

### `POST /api/auth/login`
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response 200 (Success):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "user_id": "uuid-string",
      "name": "John Doe",
      "email": "john@example.com",
      "is_active": true,
      "reset_otp": null,
      "reset_otp_expires": null,
      "created_at": "2026-05-02T13:00:00.000Z",
      "updated_at": "2026-05-02T13:00:00.000Z"
    }
  }
}
```
**Response 401 (Error):**
```json
{ "status": "error", "message": "Email not registered", "data": null }
// atau
{ "status": "error", "message": "Incorrect password", "data": null }
```

---

### `POST /api/auth/logout` 🔒
**Request Body:**
```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiIs..." }
```
**Response 200:**
```json
{ "status": "success", "message": "Logged out successfully", "data": null }
```

---

### `POST /api/auth/refresh-token`
**Request Body:**
```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiIs..." }
```
**Response 200 (Success):**
```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": { "accessToken": "eyJhbGciOiJIUzI1NiIs..." }
}
```
**Response 401 (Error):**
```json
{ "status": "error", "message": "Invalid refresh token", "data": null }
```

---

### `POST /api/auth/forgot-password`
**Request Body:**
```json
{ "email": "john@example.com" }
```
**Response 200 (Success):**
```json
{
  "status": "success",
  "message": "Forgot password initiated",
  "data": {
    "otp": "123456",
    "message": "OTP generated and saved. Use this OTP to reset your password."
  }
}
```
**Response 404 (Error):**
```json
{ "status": "error", "message": "Email not found", "data": null }
```

---

### `POST /api/auth/reset-password`
**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```
**Response 200 (Success):**
```json
{
  "status": "success",
  "message": "Password reset successful",
  "data": { "message": "Password reset successfully" }
}
```
**Response 400 (Error):**
```json
{ "status": "error", "message": "Invalid OTP", "data": null }
// atau
{ "status": "error", "message": "OTP has expired", "data": null }
```
**Response 404 (Error):**
```json
{ "status": "error", "message": "Email not found", "data": null }
```

---

## 3. Profile (`/api/profile`) 🔒

### `POST /api/profile`
**Request Body:**
```json
{
  "age": 25,
  "weight_kg": 70.5,
  "height_cm": 175.0,
  "gender": "male",
  "goal": "lose_weight"
}
```
> Goal options: `lose_weight`, `gain_weight`, `maintain`

**Response 201 (Success):**
```json
{
  "status": "success",
  "message": "Profile created successfully",
  "data": {
    "profile_id": "uuid-string",
    "user_id": "uuid-string",
    "age": 25,
    "weight_kg": 70.5,
    "height_cm": 175.0,
    "gender": "male",
    "goal": "lose_weight",
    "updated_at": "2026-05-02T13:00:00.000Z"
  }
}
```
**Response 409 (Error):**
```json
{ "status": "error", "message": "Profile already exists", "data": null }
```

---

### `GET /api/profile`
**Response 200:**
```json
{
  "status": "success",
  "message": "Profile retrieved successfully",
  "data": {
    "profile_id": "uuid-string",
    "user_id": "uuid-string",
    "age": 25,
    "weight_kg": 70.5,
    "height_cm": 175.0,
    "gender": "male",
    "goal": "lose_weight",
    "updated_at": "2026-05-02T13:00:00.000Z"
  }
}
```

---

### `PUT /api/profile`
**Request Body (semua field optional):**
```json
{
  "age": 26,
  "weight_kg": 68.0,
  "height_cm": 175.0,
  "gender": "male",
  "goal": "maintain"
}
```
**Response 200:**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": { "profile_id": "...", "age": 26, "weight_kg": 68.0, "..." : "..." }
}
```

---

### `GET /api/profile/preferences`
**Response 200:**
```json
{
  "status": "success",
  "message": "Preferences retrieved successfully",
  "data": {
    "pref_id": "uuid-string",
    "user_id": "uuid-string",
    "diet_type": "vegetarian",
    "daily_budget": 50000,
    "currency": "IDR",
    "created_at": "2026-05-02T13:00:00.000Z"
  }
}
```

---

### `PUT /api/profile/preferences`
**Request Body:**
```json
{
  "diet_type": "vegetarian",
  "daily_budget": 50000,
  "currency": "IDR"
}
```
**Response 200:**
```json
{
  "status": "success",
  "message": "Preferences updated successfully",
  "data": {
    "pref_id": "uuid-string",
    "user_id": "uuid-string",
    "diet_type": "vegetarian",
    "daily_budget": 50000,
    "currency": "IDR",
    "created_at": "2026-05-02T13:00:00.000Z"
  }
}
```

---

## 4. Foods (`/api/foods`) 🔒

### `GET /api/foods`
**Query Params (optional):** `?search=nasi&category=indonesian`

**Response 200:**
```json
{
  "status": "success",
  "message": "Foods retrieved successfully",
  "data": [
    {
      "food_id": "uuid-string",
      "name": "Nasi Goreng",
      "calories": 250.0,
      "protein_g": 8.5,
      "carbs_g": 35.0,
      "fat_g": 9.0,
      "price_estimate": 15000,
      "category": "indonesian",
      "source": "local",
      "image_url": "https://example.com/nasi-goreng.jpg"
    }
  ]
}
```

---

### `GET /api/foods/:foodId`
**Response 200:**
```json
{
  "status": "success",
  "message": "Food retrieved successfully",
  "data": {
    "food_id": "uuid-string",
    "name": "Nasi Goreng",
    "calories": 250.0,
    "protein_g": 8.5,
    "carbs_g": 35.0,
    "fat_g": 9.0,
    "price_estimate": 15000,
    "category": "indonesian",
    "source": "local",
    "image_url": null
  }
}
```
**Response 404:**
```json
{ "status": "error", "message": "Food not found", "data": null }
```

---

## 5. Nutrition (`/api/nutrition`) 🔒

### `GET /api/nutrition/calculate`
**Query Params (optional):** `?activity_level=moderate`
> Options: `sedentary`, `light`, `moderate`, `active`, `very_active`

**Response 200:**
```json
{
  "status": "success",
  "message": "Nutrition calculated successfully",
  "data": {
    "bmr": 1648,
    "tdee": 2554,
    "dailyCalorieTarget": 2054,
    "macros": {
      "protein": 154,
      "carbs": 205,
      "fat": 68
    }
  }
}
```
**Response 404:**
```json
{ "status": "error", "message": "Profile not found. Please create your profile first.", "data": null }
```

---

### `GET /api/nutrition/food/:foodId`
**Response 200:**
```json
{
  "status": "success",
  "message": "Food nutrition retrieved successfully",
  "data": {
    "food_id": "uuid-string",
    "name": "Nasi Goreng",
    "calories": 250.0,
    "protein_g": 8.5,
    "carbs_g": 35.0,
    "fat_g": 9.0,
    "price_estimate": 15000,
    "category": "indonesian",
    "source": "local",
    "image_url": null,
    "recipe": {
      "recipe_id": "uuid-string",
      "food_id": "uuid-string",
      "ingredients": "Nasi, Kecap, Bawang...",
      "steps": "1. Panaskan minyak...",
      "prep_time_min": 15
    }
  }
}
```
**Response 404:**
```json
{ "status": "error", "message": "Food not found", "data": null }
```

---

## 6. Recommendations (`/api/recommendations`) 🔒

### `GET /api/recommendations`
**Query Params (optional):** `?budget=50000&preference=vegetarian`

**Response 200:**
```json
{
  "status": "success",
  "message": "Recommendations generated successfully",
  "data": {
    "recommendation_id": "uuid-string",
    "total_calories": 1980,
    "target_calories": 2054,
    "meals": {
      "breakfast": [
        {
          "food_id": "uuid",
          "name": "Oatmeal",
          "calories": 150,
          "protein_g": 5,
          "carbs_g": 27,
          "fat_g": 3,
          "price_estimate": 10000,
          "category": "healthy",
          "source": "local",
          "image_url": null
        }
      ],
      "lunch": [],
      "dinner": [],
      "snack": []
    }
  }
}
```
**Response 404:**
```json
{ "status": "error", "message": "Profile not found. Please create your profile first.", "data": null }
```

---

## 7. Recipes (`/api/recipes`) 🔒

### `GET /api/recipes`
**Query Params (optional):** `?foodId=uuid-string`

**Response 200:**
```json
{
  "status": "success",
  "message": "Recipes retrieved successfully",
  "data": [
    {
      "recipe_id": "uuid-string",
      "food_id": "uuid-string",
      "ingredients": "Nasi 200g, Kecap 2 sdm...",
      "steps": "1. Panaskan minyak...",
      "prep_time_min": 15
    }
  ]
}
```

### `GET /api/recipes/:recipeId`
**Response 200:**
```json
{
  "status": "success",
  "message": "Recipe retrieved successfully",
  "data": {
    "recipe_id": "uuid-string",
    "food_id": "uuid-string",
    "ingredients": "Nasi 200g, Kecap 2 sdm...",
    "steps": "1. Panaskan minyak...",
    "prep_time_min": 15
  }
}
```
**Response 404:**
```json
{ "status": "error", "message": "Recipe not found", "data": null }
```

---

## 8. History (`/api/history`) 🔒

### `POST /api/history`
**Request Body:**
```json
{
  "food_id": "uuid-string",
  "qty_gram": 200,
  "consumed_at": "2026-05-02T12:00:00.000Z"
}
```
> `consumed_at` optional, default = now

**Response 201:**
```json
{
  "status": "success",
  "message": "Food history added successfully",
  "data": {
    "history_id": "uuid-string",
    "user_id": "uuid-string",
    "food_id": "uuid-string",
    "consumed_at": "2026-05-02T12:00:00.000Z",
    "qty_gram": 200,
    "food": {
      "food_id": "uuid-string",
      "name": "Nasi Goreng",
      "calories": 250.0,
      "protein_g": 8.5,
      "carbs_g": 35.0,
      "fat_g": 9.0,
      "price_estimate": 15000,
      "category": "indonesian",
      "source": "local",
      "image_url": null
    }
  }
}
```
**Response 404:**
```json
{ "status": "error", "message": "Food not found", "data": null }
```

---

### `GET /api/history`
**Query Params (optional):** `?date=2026-05-02`

**Response 200:**
```json
{
  "status": "success",
  "message": "Food history retrieved successfully",
  "data": [
    {
      "history_id": "uuid-string",
      "user_id": "uuid-string",
      "food_id": "uuid-string",
      "consumed_at": "2026-05-02T12:00:00.000Z",
      "qty_gram": 200,
      "food": {
        "food_id": "uuid-string",
        "name": "Nasi Goreng",
        "calories": 250.0,
        "protein_g": 8.5,
        "carbs_g": 35.0,
        "fat_g": 9.0,
        "price_estimate": 15000,
        "category": "indonesian",
        "source": "local",
        "image_url": null
      }
    }
  ]
}
```

---

### `GET /api/history/summary`
**Response 200:**
```json
{
  "status": "success",
  "message": "Daily summary retrieved successfully",
  "data": {
    "date": "2026-05-02",
    "totalCalories": 1250,
    "targetCalories": 2054,
    "remaining": 804,
    "percentage": 61,
    "macros": {
      "protein": 45,
      "carbs": 120,
      "fat": 38
    }
  }
}
```

---

### `DELETE /api/history/:historyId`
**Response 200:**
```json
{ "status": "success", "message": "Food history deleted successfully", "data": null }
```
**Response 404:**
```json
{ "status": "error", "message": "History entry not found", "data": null }
```
**Response 403:**
```json
{ "status": "error", "message": "You are not authorized to delete this entry", "data": null }
```

---

## 9. Articles (`/api/articles`) 🔒

### `GET /api/articles`
**Query Params (optional):** `?category=nutrition`

**Response 200:**
```json
{
  "status": "success",
  "message": "Articles retrieved successfully",
  "data": [
    {
      "article_id": "uuid-string",
      "title": "Manfaat Protein untuk Tubuh",
      "content": "Protein adalah salah satu makronutrien penting... (max 200 chars preview)...",
      "category": "nutrition",
      "image_url": "https://example.com/article.jpg",
      "published_at": "2026-05-01T08:00:00.000Z"
    }
  ]
}
```

### `GET /api/articles/:articleId`
**Response 200:**
```json
{
  "status": "success",
  "message": "Article retrieved successfully",
  "data": {
    "article_id": "uuid-string",
    "title": "Manfaat Protein untuk Tubuh",
    "content": "Full article content here...",
    "category": "nutrition",
    "image_url": "https://example.com/article.jpg",
    "published_at": "2026-05-01T08:00:00.000Z"
  }
}
```
**Response 404:**
```json
{ "status": "error", "message": "Article not found", "data": null }
```

---

## 10. Notifications (`/api/notifications`) 🔒

### `GET /api/notifications/settings`
**Response 200:**
```json
{
  "status": "success",
  "message": "Notification settings retrieved successfully",
  "data": [
    {
      "notif_id": "uuid-string",
      "user_id": "uuid-string",
      "type": "meal_reminder",
      "message": "Waktunya makan siang!",
      "scheduled_at": "2026-05-02T12:00:00.000Z",
      "is_sent": false,
      "created_date": "2026-05-01T08:00:00.000Z"
    }
  ]
}
```

### `PUT /api/notifications/settings`
**Request Body:**
```json
{
  "type": "meal_reminder",
  "message": "Waktunya makan siang!",
  "scheduled_at": "2026-05-02T12:00:00.000Z"
}
```
**Response 200:**
```json
{
  "status": "success",
  "message": "Notification settings updated successfully",
  "data": {
    "notif_id": "uuid-string",
    "user_id": "uuid-string",
    "type": "meal_reminder",
    "message": "Waktunya makan siang!",
    "scheduled_at": "2026-05-02T12:00:00.000Z",
    "is_sent": false,
    "created_date": "2026-05-01T08:00:00.000Z"
  }
}
```

### `GET /api/notifications/daily`
**Response 200:**
```json
{
  "status": "success",
  "message": "Daily notifications retrieved successfully",
  "data": [
    {
      "notif_id": "uuid-string",
      "user_id": "uuid-string",
      "type": "meal_reminder",
      "message": "Waktunya sarapan!",
      "scheduled_at": "2026-05-02T07:00:00.000Z",
      "is_sent": false,
      "created_date": "2026-05-01T08:00:00.000Z"
    }
  ]
}
```

### `POST /api/notifications/token`
**Request Body:**
```json
{
  "device_token": "fcm-device-token-string",
  "platform": "android"
}
```
**Response 201:**
```json
{ "status": "success", "message": "Device token saved successfully", "data": null }
```

### `DELETE /api/notifications/token`
**Response 200:**
```json
{ "status": "success", "message": "Device token deleted successfully", "data": null }
```

---

## Error Responses (Global)

### 401 Unauthorized (Token tidak valid/expired)
```json
{ "status": "error", "message": "Unauthorized: No token provided", "data": null }
// atau
{ "status": "error", "message": "Unauthorized: Invalid token", "data": null }
```

### 500 Internal Server Error
```json
{ "status": "error", "message": "Internal server error", "data": null }
```

---

## Ringkasan Endpoint

| # | Method | Endpoint | Auth | Deskripsi |
|---|--------|----------|------|-----------|
| 1 | GET | `/health` | ❌ | Health check |
| 2 | POST | `/api/auth/register` | ❌ | Register user baru |
| 3 | POST | `/api/auth/login` | ❌ | Login user |
| 4 | POST | `/api/auth/logout` | ✅ | Logout user |
| 5 | POST | `/api/auth/refresh-token` | ❌ | Refresh access token |
| 6 | POST | `/api/auth/forgot-password` | ❌ | Request OTP reset password |
| 7 | POST | `/api/auth/reset-password` | ❌ | Reset password dengan OTP |
| 8 | POST | `/api/profile` | ✅ | Buat profil |
| 9 | GET | `/api/profile` | ✅ | Ambil profil |
| 10 | PUT | `/api/profile` | ✅ | Update profil |
| 11 | GET | `/api/profile/preferences` | ✅ | Ambil preferensi |
| 12 | PUT | `/api/profile/preferences` | ✅ | Update preferensi |
| 13 | GET | `/api/foods` | ✅ | List semua makanan |
| 14 | GET | `/api/foods/:foodId` | ✅ | Detail makanan |
| 15 | GET | `/api/nutrition/calculate` | ✅ | Hitung kebutuhan nutrisi |
| 16 | GET | `/api/nutrition/food/:foodId` | ✅ | Nutrisi per makanan |
| 17 | GET | `/api/recommendations` | ✅ | Rekomendasi makanan |
| 18 | GET | `/api/recipes` | ✅ | List resep |
| 19 | GET | `/api/recipes/:recipeId` | ✅ | Detail resep |
| 20 | POST | `/api/history` | ✅ | Tambah riwayat makan |
| 21 | GET | `/api/history` | ✅ | List riwayat makan |
| 22 | GET | `/api/history/summary` | ✅ | Ringkasan harian |
| 23 | DELETE | `/api/history/:historyId` | ✅ | Hapus riwayat |
| 24 | GET | `/api/articles` | ✅ | List artikel |
| 25 | GET | `/api/articles/:articleId` | ✅ | Detail artikel |
| 26 | GET | `/api/notifications/settings` | ✅ | Ambil setting notifikasi |
| 27 | PUT | `/api/notifications/settings` | ✅ | Update setting notifikasi |
| 28 | GET | `/api/notifications/daily` | ✅ | Notifikasi harian |
| 29 | POST | `/api/notifications/token` | ✅ | Simpan device token |
| 30 | DELETE | `/api/notifications/token` | ✅ | Hapus device token |
