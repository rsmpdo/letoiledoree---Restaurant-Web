import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'goldstarrestaurant';
const ADMIN_TOKEN = 'token-letoiledoree-2026-secure';

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Admin access required' });
  }
}

app.post('/api/reservations', async (req, res) => {
  const { name, email, phone, date, time, guests, zone, occasion, notes } = req.body;
  
  if (!name || !email || !phone || !date || !time || !guests || !zone) {
    return res.status(400).json({ error: 'All fields are required except occasion and notes' });
  }

  const reservationObj = {
    name,
    email,
    phone,
    date,
    time,
    guests: parseInt(guests, 10),
    zone,
    occasion: occasion || 'Standard Dining',
    notes: notes || ''
  };

  const saved = await db.saveReservation(reservationObj);
  if (saved) {
    res.status(201).json({ message: 'Reservation submitted successfully', reservation: saved });
  } else {
    res.status(500).json({ error: 'Failed to save reservation' });
  }
});

app.get('/api/reviews', async (req, res) => {
  const reviews = await db.getReviews();
  const approvedReviews = reviews.filter(r => r.status === 'Approved');
  res.json(approvedReviews);
});

app.post('/api/reviews', async (req, res) => {
  const { name, rating, comment } = req.body;

  if (!name || !rating || !comment) {
    return res.status(400).json({ error: 'Name, rating, and comment are required' });
  }

  const reviewObj = {
    name,
    rating: parseInt(rating, 10),
    comment
  };

  const saved = await db.saveReview(reviewObj);
  if (saved) {
    res.status(201).json({ message: 'Review submitted and pending moderation', review: saved });
  } else {
    res.status(500).json({ error: 'Failed to save review' });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_TOKEN, message: 'Authentication successful' });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});


app.get('/api/admin/reservations', authenticateAdmin, async (req, res) => {
  const reservations = await db.getReservations();
  res.json(reservations);
});

app.put('/api/admin/reservations/:id/status', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Confirmed', 'Cancelled', 'Pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const updated = await db.updateReservationStatus(id, status);
  if (updated) {
    res.json({ message: `Reservation status updated to ${status}`, reservation: updated });
  } else {
    res.status(404).json({ error: 'Reservation not found' });
  }
});

app.delete('/api/admin/reservations/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const deleted = await db.deleteReservation(id);
  if (deleted) {
    res.json({ message: 'Reservation deleted successfully' });
  } else {
    res.status(404).json({ error: 'Reservation not found' });
  }
});

app.get('/api/admin/reviews', authenticateAdmin, async (req, res) => {
  const reviews = await db.getReviews();
  res.json(reviews);
});

app.put('/api/admin/reviews/:id/status', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const updated = await db.updateReviewStatus(id, status);
  if (updated) {
    res.json({ message: `Review status updated to ${status}`, review: updated });
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
});

app.delete('/api/admin/reviews/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const deleted = await db.deleteReview(id);
  if (deleted) {
    res.json({ message: 'Review deleted successfully' });
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
});

app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  const reservations = await db.getReservations();
  const reviews = await db.getReviews();

  const totalBookings = reservations.length;
  const pendingBookings = reservations.filter(r => r.status === 'Pending').length;
  const confirmedBookings = reservations.filter(r => r.status === 'Confirmed').length;
  
  const approvedReviews = reviews.filter(r => r.status === 'Approved');
  const pendingReviews = reviews.filter(r => r.status === 'Pending').length;
  const avgRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '0.0';

  const totalGuests = reservations
    .filter(r => r.status === 'Confirmed')
    .reduce((sum, r) => sum + r.guests, 0);

  res.json({
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalGuests,
    pendingReviews,
    avgRating: parseFloat(avgRating)
  });
});


const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

if (!process.env.VERCEL) {
  app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts('html')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      next();
    }
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`L'Étoile Dorée backend running locally on port ${PORT}`);
  });
}

export default app;
