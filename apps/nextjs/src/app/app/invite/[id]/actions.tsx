import { type Organization } from "@prisma/client";

import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";

export const executeInvite = async ({
  token,
}: {
  token: string;
}): Promise<{ message?: string; organization?: Organization }> => {
  const user = await getCurrentUser();
  // const session = await getServerSession(authOptions);

  if (!user) {
    return { message: "You don't have permission to perform this action." };
  }
  const organization = await db.organization.findFirst({
    where: {
      inviteToken: token,
    },
    include: {
      users: true,
    },
  });

  if (!organization) {
    return { message: "The invite could not be found" };
  }
  if (organization.users.find((u) => u.userId === user.id)) {
    return { message: "You are already in this organization" };
  }

  await db.usersOnOrganizations.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      role: "MEMBER",
    },
  });

  return { organization: organization };
};
