import { Icons } from "@monitall/ui/icons";

import { EmptyPlaceholder } from "~/components/empty-section";

interface DashboardEmptyProps {
  icon?: keyof typeof Icons;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function DashboardEmpty({
  icon,
  title,
  description,
  children,
}: DashboardEmptyProps) {
  return (
    <EmptyPlaceholder>
      {icon && <EmptyPlaceholder.Icon name={icon} />}
      {title && <EmptyPlaceholder.Title>{title}</EmptyPlaceholder.Title>}
      {description && (
        <EmptyPlaceholder.Description>
          {description}
        </EmptyPlaceholder.Description>
      )}
      {children}
    </EmptyPlaceholder>
  );
}
