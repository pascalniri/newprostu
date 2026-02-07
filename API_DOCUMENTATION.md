# API Endpoints Documentation

Complete list of all API endpoints for the UMich Q&A Platform.

---

## Public Endpoints

### 1. Submit Question/Resource

```
POST /api/submissions
```

**Description:** Submit a new question or resource for admin approval.

**Request Body:** FormData

- `title` (required): Title of the question/resource
- `postType` (required): "Question" or "Resource"
- `topic` (required): Topic category
- `school` (required): School name
- `campus` (required): Campus location
- `gradeLevel` (required): Student grade level
- `details` (required): Full description
- `yourName` (optional): Author name
- `yourSchool` (optional): Author school
- `tags` (optional): Comma-separated tags
- `linkUrl` (optional): External link URL
- `file` (optional): File upload

**Response:**

```json
{
  "success": true,
  "message": "Submission successful!",
  "submissionId": "uuid"
}
```

---

### 2. Get Approved Content

```
GET /api/content?university=UMich&type=Question&topic=Mathematics&search=calculus
```

**Description:** Fetch approved questions and resources with optional filters.

**Query Parameters:**

- `university` (optional): Filter by university
- `type` (optional): "Question" or "Resource"
- `topic` (optional): Filter by topic
- `search` (optional): Search in title and details

**Response:**

```json
{
  "success": true,
  "content": [...]
}
```

---

### 3. Get Dropdown Data (Deprecated - Use Individual Endpoints)

```
GET /api/dropdowns
```

> **⚠️ DEPRECATED**: This combined endpoint is deprecated. Use individual endpoints below for better performance.

**Description:** Fetch all dropdown options for forms (topics, schools, campuses, etc.).

**Response:**

```json
{
  "success": true,
  "data": {
    "topics": [...],
    "schools": [...],
    "campuses": [...],
    "gradeLevels": [...],
    "universities": [...]
  }
}
```

---

### 3a. Get Topics

```
GET /api/topics
```

**Description:** Fetch all active topics.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mathematics",
      "description": "Math-related topics",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 3b. Get Schools

```
GET /api/schools
```

**Description:** Fetch all active schools with abbreviations.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "College of Engineering",
      "abbreviation": "CoE",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 3c. Get Campuses

```
GET /api/campuses
```

**Description:** Fetch all active campuses with location information.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "North Campus",
      "location": "Ann Arbor, MI",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 3d. Get Grade Levels

```
GET /api/grade-levels
```

**Description:** Fetch all active grade levels ordered by index.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Freshman",
      "order_index": 1,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## Admin Authentication Endpoints

### 4. Admin Login

```
POST /api/auth/login
```

**Description:** Authenticate admin user.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "user": { "id": "uuid", "email": "admin@example.com" },
  "session": { "access_token": "..." }
}
```

---

### 5. Admin Logout

```
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer {token}`

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Admin Management Endpoints

All admin endpoints require authentication header: `Authorization: Bearer {token}`

### 6. Get Pending Submissions

```
GET /api/submissions
```

**Description:** Fetch all pending submissions (admin only).

**Response:**

```json
{
  "success": true,
  "submissions": [...]
}
```

---

### 7. Approve/Reject Submission

```
POST /api/approve
```

**Description:** Approve or reject a pending submission.

**Request Body:**

```json
{
  "submissionId": "uuid",
  "action": "approve",
  "university": "UMich"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Submission approved successfully"
}
```

---

### 8. Admin Statistics

```
GET /api/admin/stats
```

**Description:** Get dashboard statistics.

**Response:**

```json
{
  "success": true,
  "data": {
    "pendingSubmissions": 5,
    "approvedContent": 42,
    "submissionsByType": { "questions": 3, "resources": 2 },
    "contentByUniversity": { "UMich": 20, "Harvard": 12, "Stanford": 10 }
  }
}
```

---

## CRUD Endpoints for Dropdown Management

### 9. Topics Management

```
GET    /api/admin/topics              # List all topics
POST   /api/admin/topics              # Create new topic
PUT    /api/admin/topics              # Update topic
DELETE /api/admin/topics?id={uuid}    # Delete topic
```

**Create/Update Body:**

```json
{
  "name": "Topic Name",
  "description": "Optional description",
  "is_active": true
}
```

---

### 10. Schools Management

```
GET    /api/admin/schools
POST   /api/admin/schools
PUT    /api/admin/schools
DELETE /api/admin/schools?id={uuid}
```

**Create/Update Body:**

```json
{
  "name": "School Name",
  "abbreviation": "SN",
  "is_active": true
}
```

---

### 11. Campuses Management

```
GET    /api/admin/campuses
POST   /api/admin/campuses
PUT    /api/admin/campuses
DELETE /api/admin/campuses?id={uuid}
```

**Create/Update Body:**

```json
{
  "name": "Campus Name",
  "location": "Location description",
  "is_active": true
}
```

---

### 12. Grade Levels Management

```
GET    /api/admin/grade-levels
POST   /api/admin/grade-levels
PUT    /api/admin/grade-levels
DELETE /api/admin/grade-levels?id={uuid}
```

**Create/Update Body:**

```json
{
  "name": "Grade Level Name",
  "order_index": 1,
  "is_active": true
}
```

---

## Authentication

Admin endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJI...your_access_token
```

Get the token from `/api/auth/login` and store it securely.

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:

- `400` - Bad Request (missing required fields)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not an admin)
- `404` - Not Found
- `500` - Internal Server Error
