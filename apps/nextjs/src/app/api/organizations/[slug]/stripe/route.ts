import { authOptions } from "@monitall/auth";
import { db } from "@monitall/db";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { getOrganizationSubscriptionPlan } from "~/app/app/(dashboard)/[slug]/billing/actions";
import { proPlan } from "~/app/config";
import { stripe } from "~/lib/stripe";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { slug: string };
  },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const organization = await db.organization.findFirst({
      where: {
        slug: params.slug as string,
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
    const subscriptionPlan = await getOrganizationSubscriptionPlan(
      organization.id,
    );

    const billingUrl = absoluteUrl(`/${params.slug}/billing`);
    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });

      return new Response(JSON.stringify({ url: stripeSession.url }));
    }

    // The user is on the free plan.
    // Create a checkout session to upgrade.
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.email,
      line_items: [
        {
          price: proPlan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        organizationId: organization.id,
      },
    });

    return new Response(JSON.stringify({ url: stripeSession.url }));
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
