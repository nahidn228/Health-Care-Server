import { z } from "zod";

const create = z.object({
  title: z.string(),
});

export const SpecialtiesValidation = {
  create,
};
