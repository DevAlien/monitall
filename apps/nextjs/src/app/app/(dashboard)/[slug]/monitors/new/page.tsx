import { notFound } from "next/navigation";
import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";

import { ModalNewMonitor } from "~/components/modal/new-monitor";
import { DashboardHeader } from "../../../components/dashboard-header";
import { DashboardShell } from "../../../components/dashboard-shell";

export default async function FundsPage(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { slug: string; id: number };
}) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={"Add new monitor"} />
      <ModalNewMonitor />
    </DashboardShell>
  );
}
