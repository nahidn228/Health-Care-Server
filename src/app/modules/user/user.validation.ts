import z from "zod";

const createPatientValidationSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  patient: z.object({
    // id: z.string().uuid().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    // profilePhoto: z.string().url("Invalid URL").optional().nullable(),
    address: z.string().optional().nullable(),
    // isDeleted: z.boolean().default(false),
    // role: z.enum(["PATIENT", "ADMIN", "DOCTOR"]).default("PATIENT"),
    // needPasswordChange: z.boolean().default(true),
    // status: z.enum(["ACTIVE", "INACTIVE", "BANNED"]).default("ACTIVE"),
    // createdAt: z.date().default(() => new Date()),
    // updatedAt: z.date().default(() => new Date()),
    // user: z.any().optional(), // relation placeholder
  }),
});

export const UserZodValidation = {
  createPatientValidationSchema,
};
