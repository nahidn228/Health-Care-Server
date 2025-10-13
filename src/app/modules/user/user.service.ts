import { Request } from "express";
import config from "../../../config";
import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";

const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
    console.log(uploadedResult);
  }

  // const hashedPassword = await bcrypt.hash(
  //   req.body.password,
  //   Number(config.salt_round)
  // );

  // const result = await prisma.$transaction(async (tx) => {
  //   await tx.user.create({
  //     data: {
  //       email: req.body.email,
  //       password: hashedPassword,
  //       name: req.body.name,
  //     },
  //   });

  //   return await tx.patient.create({
  //     data: {
  //       email: req.body.email,
  //       password: hashedPassword,
  //       name: req.body.name,
  //     },
  //   });
  // });

  // return result;
};

export const UserService = {
  createPatient,
};
