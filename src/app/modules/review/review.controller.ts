import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJwtPayload } from "../../type/common";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.createReview(user as IJwtPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Review created successfully!",
        data: result
    })
})

export const ReviewController = {
    createReview
}