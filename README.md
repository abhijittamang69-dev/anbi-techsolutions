# ANBI Tech Solution

Smart Security & ELV Solutions for Homes & Businesses in Nepal.

## Project Structure

```
ANBI_tech_Solutions/
├── backend/
│   ├── api/
│   │   └── index.js          # Vercel serverless entry point
│   ├── assets/
│   │   └── js/
│   │       └── auth.js       # Frontend auth utility
│   └── src/
│       ├── config/
│       │   └── database.js   # MongoDB connection
│       ├── controllers/
│       │   ├── adminController.js
│       │   ├── authController.js
│       │   ├── publicController.js
│       │   └── technicianController.js
│       ├── middleware/
│       │   ├── auth.js       # JWT auth & role authorization
│       │   ├── errorHandler.js
│       │   └── validator.js
│       ├── models/
│       │   ├── Booking.js
│       │   ├── Contact.js
│       │   ├── Newsletter.js
│       │   ├── Quotation.js
│       │   ├── User.js
│       │   └── WorkReport.js
│       ├── routes/
│       │   ├── admin.js
│       │   ├── auth.js
│       │   ├── public.js
│       │   └── technician.js
│       ├── utils/
│       │   ├── cloudinary.js
│       │   ├── email.js
│       │   ├── seedAdmin.js
│       │   └── seedAdminStandalone.js
│       └── server.js
├── database/
│   ├── schema.js             # Schema documentation
│   └── seed.js               # Seed entry point
├── docs/
│   └── system-architecture.md
├── frontend/                 # Public website (HTML/CSS/JS)
├── admin-panel/              # Admin dashboard (HTML/CSS/JS)
├── technician-panel/         # Technician dashboard (HTML/CSS/JS)
├── .env
├── docker-compose.yml
├── package.json
├── render.yaml
├── vercel.json
└── README.md
```

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up `.env` file with your credentials

3. Seed admin user:
   ```bash
   npm run seed
   # OR standalone (no project dependencies):
   npm run seed:standalone
   ```

4. Start server:
   ```bash
   npm start
   # OR for development:
   npm run dev
   ```

## Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@anbitechsolutions.com` |
| Password | `admin@123` |

> ⚠️ **IMPORTANT: Change password after first login!**

## API Base URL

- Local: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## Contact

- Email: info@anbitechsolutions.com
- Phone: +97477955237
- Mobile: 9763381611
