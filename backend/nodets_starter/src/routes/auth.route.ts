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
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string, example: user@example.com }
 *               password: { type: string, example: Password123 }
 *     responses:
 *       201:
 *         description: User logged in successfully, OTP sent
 *       400:
 *         description: Invalid input or credentials
 *       500:
 *         description: Server error
 */
authRouter.post(
    "/login",
    [validationMiddleware(LoginDTO)],
    authController.login
);
/**
 * @swagger
 * /api/auth/initiate-reset-password:
 *   put:
 *     summary: Initiate password reset by sending OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email: { type: string, example: user@example.com }
 *     responses:
 *       200:
 *         description: OTP sent for password reset
 *       400:
 *         description: User not found or invalid input
 *       500:
 *         description: Server error
 */
authRouter.put(
    "/initiate-reset-password",
    [validationMiddleware(InitiateResetPasswordDTO)],
    authController.initiateResetPassword
);
/**
 * @swagger
 * /api/auth/reset-password:
 *   put:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               code: { type: string, example: 123456 }
 *               password: { type: string, example: NewPassword123 }
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid OTP or input
 *       500:
 *         description: Server error
 */
authRouter.put(
    "/reset-password",
    [validationMiddleware(ResetPasswordDTO)],
    authController.resetPassword
);
/**
 * @swagger
 * /api/auth/initiate-email-verification:
 *   put:
 *     summary: Initiate email verification by sending OTP
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent for email verification
 *       401:
 *         description: Unauthorized, user not logged in
 *       500:
 *         description: Server error
 */
authRouter.put(
    "/initiate-email-verification",
    [checkLoggedIn],
    authController.initiateEmailVerification as unknown as RequestHandler
);
/**
 * @swagger
 * /api/auth/verify-email/{code}:
 *   put:
 *     summary: Verify email with OTP code
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: OTP code for email verification
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid OTP code
 *       401:
 *         description: Unauthorized, user not logged in
 *       500:
 *         description: Server error
 */
authRouter.put(
    "/verify-email/:code",
    [checkLoggedIn],
    authController.verifyEmail as unknown as RequestHandler
);
export default authRouter;
