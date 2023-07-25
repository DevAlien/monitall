import { DashboardHeader } from "~/app/app/(dashboard)/components/dashboard-header";
import { DashboardShell } from "~/app/app/(dashboard)/components/dashboard-shell";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function IncidentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Incidents" />
    </DashboardShell>
  );
}
