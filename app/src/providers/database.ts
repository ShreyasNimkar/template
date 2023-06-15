import mongoose from 'mongoose';
import logger from '../../logs/logger';
import envHandler from '../utils/envHandler';

const database = async () => {
    const URL = envHandler('DATABASE_URL').replace('<password>', envHandler('DATABASE_PASSWORD'));

    try {
        await mongoose.connect(URL);

        console.log('Connected to Database!');

        const dbConnection = mongoose.connection;

        dbConnection.on('error', (err) => {
            logger.error('MongoDB connection error: ' + err);
            console.log('error');
            process.exit();
        });

        dbConnection.once('open', () => {
            logger.info('Connected to MongoDB');
            console.log(`connected on port ${envHandler('PORT')}`);
        });

        dbConnection.on('disconnected', () => {
            logger.info('Disconnected from MongoDB');
        });

        logger.info('Database connection established successfully!');
    } catch (error) {
        logger.error('Error connecting to the database: ' + error);
        console.log('error');
        process.exit();
    }
};

export default database;
