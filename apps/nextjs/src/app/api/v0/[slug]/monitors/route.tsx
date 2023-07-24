import { MonitorStatus, MonitorType } from "@prisma/client";
import { z } from "zod";

import { db } from "@monitall/db";
import { sendMessage } from "@monitall/queue";

import { getUserAndOrganizationFromSlug } from "~/lib/api";
import { monitorCreateSchema } from "~/lib/schemas";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { slug: string; name: string };
  },
) {
  try {
    const { organization } = await getUserAndOrganizationFromSlug(params.slug);

    const changelogs = await db.monitor.findFirst({
      where: {
        organizationId: organization.id,
      },
    });

    return new Response(JSON.stringify(changelogs));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { slug: string; name: string };
  },
) {
  try {
    const { user, organization } = await getUserAndOrganizationFromSlug(
      params.slug,
    );

    const json = await req.json();
    const body = monitorCreateSchema.parse(json);
    const monitor = await db.monitor.create({
      data: {
        name: body.name,
        interval: body.interval,
        address: body.address,
        region: body.regions,
        status: body.status || MonitorStatus.ACTIVE,
        organizationId: organization.id,
        createdBy: user.id,
        type: MonitorType.HTTP,
      },
    });

    // TODO: if active
    if (body.status === MonitorStatus.ACTIVE) {
      const monitorEvent = await db.monitorEvent.create({
        data: {
          monitorId: monitor.id,
          scheduledAt: new Date(),
          address: monitor.address,
        },
      });

      sendMessage(
        {
          id: monitorEvent.id,
          monitorId: monitor.id,
        },
        new Date(),
      );
    }

    return new Response(JSON.stringify(monitor));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
