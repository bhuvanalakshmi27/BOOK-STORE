const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/connect');

const logsDir = path.join(__dirname, 'logs');
const errorLogFile = path.join(logsDir, 'server-errors.log');

const writeErrorLog = (source, error) => {
  const errorText = error && error.stack ? error.stack : String(error);
  const entry = `[${new Date().toISOString()}] [${source}] ${errorText}\n\n`;

  try {
    fs.mkdirSync(logsDir, { recursive: true });
    fs.appendFileSync(errorLogFile, entry, 'utf8');
  } catch (logError) {
    console.error('Failed to write error log:', logError);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  writeErrorLog('unhandledRejection', err);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  writeErrorLog('uncaughtException', err);
});

const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BookStore API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  writeErrorLog(`${req.method} ${req.originalUrl}`, err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  return res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
