"use client";

import { type Monitor } from "@prisma/client";

import { MonitorCard } from "./monitor-card";

export function MonitorsTable(props: { monitors: Monitor[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {props.monitors.map((monitor) => (
        <MonitorCard
          key={monitor.id}
          monitor={monitor}
          // link={() =>
          //   router.push(`/${origanizationSlug}/monitors/${monitor.id}`)
          // }
        />
      ))}
    </div>
  );
}
