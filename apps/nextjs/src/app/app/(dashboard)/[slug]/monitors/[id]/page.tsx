"use server";

import { notFound } from "next/navigation";
import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";
import { Button } from "@monitall/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@monitall/ui/card";
import { Icons } from "@monitall/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@monitall/ui/tabs";
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
} from "lucide-react";

import { queryPipe } from "~/utils/tinybird";
import { DashboardHeader } from "~/app/app/(dashboard)/components/dashboard-header";
import { DashboardShell } from "~/app/app/(dashboard)/components/dashboard-shell";
import { DashboardTabs } from "~/app/app/(dashboard)/components/dashboard-tabs";
import { RecentSales } from "../../components/recent-sales";
import LineChartEvents from "../components/line-chart";
import { Overview } from "./components/overview";

type EventsData = {
  time: string;
  value: number;
  region: string;
};
export default async function FundsPage(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
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
          slug: props.params.slug as string,
        },
      },
    },
  });
  // const { data: queryData } = await queryPipe<EventsData>("events", {
  //   monitor_id: Number(props.params.id),
  // });
  // console.log("query_data", queryData);
  // if (!monitor) {
  //   return notFound();
  // }
  // let data = [];
  // let categories = [];
  // queryData.forEach((item) => {
  //   if (!categories.includes(item.region)) {
  //     categories.push(item.region);
  //   }
  //   if (data[data.length - 1]?.time === item.time) {
  //     data[data.length - 1][item.region] = item.value;
  //     return;
  //   }
  //   data.push({
  //     time: item.time,
  //     [item.region]: item.value,
  //   });
  // });
  return (
    <DashboardShell>
      <DashboardHeader heading={monitor.name} />
      {/* <LineChartEvents data={data} categories={categories} /> */}
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
