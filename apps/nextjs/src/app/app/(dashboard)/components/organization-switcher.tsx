"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Organization } from "@prisma/client";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@monitall/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@monitall/ui/avatar";
import { Button } from "@monitall/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@monitall/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@monitall/ui/dialog";
import { Icons } from "@monitall/ui/icons";
import { Input } from "@monitall/ui/input";
import { Label } from "@monitall/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@monitall/ui/popover";
import { toast } from "@monitall/ui/use-toast";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface OrganizationSwitcherProps extends PopoverTriggerProps {
  organizations: Organization[];
}

const organizationPatchSchema = z.object({
  name: z.string().min(3).max(128),
});

type FormData = z.infer<typeof organizationPatchSchema>;

export function OrganizationSwitcher({
  className,
  organizations = [],
}: OrganizationSwitcherProps) {
  const params = useParams();
  const router = useRouter();
  const currentOrganizationSlug = params.slug;
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(organizationPatchSchema),
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const [open, setOpen] = React.useState(false);
  const [showNewOrganizationDialog, setShowNewOrganizationDialog] =
    React.useState(false);
  const [selectedOrganization, setSelectedOrganization] = React.useState<
    Organization | undefined
  >(organizations.find((o) => o.slug === currentOrganizationSlug));

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    const response = await fetch(`/api/organizations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
      }),
    });

    setIsSaving(false);

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your organization was not saved. Please try again.",
        variant: "destructive",
      });
    }
    toast({
      description: "Your organization has been created.",
    });

    const body = (await response.json()) as { slug: string };
    router.push(`/${body.slug}`);
  }

  return (
    <Dialog
      open={showNewOrganizationDialog}
      onOpenChange={setShowNewOrganizationDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a organization"
            className={cn("w-[200px] justify-between", className)}
          >
            {selectedOrganization && (
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${selectedOrganization?.name}.png`}
                  alt={selectedOrganization?.id}
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            )}
            {selectedOrganization && selectedOrganization.name}
            {!selectedOrganization && "Select an organization"}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search organization..." />
              <CommandEmpty>No organization found.</CommandEmpty>
              {organizations.map((organization) => (
                <CommandItem
                  key={organization.id}
                  onSelect={() => {
                    setSelectedOrganization(organization);
                    router.push(`/${organization.slug}`);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${organization.id}.png`}
                      alt={organization.name}
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  {organization.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedOrganization?.id === organization.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewOrganizationDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Organization
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              An organization is a container for all your changelogs.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization name</Label>
                <Input
                  id="name"
                  placeholder="Acme Inc."
                  {...register("name")}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewOrganizationDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
