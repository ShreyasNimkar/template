import cors from 'cors';
import type { Application } from 'express';
import logger from '../../logs/logger';

/**
 * @class Cors
 * @description This class is used to initialize the CORS middleware
 * @returns Application of type express
 */
class Cors {
    /**
     * @method init
     * @description This function is used to initialize the CORS middleware
     * @param {Application} app - Express application
     * @returns {Application} - Express application
     */
    public static init(_app: Application): Application {
        logger.info('Initializing CORS middleware');

        const corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200,
        };
        _app.use(cors(corsOptions));

        return _app;
    }
}

export default Cors;
