import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";

<span className="relative flex h-5 w-5">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
  <span className="relative inline-flex h-5 w-5 rounded-full bg-primary"></span>
</span>;

const statusDotVariants = cva("relative inline-flex rounded-full", {
  variants: {
    variant: {
      default: "bg-primary",
      off: "bg-border",
    },
    size: {
      default: "h-5 w-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusDotVariants> {}

function StatusDot({ className, variant, ...props }: StatusDotProps) {
  return (
    <span
      className={cn(statusDotVariants({ variant }), className)}
      {...props}
    />
  );
}

const statusDotAnimationVariants = cva(
  "absolute inline-flex h-full w-full animate-ping rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary opacity-75",
        off: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface StatusDotAnimationProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusDotAnimationVariants> {}

function StatusDotAnimation({
  className,
  variant,
  ...props
}: StatusDotAnimationProps) {
  return (
    <span
      className={cn(statusDotAnimationVariants({ variant }), className)}
      {...props}
    />
  );
}

const statusVariants = cva("relative flex", {
  variants: {
    variant: {
      default: "",
      off: "",
    },
    size: {
      default: "h-5 w-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface StatusProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {}

function Status({ className, variant, ...props }: StatusProps) {
  return (
    <span className={cn(statusDotVariants({ variant }), className)} {...props}>
      {variant !== "off" && <StatusDotAnimation variant={variant} />}
      <StatusDot variant={variant} />
    </span>
  );
}
export { Status };
