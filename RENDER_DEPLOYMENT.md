# 🚀 Team-Sync: Single-Instance Render Deployment & Infrastructure Guide

This guide provides step-by-step instructions to deploy the complete **Team-Sync** enterprise platform (React 19 Vite frontend + Node.js Express backend + MongoDB + Google Gemini AI) on **Render** as a **single instance**.

---

## 🏛️ Architecture Overview

In a single-instance deployment, both the client interface and API engine run within the same Node.js web service on Render:

```
                          ┌────────────────────────────────────────────────────────┐
                          │            Render Web Service (Single Instance)        │
                          │                                                        │
┌──────────────────┐      │   Express 4 Engine (Listening on dynamic $PORT)        │      ┌─────────────────────────┐
│                  │      │                                                        │      │                         │
│  User Browser    ├─────►│   ├── /api/* ────────► REST Controllers & Auth         ├─────►│  MongoDB Atlas Cluster   │
│  (Desktop/Phone) │HTTPS │   │                    (Employees, Projects, Tasks)    │      │  (Database Storage)     │
│                  │      │   │                                                    │      │                         │
└──────────────────┘      │   ├── /* (Non-API) ──► Static React 19 Vite SPA Bundle │      └─────────────────────────┘
                          │                        (dist/index.html fallback)      │                   ▲
                          │                                                        │                   │
                          └────────────────────────────────────────────────────────┘                   │
                                                              │                                        │
                                                              ▼                                        │
                                              ┌─────────────────────────────────┐                      │
                                              │    Google Gemini Generative AI  ├──────────────────────┘
                                              │    (Automated Workspace Sync)   │
                                              └─────────────────────────────────┘
```

### Key Advantages of Single-Instance Deployment
1. **Zero CORS Friction**: The frontend and API share the exact same origin (`https://<service-name>.onrender.com`), eliminating third-party cookie restrictions and SSL domain mismatches.
2. **Cost & Resource Efficiency**: One unified container/service handles all requests, qualifying 100% for Render's free tier.
3. **Simultaneous Deployments**: Every Git push builds and synchronizes both frontend and backend atomically.

---

## 📋 Prerequisites

Before deploying to Render, prepare:
1. **GitHub Repository**: Push your project code to a private or public GitHub repository.
2. **MongoDB Atlas Account (Free)**: A free M0 MongoDB cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
3. **Google Gemini API Key (Free)**: An API key from [Google AI Studio](https://aistudio.google.com).
4. **Render Account (Free)**: An account at [Render](https://render.com).

---

## 🍃 Step 1: Set Up Free MongoDB Atlas Cluster

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create** and choose **M0 (Free)**.
3. Under **Security Quickstart**:
   - Create a database user (e.g., username: `teamsync_admin`, password: `<strong-password>`). Save this password!
4. Under **Network Access**:
   - Click **Add IP Address** -> select **Allow Access from Anywhere (`0.0.0.0/0`)**.
   - *Note: Render web services use dynamic IP pools, so `0.0.0.0/0` is required for cloud connectivity.*
5. Under **Database** -> **Connect** -> choose **Drivers (Node.js)**:
   - Copy the connection string:
     ```text
     mongodb+srv://teamsync_admin:<password>@cluster0.xxxxx.mongodb.net/team-sync?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password and specify database name `/team-sync`.

---

## ⚡ Step 2: Deploy on Render

### Option A: 1-Click Blueprint Deploy (`render.yaml` - Recommended)

1. Push this codebase to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete single-instance infrastructure & projects workspace"
   git push origin main
   ```
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render detects [render.yaml](file:///c:/Users/av081/OneDrive/Desktop/Team-Sync/render.yaml) and displays the service plan.
6. Under **Environment Variables**:
   - `MONGO_URI`: Paste your MongoDB Atlas connection string.
   - `GEMINI_API_KEY`: Paste your Google Gemini API key.
   - `JWT_SECRET`: Render auto-generates a secure random key.
   - `AUTO_SEED`: Defaults to `true` (auto-populates demo accounts and tasks on first boot).
7. Click **Apply**. Render will automatically build and launch your full-stack instance!

---

### Option B: Manual Web Service Setup

If you prefer creating the service manually through the Render dashboard:

1. Click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the following fields:
   - **Name**: `team-sync`
   - **Region**: Any (e.g., `Oregon (US West)` or `Frankfurt (EU Central)`)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm run render-build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Plan**: `Free`
4. Expand **Advanced** and set **Health Check Path**:
   - `/api/health`
5. Click **Add Environment Variable** and add:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `10000` | Render assigns port dynamically |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | `your_32_char_secret` | Secure random string |
   | `JWT_EXPIRES_IN` | `7d` | Session expiration |
   | `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API Key |
   | `AUTO_SEED` | `true` | Populates demo data if DB is empty |
6. Click **Create Web Service**.

---

## 🔍 Step 3: Verification & Smoke Testing

Once deployment completes:

1. **Check Health Status**:
   Visit:
   ```text
   https://<your-service-name>.onrender.com/api/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "service": "Team-Sync Enterprise Single-Instance Engine",
     "version": "1.0.0",
     "mode": "production"
   }
   ```

2. **Access the Frontend**:
   Visit `https://<your-service-name>.onrender.com/`
   - Click **Quick Explore: Instant Demo Access** OR sign in with:
     - **Email**: `alex.morgan@team-sync.space`
     - **Password**: `password123`

3. **Verify Projects & Task Allocation**:
   - Navigate to **Projects & Tasks** in the sidebar.
   - Check the **Interactive Kanban Board** (`To Do`, `In Progress`, `Under Review`, `Completed`).
   - Click **"My Tasks Only"** to filter tasks allocated specifically to Alex Morgan.
   - Click **"Start Work"** or change task status to verify real-time status transitions.
   - Click **"+ Allocate Task"** to assign a new deliverable to any team member.
   - Click **"+ New Project"** to launch a new departmental project.

4. **Verify Gemini AI Workspace Briefing**:
   - On the **Overview** dashboard (`/home`), click **"Sync Workspace (Gemini AI)"**.
   - Verify that Gemini generates real-time operational insights, team velocity, and strategic recommendations.

---

## 🐳 Alternative: Docker Deployment

The repository includes a multi-stage production [Dockerfile](file:///c:/Users/av081/OneDrive/Desktop/Team-Sync/Dockerfile) and [docker-compose.yml](file:///c:/Users/av081/OneDrive/Desktop/Team-Sync/docker-compose.yml).

### Local Docker Testing
To run the full stack locally with MongoDB in Docker:
```bash
# Start containerized application, MongoDB, and Mongo Express
docker compose up --build
```
- App: `http://localhost:5001`
- Mongo Express GUI: `http://localhost:8081` (admin / pass)

### Deploying as Docker Web Service on Render
When creating a Web Service on Render, you can select **Docker** as the environment instead of Node. Render will automatically build the multi-stage `Dockerfile` and serve the application!

---

## 🛠️ Production Troubleshooting & FAQs

### 1. Render Free Tier Spin-Down (Cold Starts)
- **Behavior**: On Render's Free tier, instances spin down after 15 minutes of inactivity. The first incoming request may take 30-50 seconds to boot the container.
- **Handling**: Our server includes connection retry logic in `server/src/config/db.ts` so cold starts do not crash or loop.
- **Solution**: For zero cold-starts, upgrade to Render's **Starter** tier ($7/mo) in the Render dashboard.

### 2. MongoDB "MongooseServerSelectionError"
- **Cause**: MongoDB Atlas has not whitelisted Render's IP addresses.
- **Fix**: In MongoDB Atlas -> **Network Access**, ensure `0.0.0.0/0` is added to your IP Access List.

### 3. Client-Side Routing Returns 404 on Refresh
- **Fixed**: Our Express server implements an SPA catch-all wildcard (`app.get('*')`) that routes all non-API paths to `dist/index.html`. Client-side routes like `/home/projects` will refresh seamlessly.

### 4. Re-seeding the Database
- To re-populate seed data manually from Render's SSH / Shell tab:
  ```bash
  npm run seed
  ```
