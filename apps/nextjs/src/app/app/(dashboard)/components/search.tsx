"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@monitall/ui/command";
import { Icons } from "@monitall/ui/icons";
import { Input } from "@monitall/ui/input";

export function Search() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div className="relative">
        <Input
          onClick={() => setOpen(true)}
          type="search"
          placeholder="Search..."
          className="h-9 pl-5 pr-4 md:w-[100px] lg:w-[300px]"
        />

        <kbd className="pointer-events-none absolute right-0 top-0 m-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Icons.activity className="mr-2 h-4 w-4" />
              <span>Monitors</span>
            </CommandItem>
            <CommandItem>
              <Icons.warning className="mr-2 h-4 w-4" />
              <span>Incidents</span>
            </CommandItem>
            <CommandItem>
              <Icons.radio className="mr-2 h-4 w-4" />
              <span>Status page</span>
            </CommandItem>
            <CommandItem>
              <Icons.integrations className="mr-2 h-4 w-4" />
              <span>Integrations</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <Icons.organization className="mr-2 h-4 w-4" />
              <span>Organization</span>
              <CommandShortcut>⌘O</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Icons.billing className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="User">
            <CommandItem>
              <Icons.user className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
