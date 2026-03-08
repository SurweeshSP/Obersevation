# Application Features

## Complete Workflow

### 1. Login
- Select role: Student, Teacher, or Admin
- Enter email and password
- Teachers and Admins access the full experiment builder
- Students access a simplified view

### 2. Dashboard (Teacher/Admin)
- View all saved experiments
- See experiment title, date, and section count
- Click any experiment to view/edit it
- Delete experiments (hover over card to see delete button)
- Create new experiments

### 3. Create/Edit Experiments

#### Experiment Title
- Enter a descriptive title for your experiment

#### Add Content (in any order)
- **Text Sections**: Choose from predefined (Aim, Apparatus, Procedure, Result) or create custom sections
- **Tables**: Add observation tables with custom columns and sub-columns
- **Images**: Upload images with optional captions

#### Content Management
- **Drag & Drop**: Reorder any content by dragging the grip icon
- **Edit**: All content is editable including section titles
- **Delete**: Remove any content item with the trash icon

### 4. Save Experiments
- Click "Save Experiment" to store to database
- All content saved including:
  - Text sections with custom names
  - Complete table structures
  - Images as binary data
  - Content order

### 5. View/Edit Saved Experiments
- Click any experiment card on the dashboard
- Experiment loads with all content
- Edit any part of the experiment
- Save updates

## Key Features

### Multiple Tables
- Add unlimited observation tables
- Each table has its own title
- Custom number of rows
- Add regular columns or column groups
- Column groups can have sub-columns
- Each column can have units

### Multiple Images
- Insert images anywhere in the experiment
- Images stored as binary data in database
- Add captions to images
- No size limitations (unlike localStorage)

### Custom Sections
- Create your own section types beyond the standard ones
- Examples: "Theory", "Calculations", "Discussion", "Safety"
- Fully editable section titles

### Flexible Content Order
- Arrange content in any sequence
- Example orders:
  - Aim → Image → Procedure → Table → Result
  - Theory → Apparatus → Image → Table → Calculations
  - Any custom arrangement you need

### Data Persistence
- All data stored in SQLite database
- Survives browser refresh
- No data loss
- Easy backup (single database file)

### User-Based Filtering
- Experiments filtered by user email
- Each teacher sees only their experiments
- Multi-user support

## Technical Features

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite with better-sqlite3
- **UI**: Shadcn/ui components + Tailwind CSS
- **State Management**: React hooks
- **Routing**: React Router
- **API**: RESTful endpoints
- **Image Storage**: BLOB with base64 conversion

## Future Enhancements

Possible additions:
- PDF export of experiments
- Print-friendly view
- Student assignment system
- Experiment templates
- Collaborative editing
- Cloud deployment
- User authentication
- Experiment sharing
