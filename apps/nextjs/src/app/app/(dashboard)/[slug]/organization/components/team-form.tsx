"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@monitall/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@monitall/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@monitall/ui/form";
import { Input } from "@monitall/ui/input";
import { Organization } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateTeamData } from "../actions";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  // avatarUrl: z.union([z.literal(""), z.string().trim().url()]),
});

const EditOrganizationDetails: FC<{ organization: Organization }> = ({
  organization,
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: organization.name },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await updateTeamData({
      organizationId: organization.id,
      name: data.name,
    });
    router.refresh();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="name"
          render={({ field }) => (
            <Card>
              <CardHeader className="pb-4">
                <FormLabel>Team Name</FormLabel>
                <FormDescription>
                  This is your organization&apos;s visible name within. For
                  example, the name of your company or department.
                </FormDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormItem className="grid gap-1">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </CardContent>
              <CardFooter className="justify-end space-x-2">
                <Button type="submit">Submit</Button>
              </CardFooter>
            </Card>
          )}
        />
      </form>
      {/* <FormField
        name="avatarUrl"
        render={({ field, fieldState }) => (
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-4">
              <div>
                <FormLabel className="text-lg font-semibold leading-none tracking-tight text-neutral-900">
                  Team Avatar
                </FormLabel>
                <FormDescription className="text-sm text-neutral-500">
                  This is your organization&apos;s avatar. We&apos;ll use your
                  organization&apos;s initial if left empty.
                </FormDescription>
              </div>
              {!fieldState.invalid && field.value && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="h-10 w-10 rounded-full"
                  src={field.value}
                  alt=""
                />
              )}
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormItem className="grid gap-1">
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button>Submit</Button>
            </CardFooter>
          </Card>
        )}
      /> */}
    </Form>
  );
};

export default EditOrganizationDetails;
