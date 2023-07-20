"use client";

import * as React from "react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@monitall/ui/button";
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
import { toast } from "@monitall/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface OrganizationSwitcherProps {
  children: ReactNode;
}

const newOrganizationPatchSchema = z.object({
  name: z.string().min(3).max(128),
  description: z.string().min(3).max(128),
});

type FormData = z.infer<typeof newOrganizationPatchSchema>;

export function ModalNewOrganization({ children }: OrganizationSwitcherProps) {
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(newOrganizationPatchSchema),
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const [showNewOrganizationDialog, setShowNewOrganizationDialog] =
    React.useState(false);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    const response = await fetch(`/api/organizations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
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

    const body = await response.json();
    router.push(`/${body.slug}`);
  }

  return (
    <Dialog
      open={showNewOrganizationDialog}
      onOpenChange={setShowNewOrganizationDialog}
    >
      <DialogTrigger asChild>
        {/* <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewOrganizationDialog(true);
                    }}
                  > */}
        {children}
      </DialogTrigger>
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
              <div className="space-y-2">
                <Label htmlFor="name">Organization name</Label>
                <Input
                  id="description"
                  placeholder="Acme Inc. description"
                  {...register("description")}
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
