import { z } from "zod";

import { db } from "@monitall/db";

import { ApiError, getUserAndOrganizationFromSlug } from "~/lib/api";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { slug: string };
  },
) {
  try {
    const { searchParams } = new URL(req.url);
    const monitorId = searchParams.get("monitor_id");

    if (monitorId) {
      return new Response(null, { status: 404 });
    }

    const { organization } = await getUserAndOrganizationFromSlug(params.slug);

    const monitor = await db.monitor.findFirst({
      where: {
        id: Number(monitorId),
        organizationId: organization.id,
      },
    });
    if (!monitor) {
      return new Response(null, { status: 404 });
    }

    const incidents = await db.incident.findMany({
      where: {
        monitorId: Number(monitorId),
      },
    });
    if (!incidents) {
      return new Response(null, { status: 404 });
    }

    return new Response(JSON.stringify({ data: incidents }));
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
