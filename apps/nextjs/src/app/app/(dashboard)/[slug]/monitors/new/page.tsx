import { notFound } from "next/navigation";

import { getCurrentUser } from "@monitall/auth";

import { ModalNewMonitor } from "~/components/modal/new-monitor";
import { DashboardHeader } from "../../../components/dashboard-header";
import { DashboardShell } from "../../../components/dashboard-shell";

export default async function NewMonitorPage() {
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
