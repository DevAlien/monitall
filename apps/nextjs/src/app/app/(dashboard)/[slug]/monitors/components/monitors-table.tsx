"use server";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@monitall/ui/table";
import { Monitor } from "@prisma/client";
import TimeAgo from "javascript-time-ago";
// English.
import en from "javascript-time-ago/locale/en";

import { useOrganizationSlug } from "~/hooks/useOrganizationSlug";
import { MonitorCard } from "./monitor-card";

export async function MonitorsTable(props: { monitors: Monitor[] }) {
  // const router = useRouter();
  // const origanizationSlug = useOrganizationSlug();

  // TimeAgo.addDefaultLocale(en);

  // const timeAgo = new TimeAgo("en-US");
  // const customStyle = {
  //   steps: [
  //     {
  //       formatAs: "second",
  //     },
  //     {
  //       formatAs: "minute",
  //     },
  //     {
  //       formatAs: "hour",
  //     },
  //   ],
  // };

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {props.monitors.map((monitor) => (
        <MonitorCard
          key={monitor.id}
          monitor={monitor}
          // link={() =>
          //   router.push(`/${origanizationSlug}/monitors/${monitor.id}`)
          // }
        />
      ))}
    </div>
  );
  return (
    <Table>
      <TableCaption>A list of your monitors.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead className="text-right">Updated at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.monitors.map((monitor) => (
          <TableRow
            className="cursor-pointer"
            key={monitor.id}
            onClick={() =>
              router.push(`/${origanizationSlug}/monitors/${monitor.id}`)
            }
          >
            <TableCell>{monitor.name}</TableCell>
            <TableCell className="w-[100px]">{monitor.status}</TableCell>
            <TableCell className="text-right">
              {timeAgo.format(monitor.updatedAt, customStyle)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
