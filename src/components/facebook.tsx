"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Heart } from "lucide-react";
import Link from "next/link";

export function Facebook() {
  return (
    <Alert variant="info">
      <AlertTitle className="font-semibold flex items-center gap-2">
        <Heart size={14} className="text-red-500" />
        <span className="font-semibold text-base">Follow us on Facebook!</span>
      </AlertTitle>
      <AlertDescription className="text-sm">
        <Link
          href="https://www.facebook.com/profile.php?id=61585498412179"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 underline text-sm hover:text-blue-900 font-medium"
        >
          facebook.com/ygophmeta
        </Link>
      </AlertDescription>
    </Alert>
  );
}
