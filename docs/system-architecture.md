# ANBI Tech Solution - System Architecture

## Overview
ANBI Tech Solution is a full-stack web application for managing Smart Security & ELV Solutions services in Nepal.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────┬─────────────────┬───────────────────────────────┤
│   Frontend      │  Admin Panel    │   Technician Panel          │
│  (Public Site)  │  (Dashboard)    │   (Dashboard)               │
└────────┬────────┴────────┬────────┴───────────────┬───────────────┘
         │                 │                        │
         └─────────────────┼────────────────────────┘
                           │ HTTPS / REST API
┌──────────────────────────┴──────────────────────────────────────┐
│                      API LAYER (Node.js/Express)                 │
├──────────────────────────────────────────────────────────────────┤
│  Routes: /api/auth | /api/admin | /api/tech | /api (public)       │
├──────────────────────────────────────────────────────────────────┤
│  Middleware: Auth | Validation | Rate Limit | Error Handler       │
├──────────────────────────────────────────────────────────────────┤
│  Controllers: Auth | Admin | Technician | Public                │
└──────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    DATA LAYER (MongoDB Atlas)                    │
├──────────────────────────────────────────────────────────────────┤
│  Collections: Users | Bookings | Quotations | Contacts          │
│              | Newsletter | WorkReports                         │
└──────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                   EXTERNAL SERVICES                              │
├─────────────────┬─────────────────┬───────────────────────────────┤
│   Cloudinary    │   Nodemailer    │   JWT Authentication        │
│  (File Uploads) │  (Email Alerts) │   (Token-based Auth)        │
└─────────────────┴─────────────────┴───────────────────────────────┘
```

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, express-rate-limit, bcryptjs
- **File Uploads**: Multer + Cloudinary
- **Email**: Nodemailer (Gmail SMTP)

### Frontend
- **Public Site**: Static HTML/CSS/JS
- **Admin Panel**: Static HTML/CSS/JS
- **Technician Panel**: Static HTML/CSS/JS
- **Auth Utility**: Vanilla JS (backend/assets/js/auth.js)

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/change-password` | Change password | Private |
| POST | `/logout` | Logout | Private |

### Admin (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Dashboard stats |
| POST | `/technicians` | Create technician |
| GET | `/technicians` | List technicians |
| PUT | `/technicians/:id` | Update technician |
| DELETE | `/technicians/:id` | Delete technician |
| PUT | `/technicians/:id/reset-password` | Reset tech password |
| GET | `/bookings` | List bookings |
| PUT | `/bookings/:id/assign` | Assign booking |
| PUT | `/bookings/:id/status` | Update status |
| GET | `/quotations` | List quotations |
| PUT | `/quotations/:id/status` | Update quote status |
| GET | `/contacts` | List contacts |
| PUT | `/contacts/:id/status` | Update contact status |
| GET | `/newsletter` | List subscribers |
| GET | `/reports` | List work reports |
| GET | `/profile` | Get admin profile |
| PUT | `/profile` | Update admin profile |

### Technician (`/api/tech`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Tech dashboard |
| GET | `/jobs` | My jobs |
| GET | `/jobs/:id` | Job details |
| PUT | `/jobs/:id/status` | Update job status |
| POST | `/reports` | Submit work report |
| GET | `/profile` | Get profile |
| PUT | `/profile` | Update profile |

### Public (`/api`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings` | Create booking |
| POST | `/quotations` | Create quotation |
| POST | `/contact` | Send contact message |
| POST | `/newsletter` | Subscribe |
| POST | `/newsletter/unsubscribe` | Unsubscribe |

## Data Flow

### Booking Flow
```
Customer → POST /api/bookings → Booking Created
                                    ↓
Admin Dashboard ← GET /api/admin/bookings ← MongoDB
        ↓
Admin assigns technician → PUT /api/admin/bookings/:id/assign
                                    ↓
Technician Dashboard ← GET /api/tech/jobs ← MongoDB
        ↓
Technician updates status → PUT /api/tech/jobs/:id/status
                                    ↓
Work Report → POST /api/tech/reports → MongoDB
```

## Security Measures

1. **Helmet.js** - Security headers
2. **Rate Limiting** - 100 req/15min general, 10 req/15min auth
3. **JWT Authentication** - Token-based auth with 7-day expiry
4. **Role-based Access Control** - Admin vs Technician permissions
5. **Password Hashing** - bcryptjs with salt rounds 12
6. **Input Validation** - express-validator
7. **CORS** - Restricted to known origins
8. **MongoDB Injection Protection** - Mongoose sanitization

## Deployment

### Render (Recommended)
- Build Command: `npm install`
- Start Command: `npm start`
- Environment variables in Render Dashboard

### Vercel
- Serverless function entry: `backend/api/index.js`
- Static files served via `vercel.json` routes

## Environment Variables

See `.env` file for required environment variables.

## Default Admin Credentials

- **Email**: admin@anbitechsolutions.com
- **Password**: admin@123
- **⚠️ Change password after first login!**
