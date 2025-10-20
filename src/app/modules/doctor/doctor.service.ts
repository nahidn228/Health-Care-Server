import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/pagginationHelper";
import { prisma } from "../../shared/prisma";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, specialities, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialities && specialities.length > 0) {
    andConditions.push({
      DoctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialities,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterCondition = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterCondition);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      DoctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const { specialties, ...doctorData } = payload;

  const result = await prisma.$transaction(async (tx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtyIds = specialties.filter((s) => s.isDeleted);
      for (const s of deleteSpecialtyIds) {
        await tx.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialitiesId: s.specialitiesId,
          },
        });
      }

      const createSpecialtyIds = specialties.filter(
        (specialty) => !specialty.isDeleted
      );

      for (const specialty of createSpecialtyIds) {
        await tx.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialitiesId: specialty.specialitiesId,
          },
        });
      }
    }

    const updatedData = await tx.doctor.update({
      where: {
        id: doctorInfo.id,
      },
      data: doctorData,
      include: {
        DoctorSpecialties: {
          include: {
            specialities: true,
          },
        },
      },
    });

    return updatedData;
  });

  return result;
};

export const DoctorService = {
  getAllFromDB,
  updateIntoDB,
};
