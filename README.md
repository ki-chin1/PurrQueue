# PurrQueue Backend API Documentation

## Folder Structure

```
server/
├── api/
│   ├── cats.php          # Main API endpoint for cat operations
│   └── .htaccess         # URL rewriting rules
├── config/
│   └── database.php      # Database connection (PDO)
├── src/
│   └── CatRepository.php # Data access layer for cats
├── index.php             # Legacy entry point (can be removed)
└── database.php          # Legacy file (kept for compatibility)
```

## File Descriptions

### `config/database.php`
- **Responsibility:** Database connection
- **Features:**
  - Uses PDO for secure database access
  - Prepared statements support
  - UTF-8 character set
  - Error mode exception handling
- **Output:** Creates `$pdo` variable for use in API endpoints

### `src/CatRepository.php`
- **Responsibility:** Data access layer
- **Methods:**
  - `getAllCats()` - Fetch all cats sorted by created_at DESC
  - `getCatById($id)` - Fetch single cat by ID
- **Features:**
  - Uses prepared statements (prevents SQL injection)
  - Throws exceptions on errors
  - Clean separation of concerns

### `api/cats.php`
- **Responsibility:** HTTP request handling
- **Features:**
  - Routes GET requests
  - Returns JSON responses
  - Proper HTTP status codes (200, 404, 405, 500)
  - Error handling with meaningful messages

## API Endpoints

### 1. GET /api/cats.php
**Get all cats**

**Request:**
```bash
curl http://localhost/purrqueue/server/api/cats.php
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1",
      "cattery_id": "1",
      "name": "Whiskers",
      "breed": "Persian",
      "age_months": "24",
      "gender": "MALE",
      "color": "Orange",
      "description": "A fluffy and friendly cat",
      "type": "ADOPTION",
      "price": null,
      "status": "AVAILABLE",
      "created_at": "2026-01-27 10:30:45",
      "updated_at": "2026-01-27 10:30:45"
    },
    {
      "id": "2",
      "cattery_id": "1",
      "name": "Luna",
      "breed": "Siamese",
      "age_months": "12",
      "gender": "FEMALE",
      "color": "Cream",
      "description": "Elegant and playful",
      "type": "SALE",
      "price": "299.99",
      "status": "AVAILABLE",
      "created_at": "2026-01-26 14:20:15",
      "updated_at": "2026-01-26 14:20:15"
    }
  ]
}
```

---

### 2. GET /api/cats.php?id={id}
**Get a single cat by ID**

**Request:**
```bash
curl http://localhost/purrqueue/server/api/cats.php?id=1
```

**Response (200 OK):**
```json
{
  "id": "1",
  "cattery_id": "1",
  "name": "Whiskers",
  "breed": "Persian",
  "age_months": "24",
  "gender": "MALE",
  "color": "Orange",
  "description": "A fluffy and friendly cat",
  "type": "ADOPTION",
  "price": null,
  "status": "AVAILABLE",
  "created_at": "2026-01-27 10:30:45",
  "updated_at": "2026-01-27 10:30:45"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Not found",
  "message": "Cat with ID 999 not found"
}
```

---

## HTTP Status Codes

| Code | Scenario |
|------|----------|
| **200** | Successful GET request |
| **404** | Cat not found (by ID) |
| **405** | Non-GET request method |
| **500** | Database error or internal error |

---

## Database Setup

Create the database and table:

```sql
CREATE DATABASE purrqueuedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE purrqueuedb;

CREATE TABLE cats (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cattery_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age_months INT UNSIGNED,
    gender ENUM('MALE', 'FEMALE') NOT NULL,
    color VARCHAR(50),
    description TEXT,
    type ENUM('ADOPTION', 'SALE') NOT NULL,
    price DECIMAL(10,2) NULL,
    status ENUM('AVAILABLE', 'PENDING', 'ADOPTED', 'SOLD') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO cats (cattery_id, name, breed, age_months, gender, color, description, type, price, status)
VALUES 
(1, 'Whiskers', 'Persian', 24, 'MALE', 'Orange', 'A fluffy and friendly cat', 'ADOPTION', NULL, 'AVAILABLE'),
(1, 'Luna', 'Siamese', 12, 'FEMALE', 'Cream', 'Elegant and playful', 'SALE', 299.99, 'AVAILABLE'),
(1, 'Mittens', 'Maine Coon', 36, 'MALE', 'Black', 'Large and gentle', 'ADOPTION', NULL, 'ADOPTED');
```

---

## Security Features

✅ **SQL Injection Prevention:** Using prepared statements  
✅ **PDO Exception Handling:** Errors don't expose sensitive info  
✅ **Clean JSON Output:** Proper content-type headers  
✅ **HTTP Status Codes:** RESTful best practices  

---

## Code Architecture

```
Request → api/cats.php → CatRepository → database.php → MySQL
  ↓              ↓              ↓             ↓          ↓
Route      Validate     Execute Query    Connect      Return Data
 Check     & Handle     with Prepared   via PDO      Rows
           Errors      Statements
```

---

## Testing with cURL

### Get all cats:
```bash
curl -X GET http://localhost/purrqueue/server/api/cats.php
```

### Get cat by ID:
```bash
curl -X GET http://localhost/purrqueue/server/api/cats.php?id=1
```

### Test 404 response:
```bash
curl -X GET http://localhost/purrqueue/server/api/cats.php?id=999
```

### Test 405 response:
```bash
curl -X POST http://localhost/purrqueue/server/api/cats.php
```

---

## Next Steps

1. **Write Operations:** Create `POST`, `PUT`, `DELETE` endpoints in new files
2. **Filtering:** Add query parameters for breed, gender, status filtering
3. **Pagination:** Add `?page=1&limit=10` parameters
4. **Authentication:** Add token-based auth for write operations
5. **Validation:** Add input validation layer
6. **Logging:** Add error logging to files
