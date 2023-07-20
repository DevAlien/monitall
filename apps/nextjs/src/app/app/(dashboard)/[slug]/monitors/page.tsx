import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";
import { Button } from "@monitall/ui/button";

import { DashboardEmpty } from "../../components/dashboard-empty";
import { DashboardHeader } from "../../components/dashboard-header";
import { DashboardShell } from "../../components/dashboard-shell";
import { MonitorsTable } from "./components/monitors-table";

export default async function FundsPage(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { slug: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const monitors = await db.monitor.findMany({
    where: {
      Organization: {
        is: {
          slug: props.params.slug as string,
        },
      },
    },
  });

  if (!monitors) {
    return notFound();
  }

  // const users = await db.usersOnOrganizations.findMany({
  //   where: {
  //     organizationId: organization.id,
  //   },
  // });
  return (
    <DashboardShell>
      <DashboardHeader heading="Monitors" text="Edit or create a new mo.">
        <Link href={`/${props.params.slug}/monitors/new`}>
          <Button>New monitor</Button>
        </Link>
      </DashboardHeader>
      {monitors.length > 0 ? (
        <MonitorsTable monitors={monitors} />
      ) : (
        <DashboardEmpty
          icon="activity"
          title="Create your first monitor"
          description="You don't have any monitors yet. Start creating one."
        >
          <Link href={`/${props.params.slug}/monitors/new`}>
            <Button>New monitor</Button>
          </Link>
        </DashboardEmpty>
      )}
    </DashboardShell>
  );
}
