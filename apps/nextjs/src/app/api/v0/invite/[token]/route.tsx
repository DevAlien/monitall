import { getServerSession } from "next-auth";

import { authOptions } from "@monitall/auth";
import { db } from "@monitall/db";

import { ApiError } from "~/lib/api";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { token: string };
  },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("Unauthorized", 403);
    }

    const { user } = session;

    const organization = await db.organization.findFirst({
      where: {
        inviteToken: params.token,
      },
      include: {
        users: true,
      },
    });

    if (!organization) {
      return new Response(null, { status: 404 });
    }
    if (organization.users.find((u) => u.userId === user.id)) {
      return new Response(null, { status: 409 });
    }

    await db.usersOnOrganizations.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "MEMBER",
      },
    });

    return new Response(null);
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(error.message, { status: 500 });
    }

    return new Response(null, { status: 500 });
  }
}
