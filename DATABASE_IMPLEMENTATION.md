# Database Implementation Summary

## Overview
The application now uses a complete SQL database (SQLite) to store all experiment data including text, tables, and images.

## Architecture

### Backend (Node.js + Express)
- **Location**: `server/` directory
- **Database**: SQLite with better-sqlite3
- **API**: RESTful endpoints for CRUD operations

### Database Schema

#### 1. experiments
Stores main experiment metadata
- `id` (TEXT, PRIMARY KEY)
- `title` (TEXT)
- `created_at` (TEXT)
- `updated_at` (TEXT)
- `user_email` (TEXT)

#### 2. content_items
Stores all content sections (text, table refs, image refs)
- `id` (TEXT, PRIMARY KEY)
- `experiment_id` (TEXT, FOREIGN KEY)
- `type` (TEXT: 'text', 'table', 'image')
- `position` (INTEGER)
- `section` (TEXT: section name for text items)
- `content` (TEXT: actual text content)

#### 3. observation_tables
Stores table definitions
- `id` (TEXT, PRIMARY KEY)
- `content_item_id` (TEXT, FOREIGN KEY)
- `title` (TEXT)
- `num_rows` (INTEGER)

#### 4. table_columns
Stores column definitions
- `id` (TEXT, PRIMARY KEY)
- `table_id` (TEXT, FOREIGN KEY)
- `type` (TEXT: 'column' or 'group')
- `name` (TEXT)
- `unit` (TEXT)
- `position` (INTEGER)

#### 5. sub_columns
Stores sub-columns for grouped columns
- `id` (TEXT, PRIMARY KEY)
- `column_id` (TEXT, FOREIGN KEY)
- `name` (TEXT)
- `unit` (TEXT)
- `position` (INTEGER)

#### 6. images
Stores image data as BLOB
- `id` (TEXT, PRIMARY KEY)
- `content_item_id` (TEXT, FOREIGN KEY)
- `filename` (TEXT)
- `caption` (TEXT)
- `data` (BLOB: binary image data)
- `mime_type` (TEXT)

## API Endpoints

### POST /api/experiments
Saves complete experiment with all content
- Handles text sections
- Handles tables with columns and sub-columns
- Handles images (base64 → BLOB conversion)
- Uses transactions for data integrity

### GET /api/experiments
Returns list of experiments
- Optional filter by user email
- Includes content count
- Sorted by creation date

### GET /api/experiments/:id
Returns complete experiment data
- Reconstructs all content items
- Converts BLOB images back to base64
- Maintains content order

### DELETE /api/experiments/:id
Deletes experiment and all related data
- Cascade deletes handle cleanup
- Foreign key constraints ensure integrity

## Frontend Integration

### API Service (`src/services/api.ts`)
- Centralized API calls
- Type-safe interfaces
- Error handling

### Updated Components
- **ExperimentPage**: Uses API to save experiments
- **Dashboard**: Uses API to load and delete experiments
- Loading states and error handling

## Data Flow

### Saving an Experiment
1. User creates experiment with content
2. Frontend sends complete data to API
3. Backend starts transaction
4. Saves experiment metadata
5. Saves each content item
6. For tables: saves table → columns → sub-columns
7. For images: converts base64 to BLOB and saves
8. Commits transaction
9. Returns success

### Loading Experiments
1. Frontend requests experiments list
2. Backend queries database
3. Returns metadata with content counts
4. User clicks experiment
5. Backend reconstructs complete data
6. Converts BLOBs back to base64
7. Returns to frontend

## Installation & Setup

### Quick Start (Windows)
```bash
# Install dependencies
install.bat

# Start application
start.bat
```

### Manual Setup
```bash
# Install frontend
npm install

# Install backend
cd server
npm install
cd ..

# Run backend (Terminal 1)
cd server
npm run dev

# Run frontend (Terminal 2)
npm run dev
```

## Benefits

1. **Data Persistence**: All data stored in database, not localStorage
2. **Image Storage**: Images stored as binary data, not limited by localStorage size
3. **Data Integrity**: Foreign keys and transactions ensure consistency
4. **Scalability**: Can easily add more features and relationships
5. **Multi-user**: User email filtering for personalized experiments
6. **Backup**: Single database file easy to backup
7. **Performance**: SQLite is fast and efficient

## File Structure
```
Obervation/
├── server/
│   ├── database.js          # Database schema and initialization
│   ├── server.js            # Express API server
│   ├── package.json         # Backend dependencies
│   ├── observations.db      # SQLite database (auto-created)
│   └── README.md
├── src/
│   ├── services/
│   │   └── api.ts           # API service layer
│   └── ...
├── install.bat              # Windows installation script
├── start.bat                # Windows startup script
└── SETUP.md                 # Setup instructions
```

## Future Enhancements

Possible additions:
- User authentication
- Experiment sharing
- Export to PDF
- Version history
- Collaborative editing
- Cloud deployment
