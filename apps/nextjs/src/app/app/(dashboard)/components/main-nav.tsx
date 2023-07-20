import Link from "next/link";
import { cn } from "@monitall/ui";

import { navItems } from "~/app/config";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "hidden items-center space-x-4 md:flex lg:space-x-6",
        className,
      )}
      {...props}
    >
      {navItems
        .filter(
          (n) =>
            (props.role !== "ADMIN" && n.role !== "ADMIN") ||
            props.role === "ADMIN",
        )
        .map((item, idx) => (
          <Link
            href={item.href}
            key={`${item.href}-${idx}`}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              idx !== 0 && "text-muted-foreground",
            )}
          >
            {item.title}
          </Link>
        ))}
    </nav>
  );
}
