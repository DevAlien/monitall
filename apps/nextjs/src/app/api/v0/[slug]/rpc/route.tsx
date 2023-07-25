import {
  MonitorEventStatus,
  MonitorStatus,
  type Organization,
} from "@prisma/client";
import { type SessionUser } from "types/next-auth";
import { z } from "zod";

import { db } from "@monitall/db";
import { sendMessage } from "@monitall/queue";

import { getUserAndOrganizationFromSlug } from "~/lib/api";
import { rpcSchema, rpcSchemaMonitorStatus } from "~/lib/schemas";

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

    const json: unknown = await req.json();
    const body = rpcSchema.parse(json);
    switch (body.method) {
      case "monitor-status":
        return await setMonitorStatus(
          user,
          organization,
          rpcSchemaMonitorStatus.parse(body.data),
        );
    }

    return new Response(null, { status: 404 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

async function setMonitorStatus(
  user: SessionUser,
  organization: Organization,
  data: z.infer<typeof rpcSchemaMonitorStatus>,
) {
  const monitor = await db.monitor.findFirst({
    where: {
      id: data.monitorId,
      organizationId: organization.id,
    },
  });
  if (!monitor) {
    return new Response(null, { status: 404 });
  }

  if (monitor.status === data.status) {
    return new Response(null, { status: 304 });
  }
  if (data.status === MonitorStatus.ACTIVE) {
    // TODO: maybe use a transaction here? return await prisma.$transaction(async (tx) => {
    await db.monitorEvent.updateMany({
      where: {
        monitorId: monitor.id,
        status: MonitorEventStatus.PENDING,
      },
      data: {
        status: MonitorEventStatus.CANCELLED as MonitorEventStatus,
      },
    });

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

  await db.monitor.update({
    where: {
      id: monitor.id,
    },
    data: {
      status: data.status,
    },
  });

  return new Response(null, { status: 200 });
}
