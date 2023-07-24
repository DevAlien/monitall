"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { DropdownMenuShortcut } from "@monitall/ui/dropdown-menu";

export function LogoutMenu() {
  return (
    <Link
      href="#"
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        signOut({
          callbackUrl: `${window.location.origin}/signin`,
        });
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </Link>
  );
}
