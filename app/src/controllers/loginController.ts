import * as jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/user.model';
import AppError from '../utils/appError';
import asyncErrorHandler from '../utils/asyncErrorHandler';
import envHandler from '../utils/envHandler';
import { Response, Request, NextFunction } from 'express';

/**
 * @class LoginController
 * @description This class handles user login functionality
 */
class LoginController {
    /**
     * @method login
     * @description Authenticates a user and sends a JWT token in the response
     */
    public static login = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        if (!email || !password) return next(new AppError("Email or Password doesn't exist", 400));
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password))) throw new AppError('Incorrect Email or Password', 400);
        this.createSendToken(user, 200, res);
    });

    /**
     * @method createSendToken
     * @description Creates and sends a JWT token in the response
     */
    private static createSendToken(user: UserDocument, statusCode: number, res: Response): void {
        const token = jwt.sign({ id: user._id }, envHandler('JWT_KEY'), {
            expiresIn: `${Number(envHandler('JWT_TIME'))}d`,
        });

        const cookieOptions = {
            expires: new Date(Date.now() + Number(envHandler('JWT_TIME')) * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: envHandler('NODE_ENV') === 'prod',
        };

        res.cookie('token', token, cookieOptions);

        const { password, ...userWithoutPassword } = user;

        res.status(statusCode).json({
            status: 'success',
            token,
            user: userWithoutPassword,
        });
    }

    /**
     * @method logout
     * @description Logs out the user by clearing the JWT cookie
     */
    public static logout = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 1 * 1000),
            httpOnly: true,
        });
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message: 'User Logged Out',
        });
    });
}

export default LoginController;
