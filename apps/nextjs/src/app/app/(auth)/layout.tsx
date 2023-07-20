import { type ReactNode } from "react";
import Link from "next/link";
import { Icons } from "@monitall/ui/icons";

export default function AuthNew(props: { children: ReactNode }) {
  return (
    <div className="relative grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60 md:hidden" />
        <Link
          href="/"
          className="absolute z-20 flex items-center p-4 text-lg font-bold tracking-tight"
        >
          <Icons.logo className="mr-2 h-6 w-6" />
        </Link>
      </div>

      <div className="container absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
        {props.children}
      </div>
    </div>
  );
}
