"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@monitall/ui";
import { Button } from "@monitall/ui/button";
import { Icons } from "@monitall/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@monitall/ui/popover";
import { ScrollArea } from "@monitall/ui/scroll-area";

import { Search } from "~/app/app/(dashboard)/components/search";
import { dashboardNav, homeDashboardNav } from "~/app/config";
import { useOrganizationSlug } from "~/hooks/useOrganizationSlug";

export function MobileDropdown() {
  const slug = useOrganizationSlug();
  const items = slug ? dashboardNav : homeDashboardNav;
  const [isOpen, setIsOpen] = React.useState(false);
  const path = usePathname();

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  if (!items?.length) {
    return null;
  }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Icons.menu className="mr-2 h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-40 mt-2 h-[calc(100vh-4rem)] w-screen animate-none rounded-none border-none transition-transform">
        <Search />
        <ScrollArea className="py-8">
          {items.map((item, index) => {
            const Icon = Icons[item.icon || "arrowRight"];

            if ("separator" in item) {
              return (
                <h2
                  key={"i" + index.toString()}
                  className="mb-2 mt-6 px-6 text-lg font-semibold tracking-tight"
                >
                  {item.title}
                </h2>
              );
            }
            const dashboardHref = slug
              ? "/" + (slug || "") + (item.href || "")
              : item.href;
            return (
              item.href && (
                <Link
                  key={"i" + index.toString()}
                  href={item.disabled ? "/" : (dashboardHref as string)}
                >
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      path === dashboardHref ? "bg-accent" : "transparent",
                      item.disabled && "cursor-not-allowed opacity-80",
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </span>
                </Link>
              )
            );
          })}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
