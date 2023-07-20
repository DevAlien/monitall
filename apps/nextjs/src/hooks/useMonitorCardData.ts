import useSWR from "swr";

import { fetcher } from "~/lib/fetchers-client";

type EventsData = {
  time: string;
  value: number;
  status_code: number;
};

export function useMonitorCardData(
  slug: string,
  monitorId: number,
  last24h: boolean,
) {
  const { data, isValidating } = useSWR<{ data: { data: EventsData[] } }>(
    `/api/v0/${slug}/pipes/eventsSmall?monitor_id=${Number(monitorId)}${
      (last24h && "&last24h=true") || ""
    }`,
    fetcher,
    {
      revalidateOnMount: true,
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  return {
    data: data?.data.data,
    loading: isValidating,
  };
}
