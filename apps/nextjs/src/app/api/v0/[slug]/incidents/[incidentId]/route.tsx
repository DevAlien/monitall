import { z } from "zod";

import { db } from "@monitall/db";

import { ApiError, getUserAndOrganizationFromSlug } from "~/lib/api";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { slug: string; incidentId: string };
  },
) {
  try {
    const { searchParams } = new URL(req.url);
    const monitorId = searchParams.get("monitor_id");

    if (monitorId) {
      return new Response(null, { status: 404 });
    }

    const { organization } = await getUserAndOrganizationFromSlug(params.slug);

    const incident = await db.incident.findFirst({
      where: {
        id: Number(params.incidentId),
      },
    });

    if (!incident) {
      return new Response(null, { status: 404 });
    }

    const monitor = await db.monitor.findFirst({
      where: {
        id: Number(incident?.monitorId),
      },
    });

    if (!monitor || monitor.organizationId !== organization.id) {
      return new Response(null, { status: 404 });
    }

    return new Response(JSON.stringify({ data: incident }));
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
