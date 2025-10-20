import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import pick from "../../helper/pick";
import { doctorFilterableFields } from "./doctor.constant";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  const filters = pick(req.query, doctorFilterableFields);

  const result = await DoctorService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});
const getAlSuggestion = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getAlSuggestion(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Fetch AI Driven Doctor Suggestion!",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorService.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor updated successfully!",
    data: result,
  });
});

export const DoctorController = {
  getAllFromDB,
  updateIntoDB,
  getAlSuggestion,
};
