const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config/env');
const apiRoutes = require('./routes/index');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Mount API V1 routes
app.use('/api/v1', apiRoutes);

// Catch 404 for unmapped endpoints
app.use(notFoundMiddleware);

// Central Error Handler Middleware
app.use(errorMiddleware);

module.exports = app;
