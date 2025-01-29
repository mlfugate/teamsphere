"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function UserRedirect() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && pathname === "/") {
      router.push("/dashboard");
    }
  }, [isSignedIn, pathname, router]);

  return null;
}
