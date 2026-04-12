# ProjectCompass — Backend API

## Project Overview

ProjectCompass is a web-based platform that helps students explore and
narrow down software project ideas through structured guidance and
rule-based filtering.

This repository contains the backend API built with Express.js, PostgreSQL,
and Prisma ORM.

---

## Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: PostgreSQL
- ORM: Prisma v5
- Environment: dotenv

---

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Moorani/ProjectCompass.git
cd ProjectCompass
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the PostgreSQL database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE projectcompass;
```

### 4. Create the .env file

Create a file named `.env` in the root directory and add:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/projectcompass"
PORT=3000

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### 5. Run Prisma migration

```bash
npx prisma migrate dev --name init
```

### 6. Generate Prisma client

```bash
npx prisma generate
```

### 7. Start the development server

```bash
npm run dev
```

The server will start at: `http://localhost:3000`

---

## Project Structure
ProjectCompass/
├── src/
│   ├── index.js                  Express server entry point
│   ├── prisma/
│   │   └── client.js             Shared Prisma client instance
│   ├── routes/
│   │   ├── projectRoutes.js      CRUD routes for /api/projects
│   │   └── categoryRoutes.js     CRUD routes for /api/categories
│   └── services/
│       ├── projectService.js     Business logic for Project model
│       └── categoryService.js    Business logic for Category model
├── prisma/
│   ├── schema.prisma             Database schema
│   └── migrations/               Auto-generated migration files
├── .env                          Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md

---

## API Endpoints

### Base URL
http://localhost:3000

### Health Check

| Method | URL | Description |
|--------|-----|-------------|
| GET | / | Check if API is running |

**Response:**
```json
{ "message": "ProjectCompass API is running" }
```

---

### Projects — /api/projects

#### GET /api/projects

Returns all projects. Supports optional query filters.

**Query parameters (all optional):**

| Parameter | Type | Description |
|-----------|------|-------------|
| difficulty | string | Filter by Beginner, Intermediate, or Advanced |
| categoryId | number | Filter by category ID |
| search | string | Search in title and description |

**Example requests:**
GET /api/projects
GET /api/projects?difficulty=Beginner
GET /api/projects?categoryId=1
GET /api/projects?search=budget

**Example response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Student Budget Tracker",
      "description": "A personal finance tool for students.",
      "problem": "Students overspend without realising it.",
      "targetUsers": "University students.",
      "difficulty": "Beginner",
      "effort": "3-4 weeks",
      "stack": ["React", "localStorage", "Chart.js"],
      "coreFeatures": ["Add/edit/delete expense entries", "Categorise spending"],
      "notBuild": ["Bank account sync", "Multi-currency support"],
      "extensions": ["Export data as CSV", "Dark mode"],
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Web Applications",
        "icon": "globe",
        "description": "Browser-based apps serving real user needs"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### GET /api/projects/:id

Returns a single project by ID.

**Example request:**
GET /api/projects/1

**Example response:**
```json
{
  "success": true,
  "data": { ...project object with category... }
}
```

**Not found response:**
```json
{
  "success": false,
  "error": "Project not found"
}
```

---

#### POST /api/projects

Creates a new project.

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| title | string | Project title |
| description | string | Short project description |
| problem | string | Problem the project solves |
| targetUsers | string | Who the project is for |
| difficulty | string | Beginner, Intermediate, or Advanced |
| effort | string | Estimated time e.g. 3-4 weeks |
| categoryId | number | ID of an existing category |

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| stack | string[] | Array of technologies |
| coreFeatures | string[] | Array of core feature descriptions |
| notBuild | string[] | Array of out-of-scope items |
| extensions | string[] | Array of optional extension ideas |

**Example request body:**
```json
{
  "title": "Student Budget Tracker",
  "description": "A personal finance tool for students.",
  "problem": "Students overspend without realising it.",
  "targetUsers": "University students.",
  "difficulty": "Beginner",
  "effort": "3-4 weeks",
  "stack": ["React", "localStorage", "Chart.js"],
  "coreFeatures": ["Add/edit/delete expense entries", "Categorise spending"],
  "notBuild": ["Bank account sync", "Multi-currency support"],
  "extensions": ["Export data as CSV", "Dark mode"],
  "categoryId": 1
}
```

**Example response:**
```json
{
  "success": true,
  "data": { ...created project object... }
}
```

**Validation error response:**
```json
{
  "success": false,
  "error": "Missing required field: title"
}
```

---

#### PUT /api/projects/:id

Updates an existing project. Send only the fields you want to update.

**Example request body:**
```json
{ "effort": "3-5 weeks" }
```

**Example response:**
```json
{
  "success": true,
  "data": { ...updated project object... }
}
```

---

#### DELETE /api/projects/:id

Deletes a project by ID.

**Example response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### Categories — /api/categories

#### GET /api/categories

Returns all categories with their associated projects.

**Example response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": 1,
      "name": "Web Applications",
      "icon": "globe",
      "description": "Browser-based apps serving real user needs",
      "projects": [...],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### GET /api/categories/:id

Returns a single category with all its projects.

**Not found response:**
```json
{
  "success": false,
  "error": "Category not found"
}
```

---

#### POST /api/categories

Creates a new category.

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| name | string | Category name (must be unique) |

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| icon | string | Icon identifier string |
| description | string | Category description |

**Example request body:**
```json
{
  "name": "Web Applications",
  "icon": "globe",
  "description": "Browser-based apps serving real user needs"
}
```

---

#### PUT /api/categories/:id

Updates an existing category. Send only the fields you want to update.

**Example request body:**
```json
{ "description": "Updated description here" }
```

---

#### DELETE /api/categories/:id

Deletes a category by ID.

**Important:** Delete or reassign all projects in a category before
deleting the category, otherwise the request will fail due to the
foreign key constraint.

**Example response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Workflows Implemented

### Workflow 1 — Browse and Explore Project Ideas

Implemented via:
- `GET /api/projects` with filters (difficulty, category, keyword search)
- `GET /api/projects/:id` for full project detail
- `GET /api/categories` for category listing

### Workflow 3 — Admin Panel

Implemented via:
- `POST /api/projects` — admin creates a project
- `PUT /api/projects/:id` — admin edits a project
- `DELETE /api/projects/:id` — admin deletes a project
- `POST /api/categories` — admin creates a category
- `PUT /api/categories/:id` — admin edits a category
- `DELETE /api/categories/:id` — admin deletes a category

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request, missing required field |
| 404 | Resource not found |
| 500 | Internal server error |