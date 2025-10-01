import cron from 'cron';
import https from 'https';
import { ENV } from './env.js';

const job = new cron.CronJob('*/14 * * * *', function () {
	const apiUrl = ENV.API_URL;
	if (!apiUrl) {
		console.log('API_URL not configured, skipping health check');
		return;
	}

	https
		.get(apiUrl, (res) => {
			if (res.statusCode === 200) console.log('GET request sent successfully');
			else console.log('GET request failed', res.statusCode);
		})
		.on('error', (e: Error) => console.error('Error while sending request', e));
});

export default job;
