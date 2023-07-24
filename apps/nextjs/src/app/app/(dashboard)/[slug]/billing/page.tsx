import { notFound } from "next/navigation";

import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";

import { stripe } from "~/lib/stripe";
import { DashboardHeader } from "../../components/dashboard-header";
import { DashboardShell } from "../../components/dashboard-shell";
import { getOrganizationSubscriptionPlan } from "./actions";
import { BillingForm } from "./components/billing-form";

export default async function BillingPage(props: { params: { slug: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }
  const organization = await db.organization.findFirst({
    where: {
      slug: props.params.slug,
      users: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  if (!organization) {
    return notFound();
  }

  const subscriptionPlan = await getOrganizationSubscriptionPlan(
    organization.id,
  );

  // If user has a pro plan, check cancel status on Stripe.
  let isCanceled = false;
  if (subscriptionPlan.isPro && subscriptionPlan.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscriptionPlan.stripeSubscriptionId,
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  // const users = await db.usersOnOrganizations.findMany({
  //   where: {
  //     organizationId: organization.id,
  //   },
  // });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <BillingForm
          organizationSlug={props.params.slug}
          subscriptionPlan={{
            ...subscriptionPlan,
            isCanceled,
          }}
        />
      </div>
    </DashboardShell>
  );
}
