import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/login",
  // validateRequest(AuthValidation.loginUserSchema),
  AuthController.loginUser
);

export const authRoute = router;
