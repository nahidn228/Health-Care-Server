import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import { Request, Response } from "express";
import pick from "../../helper/pick";
import { IJwtPayload } from "../../type/common";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

const scheduleForDoctor = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);

    const result = await ScheduleService.scheduleForDoctor(
      user as IJwtPayload,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule for Doctor Getting successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.deleteScheduleFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule Deleted successfully!",
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDB,
  scheduleForDoctor,
  deleteScheduleFromDB,
};
