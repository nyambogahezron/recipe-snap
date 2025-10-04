import { PrismaClient } from '../generated/prisma/index.js';

class PrismaClientSingleton {
	private static instance: PrismaClient;

	public static getInstance(): PrismaClient {
		if (!PrismaClientSingleton.instance) {
			PrismaClientSingleton.instance = new PrismaClient({
				log: ['query', 'info', 'warn', 'error'],
				errorFormat: 'pretty',
			});
		}
		return PrismaClientSingleton.instance;
	}

	public static async disconnect(): Promise<void> {
		if (PrismaClientSingleton.instance) {
			await PrismaClientSingleton.instance.$disconnect();
			console.log('Prisma client disconnected');
		}
	}
}

export const prisma = PrismaClientSingleton.getInstance();

// Graceful shutdown handlers
const gracefulShutdown = async () => {
	console.log('Shutting down gracefully...');
	await PrismaClientSingleton.disconnect();
	process.exit(0);
};

process.on('beforeExit', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
