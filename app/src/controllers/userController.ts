import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import AppError from '../utils/appError';
import asyncErrorHandler from '../utils/asyncErrorHandler';
import HandlerFactory from '../utils/handlerFactory';
import createSendToken from '../controllers/loginController';

type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

/**
 * @class UserController
 * @description Controller class for user-related operations
 */
class UserController {
    /**
     * Retrieves all users
     */
    public static getAllUsers: RequestHandler = HandlerFactory.getAllDocuments(User);

    /**
     * Retrieves a specific user by ID
     */
    public static getUser: RequestHandler = HandlerFactory.getDocument(User);

    /**
     * Updates a specific user by ID
     */
    public static updateUser: RequestHandler = HandlerFactory.updateDocument(User);

    /**
     * Marks a user as inactive
     */
    public static deleteUser: RequestHandler = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            await User.findByIdAndUpdate(req.user.id, { active: false });
            res.status(204).json({
                status: 'success',
                requestedAt: req.requestedAt,
                data: null,
            });
        }
    );

    /**
     * Updates the password of the currently authenticated user
     */
    public static updatePassword: RequestHandler = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const user = await User.findById(req.user.id).select('+password');
            if (!user) {
                return next(new AppError('User not found', 404));
            }

            if (!(await user.correctPassword(req.body.password))) {
                return next(new AppError('Incorrect Password. Please enter the correct password.', 401));
            }

            user.password = req.body.newPassword;
            await user.save();

            createSendToken(user, 200, res);
        }
    );
}

export default UserController;
