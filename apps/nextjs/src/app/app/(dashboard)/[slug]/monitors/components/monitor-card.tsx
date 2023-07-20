"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@monitall/ui/tabs";
import { Monitor } from "@prisma/client";
import { Badge, Card, Color, Flex, Text, Title, Tracker } from "@tremor/react";

import { queryPipe } from "~/utils/tinybird";
import { useMonitorCardData } from "~/hooks/useMonitorCardData";
import { useOrganizationSlug } from "~/hooks/useOrganizationSlug";

interface Tracker {
  time: string;
  color: Color;
  tooltip: string;
}

type EventsData = {
  time: string;
  value: number;
  status_code: number;
};
export const MonitorCard = (props: { monitor: Monitor }) => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState<string>("h24");
  const organizationSlug = useOrganizationSlug();
  let data: Tracker[] = [];
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
  return (
    <Card
      className="mx-auto max-w-sm cursor-pointer"
      onClick={() =>
        router.push(`/${organizationSlug}/monitors/${props.monitor.id}`)
      }
    >
      <Flex alignItems="start">
        <div>
          <Title>{props.monitor.name}</Title>
          <Text>Home</Text>
        </div>
        <span className="relative flex h-5 w-5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex h-5 w-5 rounded-full bg-primary"></span>
        </span>
        {/* <span className="inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span> */}
        {/* <Badge>{props.monitor.status}</Badge> */}
      </Flex>

      <Flex>
        <Flex className="pb-2 pt-2">
          <Tabs value={tabValue} onValueChange={setTabValue}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="h24">24h</TabsTrigger>
              <TabsTrigger value="d30">30d</TabsTrigger>
            </TabsList>
          </Tabs>
          <Flex justifyContent="end" className="mt-4">
            <Text>Uptime 100%</Text>
          </Flex>
        </Flex>
      </Flex>

      <Tracker data={data} className="mt-2" />
    </Card>
  );
};
