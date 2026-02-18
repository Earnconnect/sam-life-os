# Sam's Life OS - Setup & Deployment Guide

## ✅ Current Status

- **Frontend**: Live at https://sam-life-os-prod.netlify.app
- **Backend**: Ready to run locally
- **Data Storage**: All files stored in `/data/.openclaw/workspace/data/` (local OpenClaw)
- **Memory Logs**: All activities logged to `/data/.openclaw/workspace/memory/YYYY-MM-DD.md`

## 🚀 Quick Start

### Option 1: Frontend Only (Currently Live)
The dashboard is already deployed to Netlify. Visit: https://sam-life-os-prod.netlify.app

⚠️ **Note:** Without the backend server running, the dashboard will show "Connection Error" status.

### Option 2: Full Stack (Frontend + Backend)

#### Step 1: Install Dependencies
```bash
cd /data/.openclaw/workspace/life-os
npm install
```

#### Step 2: Start the Backend Server
```bash
npm start
```

This will:
- Install any missing dependencies
- Build the React app (`npm run build`)
- Start Express server on port 3001
- Serve the dashboard + API endpoints

#### Step 3: Access the Dashboard
- **Local**: http://localhost:3001 (server will serve frontend)
- **Or Remote**: https://sam-life-os-prod.netlify.app (points to port 3001 API)

## 📁 Architecture

```
Frontend (React)
    ↓
API Client (api-client.js)
    ↓
Express Server (server.js, port 3001)
    ↓
Data Layer (openclaw-data.js)
    ↓
Local Files & Memory
    - /data/.openclaw/workspace/data/*.json
    - /data/.openclaw/workspace/memory/YYYY-MM-DD.md
```

## 🔄 How It Works

### Data Flow
1. **User Input** → Dashboard form
2. **API Call** → `api-client.js` sends to Express
3. **Processing** → `server.js` routes to data layer
4. **Storage** → `openclaw-data.js` writes to:
   - JSON files for persistent data (tasks, clients, etc.)
   - Daily memory files for activity logs
5. **Sync** → Dashboard refreshes every 30 seconds

### Example: Adding a Task
```
User clicks "Add Task" 
  → Fills form 
  → Clicks Submit
  → API call: POST /api/tasks {title, status, ...}
  → openclaw-data.addTask() called
  → Written to /data/.openclaw/workspace/data/tasks.json
  → Logged to /data/.openclaw/workspace/memory/2026-02-18.md
  → Dashboard fetches latest data
  → New task appears in Task Management tab
```

## 📊 Available Endpoints

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Add client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Remove client

### Prospects
- `GET /api/prospects` - List prospects
- `POST /api/prospects` - Add prospect
- `PUT /api/prospects/:id` - Update prospect

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Add project
- `PUT /api/projects/:id` - Update project

### Financials
- `GET /api/financials` - Get revenue/expenses summary
- `POST /api/financials/revenue` - Log revenue
- `POST /api/financials/expense` - Log expense

### Tokens
- `GET /api/tokens` - Get token usage logs
- `POST /api/tokens` - Log token usage

### Checkins
- `GET /api/checkins` - List daily checkins
- `POST /api/checkins` - Create checkin

### Ideas
- `GET /api/ideas` - List ideas
- `POST /api/ideas` - Add idea

### Reviews
- `GET /api/reviews` - List weekly reviews
- `POST /api/reviews` - Create review

### Activity
- `GET /api/activity?limit=50` - Get activity log

### System
- `GET /api/health` - Health check
- `GET /api/export` - Export all data
- `POST /api/import` - Import data

## 🛠️ Development

### Build for Production
```bash
npm run build
```
Output goes to `dist/`

### Run Development Server
```bash
npm run dev
```
Runs Vite dev server on port 5173

### Preview Build Locally
```bash
npm run preview
```

## 📝 File Structure

```
life-os/
├── src/
│   ├── lib/
│   │   ├── api-client.js       ← Frontend API client
│   │   ├── openclaw-data.js    ← Data persistence layer
│   │   ├── openclaw.js         ← OpenClaw system integration
│   │   └── supabase.js         ← (deprecated)
│   ├── components/
│   │   └── tabs/               ← 12 dashboard tabs
│   └── App.jsx
├── public/
├── server.js                   ← Express backend
├── package.json
├── vite.config.js
├── tailwind.config.js
└── SETUP.md (this file)

/data/.openclaw/workspace/
├── data/                       ← JSON data files
│   ├── tasks.json
│   ├── clients.json
│   ├── prospects.json
│   ├── projects.json
│   ├── financials.json
│   ├── tokens.json
│   ├── checkins.json
│   ├── ideas.json
│   └── reviews.json
└── memory/                     ← Daily memory files
    ├── 2026-02-18.md
    └── YYYY-MM-DD.md
```

## 🔗 Deployment

### Netlify (Frontend)
- **URL**: https://sam-life-os-prod.netlify.app
- **Auto-Deploy**: Triggers on GitHub push to `main`
- **GitHub Repo**: https://github.com/Earnconnect/sam-life-os
- **Build Command**: `npm run build`
- **Publish Directory**: `dist/`

### Express Server (Backend)
Currently runs locally. To deploy to production:

Option A: Keep running on local machine (current)
Option B: Deploy to Heroku/Railway/Render
```bash
npm start
# Server runs on $PORT (default 3001)
```

## 🐛 Troubleshooting

### Dashboard shows "Connection Error"
**Cause**: Backend server not running
**Fix**: Run `npm start` in the life-os directory

### Port 3001 already in use
**Fix**: Kill the process or use different port
```bash
lsof -i :3001
kill -9 <PID>
# Or set PORT=3002 npm start
```

### No data appearing
**Cause**: Data files not created yet
**Fix**: Add your first item (task/client/etc) via dashboard form

### Memory file not updating
**Cause**: Permissions issue
**Fix**: Check permissions on `/data/.openclaw/workspace/memory/`

## 📈 Next Steps

1. ✅ Frontend deployed to Netlify
2. ✅ Backend code ready
3. ⏭️ Run `npm install && npm start` to activate full sync
4. ⏭️ Start using dashboard to log tasks, clients, revenue, etc.
5. ⏭️ All data automatically syncs between:
   - Life OS Dashboard
   - OpenClaw memory files
   - Local JSON storage

## 💡 Key Features

- ✅ **No External Database**: All data stored locally in OpenClaw
- ✅ **Bi-Directional Sync**: Dashboard ↔ OpenClaw system
- ✅ **Real-Time Updates**: 30-second auto-refresh
- ✅ **Activity Logging**: Auto-logged to daily memory files
- ✅ **Auto-Deploy**: Netlify deploys on GitHub push
- ✅ **12 Dashboard Tabs**: Comprehensive life/business OS
- ✅ **Full CRUD**: Add/edit/delete/view for all entities

## 📞 Support

All data, code, and configuration files are in:
- `/data/.openclaw/workspace/life-os/` (source code)
- `/data/.openclaw/workspace/data/` (persistent data)
- `/data/.openclaw/workspace/memory/` (activity logs)

Everything is transparent and editable.
