import { Suspense } from "react";

import { Icons } from "@monitall/ui/icons";

import { CreateOrganization } from "~/components/create-organization";
import { MobileDropdown } from "~/components/mobile-nav";
import { UserNav } from "~/components/user-nav";
import { MainNav } from "~/app/app/(dashboard)/components/main-nav";

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Home() {
  return (
    <>
      <nav className="fixed left-0 right-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <div className="mr-8 hidden items-center md:flex">
            <Icons.logo className="mr-2 h-6 w-6" />
            <span className="text-lg font-bold tracking-tight">Monitall</span>
          </div>
          <MobileDropdown />
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Suspense>
              {/* @ts-expect-error - ... */}
              <UserNav />
            </Suspense>
          </div>
        </div>
      </nav>
      <div className="h-96 p-28">ASD</div>
      <main className="container flex w-full flex-col items-center justify-center pt-48">
        <div className="flex items-center justify-center">
          <CreateOrganization />
        </div>
      </main>
    </>
  );
}
