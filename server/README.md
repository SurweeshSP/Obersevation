# Observation Server

Backend API for the Laboratory Observation Module Builder.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Database

The application uses SQLite with better-sqlite3. The database file `observations.db` will be created automatically in the server directory.

## API Endpoints

### Save Experiment
- **POST** `/api/experiments`
- Body: `{ id, title, content, userEmail }`
- Saves complete experiment including text, tables, and images

### Get All Experiments
- **GET** `/api/experiments?userEmail=email@example.com`
- Returns list of experiments for a user

### Get Single Experiment
- **GET** `/api/experiments/:id`
- Returns complete experiment data including all content

### Delete Experiment
- **DELETE** `/api/experiments/:id`
- Deletes experiment and all associated data

## Database Schema

- **experiments**: Main experiment metadata
- **content_items**: Text sections, table references, image references
- **observation_tables**: Table definitions
- **table_columns**: Column definitions for tables
- **sub_columns**: Sub-columns for grouped columns
- **images**: Image data stored as BLOB with base64 encoding
