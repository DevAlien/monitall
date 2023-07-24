"use client";

import { type FC } from "react";
import { type Member } from "types";

import { Avatar, AvatarFallback, AvatarImage } from "@monitall/ui/avatar";
import { Button } from "@monitall/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@monitall/ui/card";
import { Input } from "@monitall/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@monitall/ui/select";
import { Separator } from "@monitall/ui/separator";

export const Members: FC<{ members: Member[] }> = ({ members }) => {
  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>Invite members</CardTitle>
        <CardDescription>
          You can invite new members sharing the following link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input value="http://example.com/invite/989nidu8d" readOnly />
          <Button variant="secondary" className="shrink-0">
            Copy Link
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Members</h4>
          <div className="grid gap-6">
            {members.map((member, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.user.image as string} />
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {member.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <Select defaultValue={member.role}>
                    <SelectTrigger className="ml-auto w-[110px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">Owner</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
