# Deploy ANBI Tech Solution on Render

## Important: MongoDB URI Must Include Database Name

Your MongoDB connection string **must include the database name** `/anbi-tech` before the query parameters:

```
mongodb+srv://anbitechsolutions_db_user:YOUR_PASSWORD@cluster0.bnczh2e.mongodb.net/anbi-tech?retryWrites=true&w=majority&appName=Cluster0
```

**Wrong:** `...mongodb.net/?appName=Cluster0`  
**Correct:** `...mongodb.net/anbi-tech?retryWrites=true&w=majority&appName=Cluster0`

---

## 1. MongoDB Atlas Setup (Already Done)

Your cluster is: `cluster0.bnczh2e.mongodb.net`

Make sure the database user `anbitechsolutions_db_user` has these permissions:
- Read and write to any database
- Network access: Allow from anywhere (`0.0.0.0/0`) OR Render's IP ranges

---

## 2. Render Dashboard Environment Variables

Go to [Render Dashboard](https://dashboard.render.com) → Your Web Service → **Environment** tab.

Add these exact values:

| Key | Value | Required? |
|-----|-------|-----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `10000` | Yes |
| `MONGODB_URI` | `mongodb+srv://anbitechsolutions_db_user:muxesZlXZ5pjZcmV@cluster0.bnczh2e.mongodb.net/anbi-tech?retryWrites=true&w=majority&appName=Cluster0` | **YES** |
| `JWT_SECRET` | Generate a random 32+ character string at https://randomkeygen.com | Yes |
| `JWT_EXPIRE` | `7d` | Yes |
| `ADMIN_EMAIL` | `anbitechsolutions@gmail.com` | Yes |
| `FRONTEND_URL` | `https://anbi-tech.onrender.com` | Yes |
| `SMTP_USER` | `anbitechsolutions@gmail.com` | Optional |
| `SMTP_PASS` | Your Gmail App Password | Optional |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Optional (for file uploads) |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Optional |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Optional |

**Do NOT copy the `.env` file from your repo** — Render uses its own Environment tab.

---

## 3. Verify API Health

After deploying, visit:
```
https://anbi-tech.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "database": "connected",
  "environment": "production"
}
```

If it says `"database": "disconnected"`, your `MONGODB_URI` is wrong.

---

## 4. Seed Admin User (One-Time)

After the database is connected, go to Render Dashboard → **Shell** tab and run:

```bash
node backend/src/utils/seedAdminStandalone.js
```

This creates the default admin account:
- **Email:** `anbitechsolutions@gmail.com`
- **Password:** `admin@123`

**Change this password immediately after first login!**

---

## 5. Access URLs

| Service | URL |
|---------|-----|
| **Website** | https://anbi-tech.onrender.com |
| **API Health** | https://anbi-tech.onrender.com/api/health |
| **Admin Panel** | https://anbi-tech.onrender.com/admin/dashboard.html |
| **Technician Panel** | https://anbi-tech.onrender.com/technician/dashboard.html |

---

## Troubleshooting

### "Database connection is not ready" (503 error)
- Your `MONGODB_URI` is missing `/anbi-tech` before `?retryWrites`
- MongoDB Atlas network access doesn't allow Render's IP
- MongoDB user password is wrong

### "Cannot connect to server" in browser
- Backend is not running or crashed — check Render **Logs** tab
- Frontend is opening HTML file directly instead of through `https://anbi-tech.onrender.com`

### Login works but redirects to wrong page
- Make sure `FRONTEND_URL` env var is set to `https://anbi-tech.onrender.com`
- Clear browser localStorage and try again

---

## Gmail App Password (for email notifications)

1. Enable 2-Step Verification on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Paste the 16-character password (no spaces) into Render's `SMTP_PASS` env var
