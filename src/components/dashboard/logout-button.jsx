"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Logout
    </Button>
  );
}
