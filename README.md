# ProjectCompass

A web-based educational platform that helps students explore and narrow
down software project ideas through structured guidance, curated content,
and rule-based filtering.

---

## Project Overview

Students in computer science and related fields often struggle to select
appropriate software project ideas due to unclear scope, skill mismatch,
and unstructured online resources. ProjectCompass solves this by offering:

- A curated library of 14 project ideas across 6 categories
- Guided filtering based on skill level, time, team size, and goals
- Clear project briefs with scope boundaries, core features, and what to avoid
- An admin panel for managing all project content

---

## Features

### Student-Facing
- **Homepage** — Problem statement, how it works, and two clear calls to action
- **Categories page** — Browse all 6 categories with project counts
- **Category detail page** — View all projects within a category with filters
- **Explore page** — Search and filter all projects by difficulty, category, and tech stack
- **Project detail page** — Full brief with breadcrumb, tech stack, core features,
  what not to build, and optional extensions
- **Narrow My Project** — 5-step guided quiz with rule-based filtering and results page
- **Authentication** — Register and login for admin access

### Admin-Facing
- **Dashboard overview** — Stats cards, category bar chart, difficulty breakdown,
  recent projects table
- **Manage projects** — View, search, filter, add, edit, and delete all projects
- **Manage categories** — View, add, edit, and delete all categories
- **Protected routes** — All admin pages require a valid JWT token

---

## Frameworks and Libraries Used

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client for API calls |
| Google Fonts (Playfair Display, DM Sans) | Typography |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| Prisma v5 | ORM for database access |
| PostgreSQL | Relational database |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |
| nodemon | Development auto-restart |

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ProjectCompass.git
cd ProjectCompass
```

---

### Step 2 — Set up the backend

Install backend dependencies:

```bash
npm install
```

Create a `.env` file in the root directory:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/projectcompass"
PORT=3000
JWT_SECRET=projectcompass_secret_key_2024

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

---

### Step 3 — Set up the database

Open pgAdmin or psql and create the database:

```sql
CREATE DATABASE projectcompass;
```

Run Prisma migrations to create the tables:

```bash
npx prisma migrate dev --name init
```

Generate the Prisma client:

```bash
npx prisma generate
```

---

### Step 4 — Seed the database

```bash
npm run seed
```

This creates:
- 1 admin user: `admin@projectcompass.com` / `admin123`
- 6 categories
- 14 curated project ideas

---

### Step 5 — Start the backend server

```bash
npm run dev
```

Backend runs at: `http://localhost:3000`

---

### Step 6 — Set up the frontend

In a new terminal, navigate to the client folder:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:
VITE_API_URL=http://localhost:3000/api

---

### Step 7 — Start the frontend

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### Step 8 — Open the application

Open your browser and go to:
http://localhost:5173

To access the admin dashboard, go to `/login` and use:
- Email: `admin@projectcompass.com`
- Password: `admin123`

---

## Project Structure
ProjectCompass/
├── src/
│   ├── index.js                        Express server entry point
│   ├── prisma/
│   │   └── client.js                   Shared Prisma client instance
│   ├── routes/
│   │   ├── authRoutes.js               POST /api/auth/login, /api/auth/register
│   │   ├── projectRoutes.js            CRUD routes for /api/projects
│   │   └── categoryRoutes.js           CRUD routes for /api/categories
│   ├── services/
│   │   ├── authService.js              Registration and login logic
│   │   ├── projectService.js           Project business logic
│   │   └── categoryService.js          Category business logic
│   └── middleware/
│       └── authMiddleware.js           JWT verification middleware
├── prisma/
│   ├── schema.prisma                   Database schema
│   ├── seed.js                         Database seed script
│   └── migrations/                     Auto-generated migration files
├── client/
│   ├── src/
│   │   ├── App.jsx                     Route definitions
│   │   ├── main.jsx                    React entry point
│   │   ├── index.css                   Global styles and design tokens
│   │   ├── api/
│   │   │   └── api.js                  Axios instance and all API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx         Auth state and JWT management
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.css
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectCard.css
│   │   │   └── ProtectedRoute.jsx
│   │   └── pages/
│   │       ├── HomePage.jsx / .css
│   │       ├── CategoriesPage.jsx / .css
│   │       ├── CategoryDetailPage.jsx / .css
│   │       ├── ExplorePage.jsx / .css
│   │       ├── ProjectDetailPage.jsx / .css
│   │       ├── NarrowPage.jsx / .css
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       ├── AuthPages.css
│   │       ├── NotFoundPage.jsx
│   │       └── admin/
│   │           ├── AdminLayout.jsx / .css
│   │           ├── AdminOverview.jsx / .css
│   │           ├── AdminProjects.jsx
│   │           ├── AdminCategories.jsx
│   │           ├── AdminTable.css
│   │           ├── ProjectFormModal.jsx
│   │           └── ProjectFormModal.css
│   ├── .env                            Frontend environment variables
│   └── package.json
├── .env                                Backend environment variables
├── .gitignore
├── package.json
└── README.md

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Create new admin account | No |
| POST | /api/auth/login | Login and receive JWT token | No |

### Projects
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/projects | List all projects (supports filters) | No |
| GET | /api/projects/:id | Get single project with category | No |
| POST | /api/projects | Create new project | Yes |
| PUT | /api/projects/:id | Update existing project | Yes |
| DELETE | /api/projects/:id | Delete a project | Yes |

### Categories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/categories | List all categories with projects | No |
| GET | /api/categories/:id | Get single category with projects | No |
| POST | /api/categories | Create new category | Yes |
| PUT | /api/categories/:id | Update existing category | Yes |
| DELETE | /api/categories/:id | Delete a category | Yes |

### Query Parameters for GET /api/projects
| Parameter | Type | Description |
|-----------|------|-------------|
| difficulty | string | Filter by Beginner, Intermediate, or Advanced |
| categoryId | number | Filter by category ID |
| search | string | Search in title and description |

---

## Team Contributions

| Member | Role | Contributions |
|--------|------|---------------|
| [Your Name] | Full Stack Developer | Complete backend API, database schema, authentication system, all frontend pages and components, admin dashboard, UI design, deployment setup, and documentation |

---

## Color Palette

| Variable | Hex | Usage |
|----------|-----|-------|
| `--floral-white` | #fffcf2 | Page backgrounds |
| `--dust-grey` | #ccc5b9 | Borders, muted text |
| `--charcoal-brown` | #403d39 | Body text, secondary elements |
| `--carbon-black` | #252422 | Headings, admin sidebar |
| `--spicy-paprika` | #eb5e28 | Primary accent, CTAs |

---

## License

This project was built as a course-level web development milestone project.