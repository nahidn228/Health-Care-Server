import { z } from "zod";

export const createDoctorScheduleSchema = z.object({
  scheduleIds: z
    .array(z.string().min(1, "Schedule ID cannot be empty"))
    .nonempty("Schedule IDs array cannot be empty"),
});

export const DoctorScheduleValidation = {
  createDoctorScheduleSchema,
};
