import Express from './express';
import database from './database';
import logger from '../../logs/logger';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @class App
 * @description This class is used to initialize the application
 */
class App {
    /**
     * @method loadServer
     * @description This function is used to load the server
     * @returns void
     */
    public static loadServer(): void {
        logger.info('Server :: Loading...');
        Express();
    }

    /**
     * @method loadDatabase
     * @description This function is used to load the database
     * @returns void
     */
    public static loadDatabase(): void {
        logger.info('Database :: Loading...');

        database();
    }

    /**
     * @method loadCache
     * @description This function is used to load the cache
     * @returns void
     */
}

export default App;
