"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@monitall/ui/card";
import { DateRangePicker } from "@monitall/ui/date-range-picker";
import { Icons } from "@monitall/ui/icons";

import OverviewChart from "./overview-chart";

export function Overview(props: { monitorId: number }) {
  // TODO: get monitor data from API

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OverviewCard
          title="Live and up for"
          icon="radio"
          content="27 days and 4 hours"
        />
        <OverviewCard
          title="Last checked"
          icon="activitySquare"
          content="54 seconds ago"
          subContent="average 234ms"
        />
        <OverviewCard
          title="Incidents"
          icon="warning"
          content="7"
          subContent="1 in the last 30 days"
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Response times across regions</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 pl-0">
            <div className="pl-6">
              <DateRangePicker align="start" />
            </div>
            <div className="pl-2">
              <OverviewChart monitorId={props.monitorId} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OverviewCard({
  title,
  content,
  icon,
  subContent,
}: {
  title: string;
  content: string;
  subContent?: string;
  icon: keyof typeof Icons;
}) {
  const Icon = Icons[icon];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content}</div>
        {subContent && (
          <p className="text-xs text-muted-foreground">{subContent}</p>
        )}
      </CardContent>
    </Card>
  );
}
