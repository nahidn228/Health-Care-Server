import {  UserRole, UserStatus } from "@prisma/client";

export interface IJwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}



export type IUser = {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  role: UserRole;
  needPasswordChange: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  admin?: Admin | null;
  doctor?: Doctor | null;
  patient?: Patient | null;
};


export interface Admin {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber: string;
  role: UserRole;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber: string;
  address: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  role: UserRole;
  experience: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  address?: string | null;
  isDeleted: boolean;
  password?: string | null;
  role: UserRole;
  needPasswordChange: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
