"use server";

import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";

const ensurePermissions = async (userId: string, organizationId: string) => {
  const member = await db.usersOnOrganizations.findUniqueOrThrow({
    select: { role: true },
    where: {
      userId_organizationId: {
        userId: userId,
        organizationId: organizationId,
      },
    },
  });

  if (member.role != Role.OWNER && member.role != Role.ADMIN) {
    return { message: "You don't have permission to perform this action." };
  }

  return member.role;
};

export const updateTeamData = async ({
  organizationId,
  name,
}: {
  name: string;
  organizationId: string;
}) => {
  const user = await getCurrentUser();
  // const session = await getServerSession(authOptions);

  if (!user) {
    return new Response("Unauthorized", { status: 403 });
  }

  // const { user } = session;
  await ensurePermissions(user.id, organizationId);

  await db.organization.update({
    data: { name },
    where: { id: organizationId },
  });

  revalidatePath("/asd");
  revalidatePath("/asd/funds");
  // const session = await Session.fromCookies(cookies())
  // await ensurePermissions(session)

  // await prisma.team.update({
  // 	data: { name, avatarUrl },
  // 	where: { id: session.teamId! },
  // })

  //   revalidatePath("${organizationId}/funds");
};
