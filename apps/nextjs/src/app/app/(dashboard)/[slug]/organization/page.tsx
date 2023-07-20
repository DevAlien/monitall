import { notFound } from "next/navigation";
import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";
import { Organization } from "@prisma/client";

import { DashboardHeader } from "../../components/dashboard-header";
import { DashboardShell } from "../../components/dashboard-shell";
import { Members } from "./components/members";
import EditOrganizationDetails from "./components/team-form";

export default async function FundsPage(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { slug: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const organization = await db.organization.findFirst({
    where: {
      slug: props.params.slug as string,
      users: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      users: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });
  if (!organization) {
    return notFound();
  }

  // const users = await db.usersOnOrganizations.findMany({
  //   where: {
  //     organizationId: organization.id,
  //   },
  // });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Organization"
        text="Manage your organization and its members"
      />
      <EditOrganizationDetails organization={organization as Organization} />
      <Members members={organization.users} />
    </DashboardShell>
  );
}