"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh] w-full">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" />
    </div>
  );
}
