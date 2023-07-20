"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@monitall/ui/tabs";

export interface DashboardTabsTab {
  key: string;
  title: string;
  content?: React.ReactNode;
  disabled?: boolean;
}

export interface DashboardTabsProps {
  defaultTab: string;
  tabs: DashboardTabsTab[];
  disabled?: boolean;
}

export function DashboardTabs({ tabs, defaultTab }: DashboardTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const tabsTriggers: React.ReactNode[] = [];
  const tabsContents: React.ReactNode[] = [];
  tabs.forEach((tab) => {
    tabsTriggers.push(
      <TabsTrigger key={tab.key} value={tab.key} disabled={tab.disabled}>
        {tab.title}
      </TabsTrigger>,
    );
    tabsContents.push(
      <TabsContent key={tab.key} value={tab.key}>
        {tab.content}
      </TabsContent>,
    );
  });

  return (
    <Tabs
      onValueChange={(value) => {
        router.replace(
          value === defaultTab ? pathname : `${pathname}?tab=${value}`,
        );
      }}
      value={searchParams.get("tab") ?? defaultTab}
      defaultValue="overview"
      className="space-y-4"
    >
      <TabsList>{tabsTriggers}</TabsList>
      {tabsContents}
    </Tabs>
  );
}
