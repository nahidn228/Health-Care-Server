import express from "express";
import { userRoute } from "../modules/user/user.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
