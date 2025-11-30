import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import routes from './routes/index.js';
import ip from 'ip';
import NotFoundHandler from './middleware/notFound.js';
import ErrorHandlerMiddleware from './middleware/errorHandler.js';

const app = express();
const PORT = Number(ENV.PORT) || 5001;

// Server handle so we can close & restart on fatal errors
let server: ReturnType<import('http').Server['listen']> | null = null;
let restartCount = 0;
const MAX_RESTARTS = 5;
const RESTART_BACKOFF_MS = 1000; // base backoff

// Request timeout middleware (30 seconds)
app.use((req, res, next) => {
	req.setTimeout(30000, () => {
		res.status(408).json({ message: 'Request timeout. Please try again.' });
	});
	next();
});

// Body size limit (10MB for images)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());

app.use('/api', routes);

app.use(NotFoundHandler);

app.use(ErrorHandlerMiddleware);

function startServer() {
	server = app.listen(PORT, () => {
		restartCount = 0; // reset on successful start
		console.log(`Server is running on http://${ip.address()}:${PORT}`);
	});

	// graceful shutdown on signals
	const shutdown = (signal: string) => {
		console.log(`Received ${signal}. Shutting down gracefully...`);
		if (server && (server as any).close) {
			(server as any).close(() => {
				console.log('Server closed. Exiting process.');
				process.exit(0);
			});
			// Force exit if not closed within timeout
			setTimeout(() => {
				console.error('Forced shutdown after timeout.');
				process.exit(1);
			}, 10000).unref();
		} else {
			process.exit(0);
		}
	};

	process.on('SIGTERM', () => shutdown('SIGTERM'));
	process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();

// Attempt to recover from uncaught exceptions and unhandled rejections
function attemptRecovery(err: Error, origin: string) {
	console.error(`Fatal ${origin}:`, err);

	try {
		if (server && (server as any).close) {
			(server as any).close(() => {
				console.log('Server closed after fatal error.');
			});
		}
	} catch (closeErr) {
		console.error('Error while closing server:', closeErr);
	}

	restartCount += 1;
	if (restartCount > MAX_RESTARTS) {
		console.error(`Exceeded max restart attempts (${MAX_RESTARTS}). Exiting.`);
		process.exit(1);
		return;
	}

	const backoff = RESTART_BACKOFF_MS * restartCount;
	console.log(`Attempting restart #${restartCount} in ${backoff}ms`);
	setTimeout(() => {
		try {
			startServer();
		} catch (startErr) {
			console.error('Restart failed:', startErr);
		}
	}, backoff).unref();
}

process.on('uncaughtException', (err) => attemptRecovery(err, 'uncaughtException'));
process.on('unhandledRejection', (reason: any) => {
	const err = reason instanceof Error ? reason : new Error(String(reason));
	attemptRecovery(err, 'unhandledRejection');
});
