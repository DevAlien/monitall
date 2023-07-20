import { authOptions } from "@monitall/auth";
import { db } from "@monitall/db";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import slugify from "slugify";
import * as z from "zod";

const organizationCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const posts = await db.organization.findMany({
      where: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = organizationCreateSchema.parse(json);
    let slug = slugify(body.name.toLowerCase());
    let counter = 0;
    while (!(await isSlugAvailable(slug))) {
      slug = `${slug}-${counter++}`;
    }

    const organization = await db.organization.create({
      data: {
        name: body.name,
        description: body.description,
        slug: slug,
        authorId: user.id,
        users: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
            role: Role.OWNER,
            assignedBy: user.id,
          },
        },
      },
      select: {
        id: true,
        slug: true,
      },
    });

    return new Response(JSON.stringify(organization));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

async function isSlugAvailable(slug: string) {
  const organization = await db.organization.findUnique({
    where: {
      slug,
    },
  });

  return !organization;
}
