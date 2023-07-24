"use server";

import { notFound } from "next/navigation";
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
} from "lucide-react";

import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";

import { DashboardHeader } from "~/app/app/(dashboard)/components/dashboard-header";
import { DashboardShell } from "~/app/app/(dashboard)/components/dashboard-shell";
import { DashboardTabs } from "~/app/app/(dashboard)/components/dashboard-tabs";
import { Overview } from "./components/overview";

export default async function SingleMonitorPage(props: {
  params: { slug: string; id: number };
}) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const monitor = await db.monitor.findFirst({
    where: {
      id: Number(props.params.id),
      Organization: {
        is: {
          slug: props.params.slug,
        },
      },
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader heading={monitor.name} />
      <DashboardTabs
        defaultTab="overview"
        tabs={[
          {
            key: "overview",
            title: "Overview",
            content: <Overview monitorId={props.params.id} />,
          },
          {
            key: "incidents",
            title: "Incidents",
            disabled: false,
            content: (
              <div className="flex h-full flex-col items-center justify-center">
                asd
              </div>
            ),
          },
        ]}
      />
    </DashboardShell>
  );
}
