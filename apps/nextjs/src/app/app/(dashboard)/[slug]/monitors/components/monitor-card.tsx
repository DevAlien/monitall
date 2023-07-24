"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MonitorStatus, type Monitor } from "@prisma/client";
import { Text, Title, Tracker, type Color } from "@tremor/react";
import { type z } from "zod";

import { Card, CardContent } from "@monitall/ui/card";
import { Status } from "@monitall/ui/extra/status";
import { Tabs, TabsList, TabsTrigger } from "@monitall/ui/tabs";
import { toast } from "@monitall/ui/use-toast";

import { useMonitorCardData } from "~/hooks/useMonitorCardData";
import { useOrganizationSlug } from "~/hooks/useOrganizationSlug";
import { rpc } from "~/lib/rpc";
import { type rpcSchemaMonitorStatus } from "~/lib/schemas";

interface Tracker {
  time: string;
  color: Color;
  tooltip: string;
}

export const MonitorCard = (props: { monitor: Monitor }) => {
  const router = useRouter();

  const [tabValue, setTabValue] = useState<string>("h24");
  const organizationSlug = useOrganizationSlug();
  const data: Tracker[] = [];
  const { data: queryData, loading } = useMonitorCardData(
    organizationSlug as string,
    props.monitor.id,
    tabValue === "h24",
  );
  try {
    if (!queryData && !loading) {
      return <></>;
    }

    if (queryData) {
      queryData.forEach((item) => {
        let color: Color = item.status_code === 200 ? "emerald" : "rose";
        let tooltip =
          item.status_code === 200
            ? `Operational - ${parseInt(String(item.value))}ms`
            : "Downtime";
        if (item.status_code === 0) {
          color = "gray";
          tooltip = "Unknown";
        }
        if (
          data[data.length - 1]?.time === item.time &&
          data[data.length - 1]?.color === "emerald"
        ) {
          data[data.length - 1] = {
            color: color,
            tooltip: tooltip,
            time: item.time,
          };
          return;
        }
        data.push({
          color: color,
          tooltip: tooltip,

          time: item.time,
        });
      });
    }
  } catch (e) {
    console.log(e);
    return <></>;
  }
  const updateStatus = async (monitorId: number, status: MonitorStatus) => {
    try {
      const data: z.infer<typeof rpcSchemaMonitorStatus> = {
        monitorId: monitorId,
        status:
          status === MonitorStatus.ACTIVE
            ? MonitorStatus.INACTIVE
            : MonitorStatus.ACTIVE,
      };

      await rpc(organizationSlug as string, {
        method: "monitor-status",
        data: data,
      });
      return toast({
        title: data.status === MonitorStatus.ACTIVE ? "Activated" : "Paused",
        description:
          data.status === MonitorStatus.ACTIVE
            ? "Activated sucessfully"
            : "Paused sucessfully",
      });
    } catch (e) {
      console.log(e);
      return toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <Card
      className="cursor-pointer"
      onClick={() =>
        router.push(
          `/${organizationSlug as string}/monitors/${props.monitor.id}`,
        )
      }
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <Title>{props.monitor.name}</Title>
            <Text>Home</Text>
          </div>
          <Status
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              updateStatus(props.monitor.id, props.monitor.status);
            }}
            variant={
              (props.monitor.status === MonitorStatus.INACTIVE && "off") ||
              "default"
            }
          />
        </div>

        <div className="flex justify-between pb-2 pt-2">
          <Tabs value={tabValue} onValueChange={setTabValue}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="h24">24h</TabsTrigger>
              <TabsTrigger value="d30">30d</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-4 flex justify-end">
            <Text>Uptime 100%</Text>
          </div>
        </div>

        <Tracker data={data} className="mt-2" />
      </CardContent>
    </Card>
  );
};
