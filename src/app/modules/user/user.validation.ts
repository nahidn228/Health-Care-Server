import { Gender } from "@prisma/client";
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

const createAdminValidationSchema = z.object({
    password: z.string({
        error: "Password is required"
    }),
    admin: z.object({
        name: z.string({
            error: "Name is required!"
        }),
        email: z.string({
            error: "Email is required!"
        }),
        contactNumber: z.string({
            error: "Contact Number is required!"
        })
    })
});

const createDoctorValidationSchema = z.object({
    password: z.string({
        error: "Password is required"
    }),
    doctor: z.object({
        name: z.string({
            error: "Name is required!"
        }),
        email: z.string({
            error: "Email is required!"
        }),
        contactNumber: z.string({
            error: "Contact Number is required!"
        }),
        address: z.string().optional(),
        registrationNumber: z.string({
            error: "Reg number is required"
        }),
        experience: z.number().optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appointmentFee: z.number({
            error: "appointment fee is required"
        }),
        qualification: z.string({
            error: "qualification is required"
        }),
        currentWorkingPlace: z.string({
            error: "Current working place is required!"
        }),
        designation: z.string({
            error: "Designation is required!"
        })
    })
});




export const UserZodValidation = {
  createPatientValidationSchema,
  createAdminValidationSchema,
  createDoctorValidationSchema
};
