import { RequestHandler, Router } from "express";
import authController from "../controllers/auth.controller";
import {
    InitiateResetPasswordDTO,
    LoginDTO,
    ResetPasswordDTO,
} from "../dtos/auth.dto";
import { checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";

const authRouter = Router();

authRouter.post(
    "/login",
    [validationMiddleware(LoginDTO)],
    authController.login
);

authRouter.put(
    "/initiate-reset-password",
    [validationMiddleware(InitiateResetPasswordDTO)],
    authController.initiateResetPassword
);

authRouter.put(
    "/reset-password",
    [validationMiddleware(ResetPasswordDTO)],
    authController.resetPassword
);

// ✅ Fix: Cast to unknown first, then to RequestHandler
authRouter.put(
    "/initiate-email-verification",
    [checkLoggedIn],
    authController.initiateEmailVerification as unknown as RequestHandler
);

authRouter.put(
    "/verify-email/:code",
    [checkLoggedIn],
    authController.verifyEmail as unknown as RequestHandler
);

export default authRouter;
