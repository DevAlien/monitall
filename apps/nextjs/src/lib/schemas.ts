import { MonitorStatus } from "@prisma/client";
import { z } from "zod";

export const monitorCreateSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  address: z.string().url({ message: "Invalid url" }),
  interval: z.number(),
  regions: z.array(z.string()),
  status: z.nativeEnum(MonitorStatus),
});

export const rpcSchema = z.object({
  method: z.string(),
  data: z.any(),
});

export const rpcSchemaMonitorStatus = z.object({
  monitorId: z.number(),
  status: z.nativeEnum(MonitorStatus),
});
