import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../../config";

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!payload.password || !user.password) {
    throw new Error("Password not provided");
  }

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }

  const accessToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
      id: user.id,
    },
    config.jwt.jwt_secret as string,
    { expiresIn: "1d", algorithm: "HS256" }
  );
  const refreshToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
      id: user.id,
    },
    config.jwt.jwt_secret as string,
    { expiresIn: "90d", algorithm: "HS256" }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUser,
};
