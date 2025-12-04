import { Request, Response, NextFunction } from 'express';

type AsyncFunction<T = any, U = any, V = any> = (
	req: Request<T, U, V>,
	res: Response<U>,
	next: NextFunction
) => Promise<void>;

export default function AsyncHandler<T = any, U = any, V = any>(
	fn: AsyncFunction<T, U, V>
) {
	return async (
		req: Request<T, U, V>,
		res: Response<U>,
		next: NextFunction
	) => {
		try {
			await fn(req, res, next);
		} catch (error) {
			next(error);
		}
	};
}
