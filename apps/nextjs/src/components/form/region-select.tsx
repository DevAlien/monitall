"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@monitall/ui/badge";
import {
  Command,
  CommandGroup,
  CommandInput2,
  CommandItem,
} from "@monitall/ui/command";

export type Region = Record<"value" | "label", string>;

const REGIONS = [
  {
    value: "eu-central-1",
    label: "eu-central-1",
  },
  {
    value: "us-west-2",
    label: "us-west-2",
  },
  {
    value: "us-east-1",
    label: "us-east-1",
  },
] satisfies Region[];

interface Props {
  value?: Region[];
  onChange?: (values: { value: string; label: string }[]) => void;
}

export const RegionSelect = ({ value, onChange }: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Region[]>(value || []);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((region: Region) => {
    setSelected((prev) => prev.filter((s) => s.value !== region.value));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [],
  );

  const selectables = REGIONS.filter((region) => !selected.includes(region));

  React.useEffect(() => {
    onChange?.(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((region) => {
            return (
              <Badge key={region.value} variant="secondary">
                {region.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(region);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(region)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandInput2
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select regions..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((region) => {
                return (
                  <CommandItem
                    key={region.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      setSelected((prev) => [...prev, region]);
                    }}
                    className={"cursor-pointer"}
                  >
                    {region.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
};
