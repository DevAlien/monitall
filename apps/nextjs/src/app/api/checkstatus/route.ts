import { authOptions } from "@monitall/auth";
import { db } from "@monitall/db";
import { sendMessage } from "@monitall/queue";
import { MonitorType } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { monitorCreateSchema } from "~/lib/schemas";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationSlug = searchParams.get("organization");

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const organization = await db.organization.findFirst({
      where: {
        slug: organizationSlug as string,
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    if (!organization) {
      return new Response("Unauthorized", { status: 403 });
    }

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

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationSlug = searchParams.get("organization");

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const organization = await db.organization.findFirst({
      where: {
        slug: organizationSlug as string,
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    if (!organization) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = monitorCreateSchema.parse(json);
    const monitor = await db.monitor.create({
      data: {
        name: body.name,
        interval: body.interval,
        address: body.address,
        region: body.regions,
        organizationId: organization.id,
        createdBy: user.id,
        type: MonitorType.HTTP,
      },
    });

    // TODO: if active
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
    return new Response(JSON.stringify(monitor));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
