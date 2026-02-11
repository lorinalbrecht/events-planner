import express, { Request, Response } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Datenbank initialisieren
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'events.db');
const db = new Database(dbPath);

// Erstelle Events-Tabelle
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    date TEXT NOT NULL,
    time TEXT,
    category TEXT,
    color TEXT DEFAULT '#3498db',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// API Endpoints

// GET alle Events
app.get('/api/events', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('SELECT * FROM events ORDER BY date DESC, time ASC');
    const events = stmt.all();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET einzelnes Event
app.get('/api/events/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = stmt.get(id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.json(event);
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST neues Event
app.post('/api/events', (req: Request, res: Response) => {
  try {
    const { title, description, location, date, time, category, color } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO events (title, description, location, date, time, category, color)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(title, description || null, location || null, date, time || null, category || null, color || '#3498db');

    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT Event aktualisieren
app.put('/api/events/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, location, date, time, category, color } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const stmt = db.prepare(`
      UPDATE events
      SET title = ?, description = ?, location = ?, date = ?, time = ?, category = ?, color = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const info = stmt.run(title, description || null, location || null, date, time || null, category || null, color || '#3498db', id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE Event
app.delete('/api/events/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// GET Events nach Datum
app.get('/api/events/date/:date', (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const stmt = db.prepare('SELECT * FROM events WHERE date = ? ORDER BY time ASC');
    const events = stmt.all(date);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events by date:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET Events nach Kategorie
app.get('/api/events/category/:category', (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const stmt = db.prepare('SELECT * FROM events WHERE category = ? ORDER BY date DESC, time ASC');
    const events = stmt.all(category);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events by category:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Event Planner Server läuft auf http://localhost:${PORT}`);
  console.log(`📁 Datenbank gespeichert in: ${dbPath}`);
});
