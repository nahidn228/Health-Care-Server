import { z } from "zod";


export const insertScheduleSchema = z.object({
  startDate: z.string().nonempty("Start date is required"), // ISO string
  endDate: z.string().nonempty("End date is required"), // ISO string
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be in HH:mm format"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be in HH:mm format"),
});


// export const scheduleFilterSchema = z.object({
//   startDateTime: z.string().optional(),
//   endDateTime: z.string().optional(),
// });


// export const schedulePaginationSchema = z.object({
//   page: z.number().min(1, "Page must be at least 1").optional(),
//   limit: z.number().min(1, "Limit must be at least 1").optional(),
//   sortBy: z.string().optional(),
//   sortOrder: z.enum(["asc", "desc"]).optional(),
// });


export const ScheduleValidation = {
  insertScheduleSchema,
 
};
