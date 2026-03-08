import express from 'express';
import cors from 'cors';
import multer from 'multer';
import db from './database.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper function to convert base64 to buffer
function base64ToBuffer(base64String) {
  if (!base64String) return null;
  const base64Data = base64String.split(',')[1] || base64String;
  return Buffer.from(base64Data, 'base64');
}

// Helper function to buffer to base64
function bufferToBase64(buffer, mimeType) {
  if (!buffer) return null;
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

// Save experiment
app.post('/api/experiments', async (req, res) => {
  try {
    const { id, title, content, userEmail } = req.body;
    const now = new Date().toISOString();

    // Start transaction
    const saveExperiment = db.transaction(() => {
      // Insert experiment
      db.prepare(`
        INSERT OR REPLACE INTO experiments (id, title, created_at, updated_at, user_email)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, title, now, now, userEmail || null);

      // Delete existing content items for this experiment
      db.prepare('DELETE FROM content_items WHERE experiment_id = ?').run(id);

      // Insert content items
      content.forEach((item, position) => {
        db.prepare(`
          INSERT INTO content_items (id, experiment_id, type, position, section, content)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(item.id, id, item.type, position, item.section || null, item.content || null);

        // Handle tables
        if (item.type === 'table' && item.data) {
          const table = item.data;
          db.prepare(`
            INSERT INTO observation_tables (id, content_item_id, title, num_rows)
            VALUES (?, ?, ?, ?)
          `).run(table.id, item.id, table.title, table.numRows);

          // Insert columns
          table.columns.forEach((col, colPos) => {
            db.prepare(`
              INSERT INTO table_columns (id, table_id, type, name, unit, position)
              VALUES (?, ?, ?, ?, ?, ?)
            `).run(col.id, table.id, col.type, col.name, col.unit || null, colPos);

            // Insert sub-columns if any
            if (col.subColumns) {
              col.subColumns.forEach((subCol, subPos) => {
                db.prepare(`
                  INSERT INTO sub_columns (id, column_id, name, unit, position)
                  VALUES (?, ?, ?, ?, ?)
                `).run(subCol.id, col.id, subCol.name, subCol.unit || null, subPos);
              });
            }
          });
        }

        // Handle images
        if (item.type === 'image' && item.data) {
          const imageData = item.data;
          if (imageData.preview) {
            const buffer = base64ToBuffer(imageData.preview);
            const mimeType = imageData.preview.split(';')[0].split(':')[1] || 'image/png';
            
            db.prepare(`
              INSERT INTO images (id, content_item_id, filename, caption, data, mime_type)
              VALUES (?, ?, ?, ?, ?, ?)
            `).run(
              imageData.id,
              item.id,
              `image_${imageData.id}`,
              imageData.caption || null,
              buffer,
              mimeType
            );
          }
        }
      });
    });

    saveExperiment();

    res.json({ success: true, id });
  } catch (error) {
    console.error('Error saving experiment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all experiments
app.get('/api/experiments', (req, res) => {
  try {
    const { userEmail } = req.query;
    
    let query = 'SELECT id, title, created_at, updated_at FROM experiments';
    let params = [];
    
    if (userEmail) {
      query += ' WHERE user_email = ?';
      params.push(userEmail);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const experiments = db.prepare(query).all(...params);
    
    // Get content count for each experiment
    const experimentsWithCount = experiments.map(exp => {
      const count = db.prepare('SELECT COUNT(*) as count FROM content_items WHERE experiment_id = ?')
        .get(exp.id);
      return {
        ...exp,
        contentCount: count.count
      };
    });
    
    res.json(experimentsWithCount);
  } catch (error) {
    console.error('Error fetching experiments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single experiment
app.get('/api/experiments/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Get experiment
    const experiment = db.prepare('SELECT * FROM experiments WHERE id = ?').get(id);
    
    if (!experiment) {
      return res.status(404).json({ error: 'Experiment not found' });
    }
    
    // Get content items
    const contentItems = db.prepare(`
      SELECT * FROM content_items WHERE experiment_id = ? ORDER BY position
    `).all(id);
    
    // Build content array
    const content = contentItems.map(item => {
      const contentItem = {
        id: item.id,
        type: item.type
      };
      
      if (item.type === 'text') {
        contentItem.section = item.section;
        contentItem.content = item.content;
      } else if (item.type === 'table') {
        // Get table data
        const table = db.prepare('SELECT * FROM observation_tables WHERE content_item_id = ?')
          .get(item.id);
        
        // Get columns
        const columns = db.prepare(`
          SELECT * FROM table_columns WHERE table_id = ? ORDER BY position
        `).all(table.id);
        
        // Get sub-columns for each column
        const columnsWithSubs = columns.map(col => {
          const column = {
            id: col.id,
            type: col.type,
            name: col.name,
            unit: col.unit
          };
          
          if (col.type === 'group') {
            const subColumns = db.prepare(`
              SELECT * FROM sub_columns WHERE column_id = ? ORDER BY position
            `).all(col.id);
            column.subColumns = subColumns;
          }
          
          return column;
        });
        
        contentItem.data = {
          id: table.id,
          title: table.title,
          numRows: table.num_rows,
          columns: columnsWithSubs
        };
      } else if (item.type === 'image') {
        // Get image data
        const image = db.prepare('SELECT * FROM images WHERE content_item_id = ?')
          .get(item.id);
        
        if (image) {
          contentItem.data = {
            id: image.id,
            file: null,
            preview: bufferToBase64(image.data, image.mime_type),
            caption: image.caption
          };
        }
      }
      
      return contentItem;
    });
    
    res.json({
      id: experiment.id,
      title: experiment.title,
      content,
      createdAt: experiment.created_at,
      updatedAt: experiment.updated_at
    });
  } catch (error) {
    console.error('Error fetching experiment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete experiment
app.delete('/api/experiments/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    db.prepare('DELETE FROM experiments WHERE id = ?').run(id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting experiment:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
