# Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or bun

## Installation

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm install -g concurrently
npm run dev:all
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Access the Application

- Frontend: http://localhost:8080 (or the port shown in terminal)
- Backend API: http://localhost:3001

## Database

The SQLite database will be automatically created at `server/observations.db` when you first save an experiment.

## Features

- Role-based login (Student, Teacher, Admin)
- Create experiments with custom sections
- Add multiple tables with custom columns
- Insert images at any position
- Drag and drop to reorder content
- Save complete experiments to database
- View and manage saved experiments

## Troubleshooting

### Port Already in Use
If port 3001 is already in use, you can change it in `server/server.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

### Database Issues
If you encounter database issues, delete `server/observations.db` and restart the server to recreate it.

### CORS Issues
The backend is configured to allow all origins. If you need to restrict this, modify the CORS settings in `server/server.js`.
