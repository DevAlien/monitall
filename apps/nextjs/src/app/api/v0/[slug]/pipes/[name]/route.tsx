import { z } from "zod";

import { db } from "@monitall/db";

import { queryPipe2 } from "~/utils/tinybird";
import { ApiError, getUserAndOrganizationFromSlug } from "~/lib/api";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { slug: string; name: string };
  },
) {
  try {
    const { searchParams } = new URL(req.url);

    const { organization } = await getUserAndOrganizationFromSlug(params.slug);
    if (searchParams.get("monitor_id")) {
      const monitor = await db.monitor.findFirst({
        where: {
          id: Number(searchParams.get("monitor_id")),
          organizationId: organization.id,
        },
      });
      if (!monitor) {
        return new Response(null, { status: 404 });
      }
    }

    const data = await queryPipe2(params.name, searchParams);

    // const subscriptionPlan = await getOrganizationSubscriptionPlan(
    //   organization.id,
    // );

    return new Response(JSON.stringify({ data }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    if (error instanceof ApiError) {
      return new Response(error.message, { status: 500 });
    }

    return new Response(null, { status: 500 });
  }
}
