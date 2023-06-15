import * as jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/user.model';
import AppError from '../utils/appError';
import asyncErrorHandler from '../utils/asyncErrorHandler';
import envHandler from '../utils/envHandler';
import { Response, Request, NextFunction } from 'express';

/**
 * @class RegisterController
 * @description This class handles user registration functionality
 */
class RegisterController {
    /**
     * @method signup
     * @description Creates a new user and sends a JWT token in the response
     */
    public static signup = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const newUser = await User.create(req.body);
        this.createSendToken(newUser, 201, res);
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
     * @method verify
     * @description Verifies the user's email address
     */
    public verify = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        // Logic for email verification
    });

    /**
     * @method resend
     * @description Resends the verification email to the user
     */
    public resend = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        // Logic for resending verification email
    });
}

export default RegisterController;
