export async function getMonitorCardData(
  slug: string,
  monitorId: number,
  // h24 = true,
) {
  const response = await fetch(
    `/api/v0/${slug}/pipes/eventsSmall?monitor_id=${Number(monitorId)}`,
  );

  if (!response?.ok) {
    throw new Error("Something went wrong");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    data: { data: queryData },
  } = await response.json();

   
  return queryData;
}

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, { ...init, cache: "no-store" });

  return response.json() as Promise<JSON>;
}
