import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/pagginationHelper";
import { prisma } from "../../shared/prisma";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorUpdateInput } from "./doctor.interface";
import ApiError from "../../error/apiError";
import { openai } from "../../helper/OpenRouter";
import { extractAiDoctorResult } from "../../helper/extractAiDoctorResult";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, specialties, ...filterData } = filters;

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

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
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
      doctorSpecialties: {
        include: {
          specialties: true,
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
            specialtiesId: s.specialtiesId,
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
            specialtiesId: specialty.specialtiesId,
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
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });

    return updatedData;
  });

  return result;
};

const getAlSuggestion = async (payload: { symptoms: string }) => {
  if (!(payload && payload.symptoms)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "give some symptoms");
  }

  const doctors = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const doctorSummaries = doctors.map((d) => ({
    id: d.id,
    name: d.name,
    specialties: d.doctorSpecialties.map((ds) => ds.specialties.title),
  }));

  

  const prompt = `
You are a kind and empathetic AI medical assistant who helps patients find the right doctor. suggest the top 3 most suitable doctors.
When responding, write naturally as if you care for the patient's well-being.
Keep the explanation short, friendly, and reassuring — like you're guiding a friend who feels unwell.
After your reasoning, include a JSON block containing only the most suitable doctor(s).

Patient's symptoms: ${payload.symptoms}

Here is the available doctor list (JSON):
${JSON.stringify(doctorSummaries, null, 2)}

Output format:
1. A short, warm and human-like reasoning (do NOT include "reasoning:" label).
2. Then a code block with JSON of the selected doctor(s), like:
\`\`\`json
[
  { "id": "123", "name": "Dr. Smith", "specialties": ["Cardiology"] }
]
\`\`\`
 
`;

  const completion = await openai.chat.completions.create({
    model: "tngtech/deepseek-r1t2-chimera:free",
    messages: [
      {
        role: "system",
        content:
          "You are an empathetic AI healthcare assistant who helps patients choose the right doctor. Always respond politely, use a warm and caring tone, and provide reassurance.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // console.log(completion.choices[0].message);

  const result = await extractAiDoctorResult(completion);

  return result;
};

export const DoctorService = {
  getAllFromDB,
  updateIntoDB,
  getAlSuggestion,
};
