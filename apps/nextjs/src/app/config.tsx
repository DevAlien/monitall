import { type Route } from "next";
import { Component, Globe } from "lucide-react";
import { type SidebarNavItem, type SubscriptionPlan } from "types";

import { Icons } from "@monitall/ui/icons";

export const siteConfig = {
  github: "https://github.com/devalien/monitall",
  twitter: "https://twitter.com/devalien",
  name: "Monitall",
};

export const dashboardNav: SidebarNavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: "home",
  },
  {
    title: "Monitors",
    href: "/monitors",
    icon: "activity",
  },
  {
    title: "Incidents",
    href: "/incidents",
    icon: "warning",
  },
  {
    title: "Status page",
    href: "/status-pages",
    icon: "radio",
  },
  {
    title: "Integratations",
    href: "/integrations",
    icon: "integrations",
  },
  {
    separator: true,
    title: "Settings",
  },
  {
    title: "Organization",
    href: "/organization",
    icon: "organization",
  },
  {
    title: "Billing",
    href: "/billing",
    icon: "billing",
  },
];

export const homeDashboardNav: SidebarNavItem[] = [
  {
    title: "Organizations",
    href: "/",
    icon: "home",
  },

  {
    title: "Profile",
    href: "/profile",
    icon: "user",
  },
];

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description:
    "The free plan is limited to 1 monitor. Upgrade to the PRO plan for unlimited monitors.",
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description: "The PRO plan has unlimited monitors.",
  stripePriceId: process.env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
};

export const navItems = [
  {
    href: "/admin",
    title: "Admin",
    role: "ADMIN",
  },
] satisfies { href: Route; title: string; role?: string }[];

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};
export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};
export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "Features",
      href: "/#features",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
  ],
};

export const marketingFeatures = [
  {
    icon: <Component />,
    title: "UI Package",
    body: (
      <>
        A UI package with all the components you need for your next application.
        Built by the wonderful{" "}
        <a
          href="https://ui.shadcn.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Shadcn
        </a>
        .
      </>
    ),
  },
  {
    icon: <Icons.clerkWide />,
    title: "Authentication",
    body: (
      <>
        Protect pages and API routes throughout your entire app using{" "}
        <a
          href="https://clerk.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Clerk
        </a>
        .
      </>
    ),
  },
  {
    icon: <Icons.mdx />,
    title: "MDX",
    body: (
      <>
        Preconfigured MDX as Server Components. MDX is the best way to write
        contentful pages.
      </>
    ),
  },
  {
    icon: (
      <div className="flex gap-2 self-start">
        <Icons.trpc className="h-8 w-8" />
        <Icons.nextjs className="h-8 w-8" />
        <Icons.react className="h-8 w-8" />
        <Icons.kysely className="h-8 w-8" />
        <Icons.prisma className="h-8 w-8" />
      </div>
    ),
    extraClassNames: "md:col-span-2",
    title: "Full-stack Typesafety",
    body: (
      <>
        Full-stack Typesafety with{" "}
        <a
          href="https://trpc.io"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          tRPC
        </a>
        ,{" "}
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Next.js
        </a>
        , and{" "}
        <a
          href="https://reactjs.org"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          React
        </a>{" "}
        Server Components. Typesafe database access using{" "}
        <a
          href="https://kysely.dev"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Kysely
        </a>{" "}
        as query builder, and{" "}
        <a
          href="https://prisma.io"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Prisma
        </a>{" "}
        for schema management.
      </>
    ),
  },
  {
    icon: <Globe />,
    title: "Edge Compute",
    body: (
      <>
        Ready to deploy on Edge functions to ensure a blazingly fast application
        with optimal UX.
      </>
    ),
  },
];
