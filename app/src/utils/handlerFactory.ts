import { NextFunction, Request, Response } from 'express';
import APIFeatures from './apiFeatures';
import User from '../models/user.model';
import AppError from '../utils/appError';
import asyncErrorHandler from '../utils/asyncErrorHandler';

interface CustomQuery {
    [key: string]: string | number | undefined;
}

interface ResponseData {
    status: string;
    requestedAt: string;
    data: any;
}

class HandlerFactory {
    private static createResponse(res: Response, status: string, data: any, statusCode: number) {
        const responseData: ResponseData = {
            status,
            requestedAt: new Date().toISOString(),
            data,
        };

        res.status(statusCode).json(responseData);
    }

    public static getAllDocuments(Model: any) {
        return asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
            const features = new APIFeatures(Model.find(), req.query as CustomQuery);

            features.filter().sort().fields().paginator();

            const docs = await features.query;

            HandlerFactory.createResponse(res, 'success', docs, 200);
        });
    }

    public static getAllDocsByQuery(Model: any, query: any) {
        return asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
            const features = new APIFeatures(Model.find(query), req.query as CustomQuery);

            features.filter().sort().fields().paginator();

            const docs = await features.query;

            HandlerFactory.createResponse(res, 'success', docs, 200);
        });
    }

    public static getAllDocsByUser(Model: any) {
        return asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
            const userID = req.user.id;
            const features = new APIFeatures(Model.find({ user: userID }), req.query as CustomQuery);
            features.filter().sort().fields().paginator();
            const docs = await features.query;
            HandlerFactory.createResponse(res, 'success', docs, 200);
        });
    }

    public static getDocument(Model: any) {
        return asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
            const doc = Model === User ? await Model.findById(req.params.userID) : await Model.findById(req.params.id);

            if (!doc) {
                return next(new AppError('No document with this ID found', 404));
            }

            HandlerFactory.createResponse(res, 'success', doc, 200);
        });
    }

    public static addDocumentByUser(Model: any) {
        return asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
            const user = await User.findOne({ username: req.params.username });

            if (!user) {
                return next(new AppError('No user with this username found', 404));
            }

            req.body.user = user.id;
            const doc = await Model.create(req.body);

            HandlerFactory.createResponse(res, 'success', doc, 201);
        });
    }

    public static createDocument(Model: any) {
        return asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
            const doc = await Model.create(req.body);

            HandlerFactory.createResponse(res, 'success', doc, 201);
        });
    }

    public static updateDocument(Model: any) {
        return asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
            const doc = await Model.findByIdAndUpdate(req.params.userID ? req.params.userID : req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!doc) {
                return next(new AppError('No document with this ID found', 404));
            }

            HandlerFactory.createResponse(res, 'success', doc, 200);
        });
    }

    public static deleteDocument(Model: any) {
        return asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
            await Model.findByIdAndDelete(req.params.id);

            HandlerFactory.createResponse(res, 'success', null, 204);
        });
    }
}

export default HandlerFactory;
