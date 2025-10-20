import express from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", DoctorController.getAllFromDB);

router.post("/suggestion", DoctorController.getAlSuggestion);

router.patch(
  "/:id",
  // auth(UserRole.ADMIN, UserRole.DOCTOR),
  DoctorController.updateIntoDB
);

export const DoctorRoutes = router;
