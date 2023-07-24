import { getServerSession } from "next-auth";

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

export async function getUserAndOrganizationFromSlug(slug: string) {
  const session = await getServerSession(authOptions);

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
