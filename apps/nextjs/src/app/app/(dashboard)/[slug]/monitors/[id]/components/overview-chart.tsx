"use client";

import { LineChart } from "@tremor/react";

import { useMonitorData } from "~/hooks/useMonitorData";
import { useOrganizationSlug } from "~/hooks/useOrganizationSlug";

interface ChartData extends Record<string, string | number> {
  time: string;
}

export default function OverviewChart(props: {
  monitorId: number;
  data?: Array<any>;
  categories?: string[];
  hour?: boolean;
}) {
  const organizationSlug = useOrganizationSlug();
  const { data: queryData } = useMonitorData(
    organizationSlug as string,
    props.monitorId,
  );

  const data: ChartData[] = [];
  const categories: string[] = [];
  if (queryData) {
    queryData.forEach((item) => {
      if (!categories.includes(item.region)) {
        categories.push(item.region);
      }
      if (data[data.length - 1]?.time === item.time) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data[data.length - 1]![item.region] = item.value;
        return;
      }
      data.push({
        time: item.time,
        [item.region]: item.value,
      });
    });
  }
  return (
    <LineChart
      className="mt-6"
      data={data}
      index="time"
      categories={categories}
      colors={["emerald", "gray", "rose"]}
      valueFormatter={dataFormatter}
      yAxisWidth={60}
      showXAxis={false}
    />
  );
}

const dataFormatter = (number: number) => `${parseInt(String(number))}ms`;
