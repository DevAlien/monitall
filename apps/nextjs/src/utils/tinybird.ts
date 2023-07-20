import {
  ClientResponse,
  PipeParams,
  QueryError,
  QueryPipe,
  QuerySQL,
} from "../../types/tinybird";

export function getConfig() {
  const token = process.env.TINYBIRD_TOKEN;

  return {
    token,
  };
}

export async function client<T>(
  path: string,
  params?: RequestInit,
): Promise<ClientResponse<T>> {
  const { token } = getConfig();

  if (!token) throw new Error("Configuration not found");

  const apiUrl = "https://api.tinybird.co";

  const response = await fetch(`${apiUrl}/v0${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...params,
  });
  const data = (await response.json()) as ClientResponse<T>;

  if (!response.ok) {
    throw new QueryError(
      data?.error ?? "Something went wrong",
      response.status,
    );
  }
  return data;
}

export function queryPipe2<T>(
  name: string,
  searchParams: URLSearchParams,
): Promise<QueryPipe<T>> {
  return client(`/pipes/${name}.json?${searchParams}`);
}

export function queryPipe<T>(
  name: string,
  params: Partial<PipeParams<T>> = {},
): Promise<QueryPipe<T>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    searchParams.set(key, value);
  });

  return client(`/pipes/${name}.json?${searchParams}`);
}

export function querySQL<T>(sql: string): Promise<QuerySQL<T>> {
  return client(`/sql?q=${sql}`);
}
