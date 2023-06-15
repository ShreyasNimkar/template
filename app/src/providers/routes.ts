import { Application } from 'express';
import userRouter from '../routes/userRouter';
import logger from '../../logs/logger';

/**
 * @function routes
 * @description Initializes the routes
 * @param {Application} app - Express application
 * @returns {Application} - Express application
 */
const routes = (app: Application): Application => {
    logger.info('Initializing routes');

    // This is a sample route
    app.get('/', (req, res) => {
        res.send(`<h3>It's me</h3>`);
    });

    app.use('/api/users', userRouter);
    return app;
};

export default { mount: routes };
