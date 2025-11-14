import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import routes from './routes/index.js';
import ip from 'ip';
import NotFoundHandler from './middleware/notFound.js';
import ErrorHandlerMiddleware from './middleware/errorHandler.js';

const app = express();
const PORT = ENV.PORT || 5001;

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

app.listen(PORT, () => {
	console.log(`Server is running on http://${ip.address()}:${PORT}`);
});
