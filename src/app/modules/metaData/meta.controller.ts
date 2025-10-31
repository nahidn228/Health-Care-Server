import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { MetaService } from "./meta.service";
import sendResponse from "../../shared/sendResponse";
import { IJwtPayload } from "../../type/common";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(
      user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Meta Data retrieved successfully",
      data: result,
    });
  }
);

export const MetaController = {
  fetchDashboardMetaData,
};
