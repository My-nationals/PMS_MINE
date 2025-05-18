import { RequestHandler, Router } from "express";
import userController from "../controllers/user.controller";
import {
    ChangePasswordDTO,
    CreateUserDTO,
    UpdateAvatarDTO,
    UpdateUserDTO,
} from "../dtos/user.dto";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";

const userRouter = Router();

userRouter.post(
    "/create",
    [validationMiddleware(CreateUserDTO)],
    userController.createUser
);

userRouter.put(
    "/update",
    [checkLoggedIn, validationMiddleware(UpdateUserDTO)],
    userController.updateUser as unknown as RequestHandler
);

userRouter.get(
    "/me",
    [checkLoggedIn],
    userController.me as unknown as RequestHandler
);

userRouter.get("/all", [checkAdmin], userController.all);
userRouter.get("/:id", [], userController.getById);
userRouter.get("/search/:query", [], userController.searchUser);

userRouter.delete(
    "/me",
    [checkLoggedIn],
    userController.deleteUser as unknown as RequestHandler
);

userRouter.delete(
    "/remove-avatar",
    [checkLoggedIn],
    userController.removeAvatar as unknown as RequestHandler
);

userRouter.delete("/by-id/:id", [checkAdmin], userController.deleteById);

userRouter.put(
    "/update-avatar",
    [checkLoggedIn, validationMiddleware(UpdateAvatarDTO)],
    userController.updateAvatar as unknown as RequestHandler
);

userRouter.put(
    "/update-password",
    [checkLoggedIn, validationMiddleware(ChangePasswordDTO)],
    userController.updatePassword as unknown as RequestHandler
);

export default userRouter;
