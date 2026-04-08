"use client";

import { CheckCircle2, XCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type AlertModalVariant = "success" | "error";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  variant: AlertModalVariant;
  title: string;
  description?: string;
}

export function AlertModal({
  open,
  onClose,
  variant,
  title,
  description,
}: AlertModalProps) {
  if (!open) return null;

  const variantStyles = {
    success: {
      icon: CheckCircle2,
      iconColor: "text-green-600",
    },
    error: {
      icon: XCircle,
      iconColor: "text-red-600",
    },
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop - blocks clicks outside modal */}
      <div className="absolute inset-0 bg-black/20 pointer-events-auto" />

      {/* Modal */}
      <div className="relative z-[101] max-w-sm w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-auto">
        {/* Header with close button */}
        <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Icon className={cn("h-5 w-5", style.iconColor)} />
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {description && (
          <div className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        )}

        {/* Footer with OK button */}
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={onClose}
            variant="submit"
            className="rounded-sm px-5"
            size="sm"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
