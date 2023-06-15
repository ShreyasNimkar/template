// import type { Application } from 'express';
// import CORS from './cors';
// import Http from './http';
// import morgan, { StreamOptions } from 'morgan';
// import logger from '../../logs/logger';

// /**
//  * @class Kernel
//  * @description This class is used to initialize the essential middlewares
//  * @returns Application of type express
//  */
// class Kernel {
//     /**
//      * @method init
//      * @description This function is used to initialize the essential middlewares
//      * @param {Application} app - Express application
//      * @returns {Application} - Express application
//      */
//     public static init(_app: Application): Application {
//         // Initialize the essential middlewares
//         _app = CORS.init(_app);
//         _app = Http.init(_app);

//         // Initialize the morgan middleware tologger HTTP requests
//         const StreamOptions: StreamOptions = {
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             write: (message: any) => {
//                 logger.info(`HTTP: ${message}`);
//             },
//         };
//         _app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: StreamOptions }));
//         return _app;
//     }
// }
// export default Kernel;

import type { Application } from 'express';
import CORS from './cors';
import Http from './http';
import morgan, { StreamOptions } from 'morgan';
import logger from '../../logs/logger';

/**
 * @function Kernel
 * @description Initializes the essential middlewares
 * @param {Application} app - Express application
 * @returns {Application} - Express application
 */
const Kernel = (app: Application): Application => {
    // Initialize the essential middlewares
    app = CORS.init(app);
    app = Http.init(app);

    // Initialize the morgan middleware to log HTTP requests
    const StreamOptions: StreamOptions = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        write: (message: any) => {
            logger.info(`HTTP: ${message}`);
        },
    };
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: StreamOptions }));

    return app;
};

export default Kernel;
