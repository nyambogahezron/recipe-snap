import 'dotenv/config';

interface Environment {
	PORT: number;
	DATABASE_URL: string;
	NODE_ENV: string | undefined;
	API_URL: string | undefined;
}

export const ENV: Environment = {
	PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
	DATABASE_URL: process.env.DATABASE_URL!,
	NODE_ENV: process.env.NODE_ENV,
	API_URL: process.env.API_URL,
};
