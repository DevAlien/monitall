import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils/cn";

const dividerVariants = cva(
  "flex h-auto w-px items-center justify-center bg-border bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-100",
  {
    variants: {
      variant: {
        default: "",
        horizontal: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Divider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof dividerVariants>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(dividerVariants(), className)} {...props} />
));
Divider.displayName = "Divider";

export { Divider };
