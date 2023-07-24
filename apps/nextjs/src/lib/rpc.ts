import { type z } from "zod";

import { type rpcSchema } from "./schemas";

export async function rpc(
  slug: string,
  data: z.infer<typeof rpcSchema>,
): Promise<boolean> {
  const response = await fetch(`/api/v0/${slug}/rpc`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response?.ok) {
    throw new Error("Something went wrong");
  }

  return true;
}
