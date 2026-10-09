const express = require('express');
const cors = require('cors');
const rateLimit = require('./Middlewares/rateLimit');
const errorHandler = require('./Middlewares/errorHandler');
const databaseReady = require('./Middlewares/databaseReady');
const { isDatabaseConnected } = require('./config/database');
const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/userRoutes');
const trainRoutes = require('./Routes/trainRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use('/api', rateLimit);
app.get('/api/health', (request, response) => {
	const connected = isDatabaseConnected();
	response.status(connected ? 200 : 503).json({
		status: connected ? 'ok' : 'degraded',
		database: connected ? 'connected' : 'disconnected'
	});
});
app.use('/api/auth', databaseReady, authRoutes);
app.use('/api/users', databaseReady, userRoutes);
app.use('/api/trains', databaseReady, trainRoutes);
app.use(errorHandler);

module.exports = app;
