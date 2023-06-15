import * as jwt from 'jsonwebtoken';
import User from '../models/user.model';
import AppError from '../utils/appError';
import asyncErrorHandler from '../utils/asyncErrorHandler';
import envHandler from '../utils/envHandler';
import logger from '../../logs/logger';
import { NextFunction, Request, Response } from 'express';

const jwtVerifyPromisified = (token: string, secret: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {}, (err, payload) => {
            if (err) {
                reject(err);
            } else {
                resolve(payload);
            }
        });
    });
};

/**
 * @class AuthController
 * @description This class handles authentication-related middleware functions
 */
class AuthController {
    /**
     * @method protect
     * @description Middleware function to protect routes requiring authentication
     * @param {Request} req - Request object
     * @param {Response} res - Response object
     * @param {NextFunction} next - Next function
     * @returns {void}
     */
    public static protect = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        let token: string | undefined = undefined;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in. Please log in to continue.', 401));
        }

        const decoded = (await jwtVerifyPromisified(token, envHandler('JWT_KEY'))) as jwt.JwtPayload;

        const user = await User.findById(decoded.id);

        if (req.params.userID && decoded.id !== req.params.userID) {
            logger.protect(
                `Non-modifying user entry attempt. \nAttempting User: ${decoded.id}\nTrying to access: ${req.user.id}\nAction: ${req.originalUrl}`
            );
            return next(new AppError('Please log in as the modifying user.', 401));
        }

        if (!user) {
            return next(new AppError('User of this token no longer exists.', 401));
        }
        if (user.changedPasswordAfter(decoded.iat ?? 0)) {
            return next(new AppError('Password was recently changed. Please log in again.', 401));
        }

        req.user = user;
        next();
    });

    /**
     * @method adminOnly
     * @description Middleware function to restrict access to admin users only
     * @param {Request} req - Request object
     * @param {Response} res - Response object
     * @param {NextFunction} next - Next function
     * @returns {void}
     */
    public static adminOnly = (req: Request, res: Response, next: NextFunction) => {
        if (!req.user.admin) {
            return next(new AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
}

export default AuthController;
