import { type UserRole } from "@prisma/client";
import { type User } from "next-auth";
import { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
  }
}

type SessionUser = User & {
  id: UserId;
  role: UserRole;
};
declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
}
