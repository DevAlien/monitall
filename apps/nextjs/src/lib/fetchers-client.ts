export async function getMonitorCardData(
  slug: string,
  monitorId: number,
  h24: boolean = true,
) {
  const response = await fetch(
    `/api/v0/${slug}/pipes/eventsSmall?monitor_id=${Number(monitorId)}`,
  );

  if (!response?.ok) {
    throw new Error("Something went wrong");
  }

  // Redirect to the Stripe session.
  // This could be a checkout page for initial upgrade.
  // Or portal to manage existing subscription.
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

  return response.json();
}
