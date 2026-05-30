import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = !!process.env.VERCEL;
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, 'data');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

async function initDB() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    try {
      await fs.access(RESERVATIONS_FILE);
    } catch {
      await fs.writeFile(RESERVATIONS_FILE, JSON.stringify([], null, 2));
    }

    try {
      await fs.access(REVIEWS_FILE);
    } catch {
      const seedReviews = [
        {
          id: 'REV-1001',
          name: 'Sofia Valenzuela',
          rating: 5,
          comment: "The white truffle tagliolini is a culinary revelation! Set against the VIP Vault's ambient glass design, it is an unforgettable dining experience.",
          date: '2026-05-15',
          status: 'Approved',
          createdAt: new Date('2026-05-15T19:30:00Z').toISOString()
        },
        {
          id: 'REV-1002',
          name: 'Marcus Sterling',
          rating: 5,
          comment: 'Exquisite attention to detail. The service was impeccable, and the sommelier\'s wine pairings perfectly complemented our dry-aged wagyu steak.',
          date: '2026-05-22',
          status: 'Approved',
          createdAt: new Date('2026-05-22T20:15:00Z').toISOString()
        },
        {
          id: 'REV-1003',
          name: 'Dr. Elena Rostova',
          rating: 5,
          comment: 'A masterpiece of flavors. The grand chocolate soufflé with gold leaf is an absolute must-try. L\'Étoile Dorée has set a new benchmark for fine dining.',
          date: '2026-05-28',
          status: 'Approved',
          createdAt: new Date('2026-05-28T21:00:00Z').toISOString()
        }
      ];
      await fs.writeFile(REVIEWS_FILE, JSON.stringify(seedReviews, null, 2));
    }
  } catch (error) {
    console.error('Failed to initialize database files:', error);
  }
}

async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading database file at ${filePath}:`, error);
    return [];
  }
}

async function writeData(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  try {
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`Error writing database file at ${filePath}:`, error);
    
    try {
      await fs.unlink(tempPath);
    } catch {}
    return false;
  }
}


export const db = {
  async getReservations() {
    await initDB();
    return await readData(RESERVATIONS_FILE);
  },

  async saveReservation(reservation) {
    await initDB();
    const reservations = await readData(RESERVATIONS_FILE);
    const newReservation = {
      id: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...reservation
    };
    reservations.push(newReservation);
    const success = await writeData(RESERVATIONS_FILE, reservations);
    return success ? newReservation : null;
  },

  async updateReservationStatus(id, status) {
    await initDB();
    const reservations = await readData(RESERVATIONS_FILE);
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1) {
      reservations[index].status = status;
      const success = await writeData(RESERVATIONS_FILE, reservations);
      return success ? reservations[index] : null;
    }
    return null;
  },

  async deleteReservation(id) {
    await initDB();
    const reservations = await readData(RESERVATIONS_FILE);
    const filtered = reservations.filter(r => r.id !== id);
    if (filtered.length !== reservations.length) {
      const success = await writeData(RESERVATIONS_FILE, filtered);
      return success;
    }
    return false;
  },

  async getReviews() {
    await initDB();
    return await readData(REVIEWS_FILE);
  },

  async saveReview(review) {
    await initDB();
    const reviews = await readData(REVIEWS_FILE);
    const newReview = {
      id: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending', // New reviews require admin moderation
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ...review
    };
    reviews.push(newReview);
    const success = await writeData(REVIEWS_FILE, reviews);
    return success ? newReview : null;
  },

  async updateReviewStatus(id, status) {
    await initDB();
    const reviews = await readData(REVIEWS_FILE);
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      reviews[index].status = status;
      const success = await writeData(REVIEWS_FILE, reviews);
      return success ? reviews[index] : null;
    }
    return null;
  },

  async deleteReview(id) {
    await initDB();
    const reviews = await readData(REVIEWS_FILE);
    const filtered = reviews.filter(r => r.id !== id);
    if (filtered.length !== reviews.length) {
      const success = await writeData(REVIEWS_FILE, filtered);
      return success;
    }
    return false;
  }
};
