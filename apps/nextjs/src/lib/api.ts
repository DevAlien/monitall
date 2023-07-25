// import { type NextRequest } from "next/server";
import { getServerSession, type Session } from "next-auth";

import { authOptions } from "@monitall/auth";
import { db } from "@monitall/db";

export class ApiError extends Error {
  statusCode = 400;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  getErrorMessage() {
    return "Something went wrong: " + this.message;
  }
}

export async function getUserAndOrganizationFromSlug(
  // req: NextRequest,
  slug: string,
) {
  let session: Session | null = null;
  // if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
  //   token = req.headers.get("Authorization")?.substring(7);
  //   const apiKey = await getSessionFromToken(token);

  // } else {
  //   session = await getServerSession(authOptions);
  // }

  session = await getServerSession(authOptions);

  if (!session) {
    throw new ApiError("Unauthorized", 403);
  }

  const { user } = session;

  const organization = await db.organization.findFirst({
    where: {
      slug: slug,
      users: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  if (!organization) {
    throw new ApiError("Unauthorized", 403);
  }

  return { user, organization };
}

// async function getSessionFromToken(token: string): ApiKey {
//   return await db.apikey.findFirst({
//     where: {
//       key: token,
//     },
//   });
// }
