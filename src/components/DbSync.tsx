"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { syncWithServer } from "@/lib/store";

export default function DbSync() {
  const path = usePathname();
  useEffect(() => {
    if (path.startsWith("/verify")) return;
    syncWithServer().then((changed) => {
      if (changed) window.location.reload();
    });
  }, [path]);
  return null;
}
