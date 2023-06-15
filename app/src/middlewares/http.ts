import * as express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import logger from '../../logs/logger';

import type { Application } from 'express';

/**
 * @class Http
 * @description This class is used to initialize the essential HTTP middleware
 */
class Http {
    /**
     * @method init
     * @description This function is used to initialize the essential HTTP middleware
     * @param {Application} app - Express application
     * @returns {Application} - Express application
     */
    public static init(_app: Application): Application {
        logger.info('Initializing HTTP middleware');

        _app.use(hpp());
        _app.use(helmet());
        _app.use(express.json());
        _app.use(express.urlencoded({ extended: false }));
        _app.use(compression());

        return _app;
    }
}

export default Http;
