import Link from "next/link";
import { cn } from "@monitall/ui";
import { buttonVariants } from "@monitall/ui/button";
import { Icons } from "@monitall/ui/icons";

import { MainNav } from "~/components/nav";
import { marketingConfig, marketingFeatures, siteConfig } from "~/app/config";
import { SiteFooter } from "./components/footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <Link href="/">
            <Icons.logo className="text-primary" />
          </Link>
          <MainNav items={marketingConfig.mainNav} />
          <nav>
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/signin`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "px-4",
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
