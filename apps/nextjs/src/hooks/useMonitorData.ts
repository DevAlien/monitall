import useSWR from "swr";

import { fetcher } from "~/lib/fetchers-client";

type EventsData = {
  time: string;
  value: number;
  region: string;
};

export function useMonitorData(slug: string, monitorId: number) {
  const { data, isValidating } = useSWR<{ data: { data: EventsData[] } }>(
    `/api/v0/${slug}/pipes/events?monitor_id=${Number(monitorId)}`,
    fetcher,
    {
      revalidateOnMount: true,
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );
  console.log("data", data);
  return {
    data: data?.data.data,
    loading: isValidating,
  };
}
