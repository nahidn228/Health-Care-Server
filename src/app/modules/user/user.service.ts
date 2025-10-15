import { Request } from "express";
import config from "../../../config";
import { prisma } from "../../shared/prisma";

import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
import { Prisma, UserRole } from "@prisma/client";
import { paginationHelper } from "../../helper/pagginationHelper";
import { userSearchableFields } from "./user.constant";

const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadedResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round)
  );

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashedPassword,
        name: req.body.patient.name,
      },
    });

    return await tx.patient.create({
      data: req.body.patient,
    });
  });
  console.log("from service", result);
  return result;
};
const createAdmin = async (req: Request) => {
  if (req.file) {
    const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadedResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round)
  );

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashedPassword,
        name: req.body.admin.name,
      },
    });

    return await tx.admin.create({
      data: req.body.admin,
    });
  });
  console.log("from service", result);

  return result;
};

// const createAdmin = async (req: Request) => {
//   const file = req.file;

//   if (file) {
//     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
//     req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
//   }

//   const hashedPassword: string = await bcrypt.hash(req.body.password, 10);

//   const userData = {
//     email: req.body.admin.email,
//     password: hashedPassword,
//     name: req.body.admin.name,
//     role: UserRole.ADMIN,
//   };

//   const result = await prisma.$transaction(async (transactionClient) => {
//     await transactionClient.user.create({
//       data: userData,
//     });

//     const createdAdminData = await transactionClient.admin.create({
//       data: req.body.admin,
//     });

//     return createdAdminData;
//   });

//   return result;
// };

const createDoctor = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 10);

  const userData = {
    name: req.body.doctor.name,
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  return result;
};

// const getAllFromDB = async ({
//   page,
//   limit,
//   searchTerm,
//   sortOrder,
//   sortBy,
// }: {
//   page?: number;
//   limit?: number;
//   searchTerm?: any;
//   sortBy?: any;
//   sortOrder?: any;
//   role?: any;
//   status?: any;
// }) => {
//   const pageNumber = page || 1;
//   const limitNumber = limit || 10;

//   const skip = (pageNumber - 1) * limitNumber;

//   const result = await prisma.user.findMany({
//     skip,
//     take: limitNumber,

//     //searching
//     where: {
//       email: {
//         contains: searchTerm,
//         mode: "insensitive",
//       },

//     },

//     //sorting
//     orderBy:
//       sortBy && sortOrder
//         ? {
//             [sortBy]: sortOrder,
//           }
//         : {
//             createdAt: "asc",
//           },
//   });
//   return result;
// };

const getAllFromDB = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    skip,
    take: limit,

    //searching
    // where: {
    //   AND: andConditions,
    // },
    where: whereConditions,

    //sorting
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const UserService = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllFromDB,
};
