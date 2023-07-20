import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Button, ButtonProps, buttonVariants } from "./button";
import { cn } from "./utils/cn";

const buttonGroupVariants = cva("relative z-0 inline-flex");
export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <span
        className={cn(buttonGroupVariants({ className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
ButtonGroup.displayName = "ButtonGroup";

const buttonGroupButtonVariants = cva(
  "-ml-px first:ml-auto rounded-r-none rounded-l-none first:rounded-l-md last:rounded-r-md",
);
export interface ButtonGroupButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isActive?: boolean;
}

const ButtonGroupButton = React.forwardRef<
  HTMLButtonElement,
  ButtonGroupButtonProps
>(({ className, isActive, ...props }, ref) => {
  return (
    <Button
      className={cn(buttonGroupButtonVariants({ className }))}
      ref={ref}
      size="xxs"
      variant={(isActive && "active") || "outline"}
      {...props}
    />
  );
});

ButtonGroupButton.displayName = "ButtonGroupButton";

export { ButtonGroup, ButtonGroupButton, buttonGroupVariants };
