import { DashboardHeader } from "~/app/app/(dashboard)/components/dashboard-header";
import { DashboardShell } from "~/app/app/(dashboard)/components/dashboard-shell";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" />
    </DashboardShell>
  );
}
