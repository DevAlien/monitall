// import "@monitall/ui/styles.css";
// import "../styles/globals.css";

import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";
import { Icons } from "@monitall/ui/icons";

import { ThemeToggle } from "~/components/theme-toggle";
import { UserNav } from "~/components/user-nav";
import { MainNav } from "~/app/app/(dashboard)/components/main-nav";
import { OrganizationSwitcher } from "~/app/app/(dashboard)/components/organization-switcher";
import { Search } from "~/app/app/(dashboard)/components/search";
import { AdminSidebar } from "./components/admin-sidebar";

export default async function RootLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { slug: string };
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) {
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
    <>
      <div className="min-h-screen overflow-hidden rounded-[0.5rem] bg-background">
        <nav className="border-b">
          <div className="flex h-16 items-center px-4 md:px-8">
            <Link href="/">
              <Icons.logo />
            </Link>
            <span className="mx-2 text-lg font-bold text-muted-foreground">
              /
            </span>
            <OrganizationSwitcher organizations={organizations} />
            <MainNav className="mx-6" role={user.role} />
            <div className="ml-auto flex items-center space-x-4">
              <Search />

              <ThemeToggle />
              {/* @ts-expect-error - ... */}
              <UserNav />
            </div>
          </div>
        </nav>
        <main>
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <AdminSidebar />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  {props.modal}
                  {props.children}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
