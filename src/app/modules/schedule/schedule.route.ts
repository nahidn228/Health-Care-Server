import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { ScheduleValidation } from "./schedule.validate";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.DOCTOR, UserRole.ADMIN),
  ScheduleController.scheduleForDoctor
);
router.post(
  "/",
  auth(UserRole.DOCTOR, UserRole.ADMIN),
  validateRequest(ScheduleValidation.insertScheduleSchema),
  ScheduleController.insertIntoDB
);
router.delete(
  "/:id",
  auth( UserRole.ADMIN),
  ScheduleController.deleteScheduleFromDB
);

export const ScheduleRoutes = router;
