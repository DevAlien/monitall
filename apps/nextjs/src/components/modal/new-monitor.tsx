"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { Button } from "@monitall/ui/button";
import { DialogFooter } from "@monitall/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@monitall/ui/form";
import { Icons } from "@monitall/ui/icons";
import { Input } from "@monitall/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@monitall/ui/select";
import { toast } from "@monitall/ui/use-toast";

import { RegionSelect, type Region } from "~/components/form/region-select";
import { useOrganizationSlug } from "~/hooks/useOrganizationSlug";
import { monitorCreateSchema } from "~/lib/schemas";

type FormData = z.infer<typeof monitorCreateSchema>;

export function ModalNewMonitor() {
  const router = useRouter();
  const slug = useOrganizationSlug();
  const form = useForm<FormData>({
    resolver: zodResolver(monitorCreateSchema),
    defaultValues: {
      status: "ACTIVE",
    },
  });
  //   const { control, handleSubmit } = form;
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const [_, setShowNewOrganizationDialog] = React.useState(false);

  async function onSubmit(data: FormData) {
    setIsSaving(true);
    const response = await fetch(`/api/v0/${slug}/monitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

    const body = (await response.json()) as { id: number };
    router.push(`/${slug}/monitors/${body?.id.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* <DialogHeader>
        <DialogTitle>Create organization</DialogTitle>
        <DialogDescription>
          An organization is a container for all your changelogs.
        </DialogDescription>
      </DialogHeader> */}
        <div>
          <div className="space-y-4 py-2 pb-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Home" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of your status mo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="https://acme.dev/ping" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the address that you want to monitor.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an interval for the monitor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="120">120 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                      <SelectItem value="30" disabled>
                        30 seconds{" "}
                        <span className="text-sm text-muted-foreground">
                          (Pro plan)
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How often we will perform the check
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frameworks</FormLabel>
                  <FormControl>
                    <RegionSelect
                      value={field.value as unknown as Region[]}
                      onChange={(values) => {
                        field.onChange(values.map(({ value }) => value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>All the regions you like.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
    </Form>
  );
}
