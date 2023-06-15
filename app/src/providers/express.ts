import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import Kernel from '../middlewares/kernel';
import Routes from './routes'; // Update the import statement
import { Application } from 'express';
import logger from '../../logs/logger';
import envHandler from '../utils/envHandler';

dotenv.config();

const Express = () => {
    const app = express();
    const server = http.createServer(app);
    console.log('server created');
    const mountMiddlewares = () => {
        Kernel(app);
    };

    const mountRoutes = (app: Application) => {
        Routes.mount(app);
    };

    // Invoke the mountRoutes function

    const startServer = () => {
        const port = envHandler('PORT') || 3000;

        app.use((req, res) => {
            res.status(404).json({
                status: 404,
                message: 'Not Found',
            });
        });

        server.listen(port, () => {
            logger.info(`Server :: Running on port ${port}`);
        });
    };

    mountMiddlewares();
    mountRoutes(app);
    startServer();

    return null;
};

export default Express;
