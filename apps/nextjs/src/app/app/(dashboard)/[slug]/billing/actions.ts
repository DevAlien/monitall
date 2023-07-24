"use server";

import { Role } from "@prisma/client";
import { type OrganizationSubscriptionPlan } from "types";

import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";

import { freePlan, proPlan } from "~/app/config";

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

// export const updateTeamData = async ({
//   organizationId,
//   name,
// }: {
//   name: string;
//   organizationId: string;
// }) => {
//   const user = await getCurrentUser();
//   // const session = await getServerSession(authOptions);

//   if (!user) {
//     return new Response("Unauthorized", { status: 403 });
//   }

//   // const { user } = session;
//   await ensurePermissions(user.id, organizationId);

//   await db.organization.update({
//     data: { name },
//     where: { id: organizationId! },
//   });

//   revalidatePath("/asd");
//   revalidatePath("/asd/funds");
//   // const session = await Session.fromCookies(cookies())
//   // await ensurePermissions(session)

//   // await prisma.team.update({
//   // 	data: { name, avatarUrl },
//   // 	where: { id: session.teamId! },
//   // })

//   //   revalidatePath("${organizationId}/funds");
// };

export async function getOrganizationSubscriptionPlan(
  organizationId: string,
): Promise<OrganizationSubscriptionPlan> {
  const user = await getCurrentUser();
  // const session = await getServerSession(authOptions);

  if (!user) {
    throw new Error("User not found");
  }

  // const { user } = session;
  await ensurePermissions(user.id, organizationId);

  const organization = await db.organization.findFirst({
    where: {
      id: organizationId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!organization) {
    throw new Error("User not found");
  }

  // Check if user is on a pro plan.
  const isPro =
    (organization.stripePriceId &&
      organization.stripeCurrentPeriodEnd &&
      organization.stripeCurrentPeriodEnd?.getTime() + 86_400_000 >
        Date.now()) ||
    false;

  const plan = isPro ? proPlan : freePlan;

  return {
    ...plan,
    ...organization,
    stripeCurrentPeriodEnd: organization.stripeCurrentPeriodEnd?.getTime() || 0,
    isPro,
  };
}
