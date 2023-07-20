"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@monitall/ui/button";
import { ButtonGroup, ButtonGroupButton } from "@monitall/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@monitall/ui/card";
import { Icons } from "@monitall/ui/icons";
import { Input } from "@monitall/ui/input";
import { Label } from "@monitall/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@monitall/ui/select";
import { toast } from "@monitall/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";

const organizationPatchSchema = z.object({
  name: z.string().min(3).max(128),
});

type FormData = z.infer<typeof organizationPatchSchema>;
export function CreateOrganization() {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(organizationPatchSchema),
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router = useRouter();

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

    const body = await response.json();
    router.push(`/${body.slug}`);

    return;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Create an organization</CardTitle>
          <CardDescription>
            An organization is a container for all your changelogs.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <ButtonGroup>
              <ButtonGroupButton variant="outline">
                <Icons.check />
              </ButtonGroupButton>
              <ButtonGroupButton variant="outline">
                <Icons.add />
              </ButtonGroupButton>
            </ButtonGroup>
            <Label htmlFor="subject">Name</Label>
            <Input id="name" placeholder="Acme" {...register("name")} />
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <div></div>
          <Button type="submit">
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
