import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import job from './config/cron.js';
import routes from './routes/index.js';
import ip from 'ip';

const app = express();
const PORT = ENV.PORT || 5001;

if (ENV.NODE_ENV === 'production') job.start();

app.use(express.json());

app.use(cors());

app.use('/api', routes);

app.listen(PORT, () => {
	console.log(`Server is running on http://${ip.address()}:${PORT}`);
});
