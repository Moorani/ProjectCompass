# 🧭 ProjectCompass

A web-based educational platform that helps CS students explore, filter, and
start software project ideas — with structured guidance, curated briefs, and
rule-based matching.

---

## Project Overview

Students in computer science and related fields often struggle to select
appropriate software project ideas due to unclear scope, skill mismatch,
and unstructured online resources. ProjectCompass solves this by offering:

- A curated library of 14 project ideas across 6 categories
- A 5-step guided quiz that matches projects to your skill, time, and goals
- Clear project briefs with scope boundaries, core features, and what to avoid
- A full admin panel for managing all project and category content

---

## Live Application

- **Frontend:** https://projectcompass.vercel.app
- **Backend API:** https://projectcompass-api.onrender.com
- **Admin login:** admin@projectcompass.com / admin123

---

## Live Features 

### Student-Facing
- **Homepage** — Hero section, how-it-works steps, and a guided quiz CTA
- **Categories page** — Browse all 6 categories with live project counts and search
- **Category detail page** — View all projects within a category with difficulty filtering
- **Explore page** — Search and filter all projects by difficulty, category, and tech stack
- **Project detail page** — Full brief with breadcrumb navigation, tech stack chips,
  core features, what not to build, optional extensions, and a Narrow My Project CTA
- **Narrow My Project** — 5-step guided quiz with rule-based filtering, warnings, and a results page
- **Authentication** — Register and login for admin access
- **Footer** — Consistent site-wide footer with navigation links and brand identity

### Admin-Facing
- **Dashboard overview** — Stats cards, category bar chart, difficulty breakdown, recent projects table
- **Manage projects** — View, search, filter, add, edit, and delete all projects
- **Manage categories** — View, add, edit, and delete all categories
- **Protected routes** — All admin pages require a valid JWT token

---

## Tech Stack

### Frontend
| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| Vite | Latest | Build tool and dev server |
| React Router | v6 | Client-side routing |
| Axios | Latest | HTTP client for API calls |
| Google Fonts — Barlow + Inter | — | Typography |

### Backend
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v18+ | Runtime |
| Express.js | Latest | Web framework |
| Prisma | v5 | ORM for database access |
| PostgreSQL | v14+ | Relational database |
| bcryptjs | Latest | Password hashing |
| jsonwebtoken | Latest | JWT authentication |
| dotenv | Latest | Environment variable management |
| cors | Latest | Cross-origin resource sharing |
| nodemon | Latest | Development auto-restart |

---

## Design System

### Typography
| Role | Font | Weights Used |
|------|------|-------------|
| Headings (`h1–h3`) | Barlow | 700, 800, 900 |
| Body / UI | Inter | 400, 500, 600, 700 |

Barlow at weight 800–900 with tight letter-spacing (`-0.02em`) gives headings
a clean, modern, editorial feel. Inter provides excellent legibility at all
body and UI sizes.

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--floral-white` | `#fffcf2` | Page backgrounds |
| `--dust-grey` | `#ccc5b9` | Borders, dividers, muted elements |
| `--charcoal-brown` | `#403d39` | Body text, secondary UI |
| `--carbon-black` | `#252422` | Headings, dark surfaces |
| `--spicy-paprika` | `#eb5e28` | Primary accent, CTAs, active states |
| `--paprika-dark` | `#c94e1f` | Hover state for primary buttons |
| `--paprika-light` | `#fdf0eb` | Tinted backgrounds, eyebrow pills |
| `--success` | `#2d6a4f` | Beginner badge, success alerts |
| `--error` | `#a32d2d` | Advanced badge, error alerts |
| `--warning` | `#b5750a` | Warning alerts |

### Difficulty Badges
| Level | Background | Text |
|-------|-----------|------|
| Beginner | `#d6ede2` | `#2d7a52` |
| Intermediate | `#fef0d6` | `#9a6c1a` |
| Advanced | `#fde0dc` | `#b93a2a` |

### Design Patterns Used Across All Pages
- **Hero sections** — Warm directional gradient (`140deg, #edeae2 → #ddd8ce → #cec8be`) with bottom border separator
- **Eyebrow labels** — Pill-style uppercase labels in `spicy-paprika` with frosted white background
- **Card hover** — `translateY(-3px)` lift, `spicy-paprika` border, `::before` top accent strip
- **Search bar** — Full-width, leading search icon, unified box-shadow, focus highlights in `spicy-paprika`
- **Filter labels** — Uppercase, `0.72rem`, `letter-spacing: 0.1em`, `opacity: 0.65`
- **Results meta** — Uppercase small-caps count label above grids
- **Empty states** — Centred icon circle, bold heading, muted subtext
- **CTA boxes** — Dark gradient (`#2a2522 → #1a1614`) with `spicy-paprika` top accent strip
- **Footer** — Matches CTA box dark gradient, muted nav links, paprika CTA button, difficulty badge row

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm

---

### Step 1 — Clone the repository 

```bash
git clone https://github.com/Morani/ProjectCompass.git
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

```
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
│   │   ├── App.jsx                     Route definitions and footer visibility logic
│   │   ├── main.jsx                    React entry point
│   │   ├── index.css                   Global styles, design tokens, Barlow + Inter fonts
│   │   ├── api/
│   │   │   └── api.js                  Axios instance and all API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx         Auth state and JWT management
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   ├── Footer.jsx              Site-wide footer component
│   │   │   ├── Footer.css              Footer styles
│   │   │   ├── ProjectCard.jsx         Reusable project card with badges and tags
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
```

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
| Sudharth Moorani  | Full Stack Developer | Complete backend API, database schema, authentication system, all frontend pages and components, admin dashboard, UI design, deployment setup, and documentation |


## License

This project was built as a course-level web development milestone project.