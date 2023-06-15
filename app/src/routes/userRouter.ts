import * as express from 'express';
import LoginController from '../controllers/loginController';
import RegisterController from '../controllers/registerController';
import AuthMiddleware from '../middlewares/authMiddleware';
import UserController from '../controllers/userController';
// import { joiUserCreateValidator, joiUserUpdateValidator } from '../validators/joiValidators/joiUserValidator';

const userRouter = express.Router();

userRouter.post('/login', LoginController.login);

userRouter.post('/signup', RegisterController.signup);

userRouter.patch('/updatePassword', AuthMiddleware.protect, UserController.updatePassword);

userRouter
    .route('/:userID')
    .get(AuthMiddleware.protect, UserController.getUser)
    .patch(AuthMiddleware.protect, UserController.updateUser)
    .delete(AuthMiddleware.protect, UserController.deleteUser);

export default userRouter;
