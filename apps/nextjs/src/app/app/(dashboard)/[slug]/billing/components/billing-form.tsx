"use client";

import * as React from "react";
import { type OrganizationSubscriptionPlan } from "types";

// import { UserSubscriptionPlan } from "types"
import { cn } from "@monitall/ui";
import { buttonVariants } from "@monitall/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@monitall/ui/card";
import { Icons } from "@monitall/ui/icons";
import { toast } from "@monitall/ui/use-toast";

interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
  organizationSlug: string;
  subscriptionPlan: OrganizationSubscriptionPlan & {
    isCanceled: boolean;
  };
}

export function BillingForm({
  subscriptionPlan,
  organizationSlug,
  className,
  ...props
}: BillingFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(!isLoading);

    // Get a Stripe session URL.
    const response = await fetch(`/api/v0/${organizationSlug}/stripe`);

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    }

    // Redirect to the Stripe session.
    // This could be a checkout page for initial upgrade.
    // Or portal to manage existing subscription.
    // type StripeSessionResponse = {
    //   url?: string;
    // };
    const responseBody = await response.json();
    if (responseBody) {
      window.location.href = responseBody.url as string;
    }
  }

  return (
    <form className={cn(className)} onSubmit={onSubmit} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
            plan.
          </CardDescription>
        </CardHeader>
        <CardContent>{subscriptionPlan.description}</CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {subscriptionPlan.isPro ? "Manage Subscription" : "Upgrade to PRO"}
          </button>
          {subscriptionPlan.isPro ? (
            <p className="rounded-full text-xs font-medium">
              {subscriptionPlan.isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on "}
              {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.
            </p>
          ) : null}
        </CardFooter>
      </Card>
    </form>
  );
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
