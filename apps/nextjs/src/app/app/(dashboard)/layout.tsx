import "@monitall/ui/styles.css";
import "~/styles/globals.css";
import "~/styles/style.css";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";
import { Icons } from "@monitall/ui/icons";

import { MobileDropdown } from "~/components/mobile-nav";
import { ThemeToggle } from "~/components/theme-toggle";
import { UserNav } from "~/components/user-nav";
import { MainNav } from "~/app/app/(dashboard)/components/main-nav";
import { OrganizationSwitcher } from "~/app/app/(dashboard)/components/organization-switcher";
import { Search } from "~/app/app/(dashboard)/components/search";

export default async function RootLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const organizations = await db.organization.findMany({
    where: {
      users: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  return (
    <div className="min-h-screen overflow-hidden rounded-[0.5rem] bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <MobileDropdown />
          <Link href="/">
            <Icons.logo />
          </Link>
          <span className="mx-2 text-lg font-bold text-muted-foreground">
            /
          </span>
          <OrganizationSwitcher organizations={organizations} />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />

            <ThemeToggle />
            {/* @ts-expect-error - ... */}
            <UserNav />
          </div>
        </div>
      </div>

      {props.modal}
      {props.children}
    </div>
  );
}
