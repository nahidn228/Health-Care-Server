import config from "../../../config";
import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcrypt from "bcryptjs";

const createPatient = async (payload: createPatientInput) => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.salt_round)
  );

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: payload.name,
      },
    });

    return await tx.patient.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: payload.name,
      },
    });
  });

  return result;
};

export const UserService = {
  createPatient,
};
