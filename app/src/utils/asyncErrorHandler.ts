import { NextFunction, Request, Response } from 'express';
import logger from '../../logs/logger';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncErrorHandler = (fn: AsyncFunction) => {
    const wrappedFn: AsyncFunction = async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            // Handle the error locally
            if (err instanceof Error) {
                logger.error(err.message);
                next(err);
            }
        }
    };

    // Catch unhandled promise rejections
    process.on('unhandledRejection', (err: unknown) => {
        if (err instanceof Error) {
            logger.error('Unhandled Promise Rejection:');
            logger.error(err.message);
            // Perform any necessary cleanup or additional error handling
            process.exit(1);
        }
    });

    return wrappedFn;
};

export default asyncErrorHandler;
