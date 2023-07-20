"use client";

import Link from "next/link";
import { DropdownMenuShortcut } from "@monitall/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutMenu() {
  return (
    <Link
      href="#"
      onClick={() => {
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
