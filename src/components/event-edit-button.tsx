"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditEventFormDrawer } from "@/components/edit-event-form-drawer";
import { Event } from "@/types/event";
import { isDevelopment } from "@/utils/enviroment";

type Props = {
  event: Event;
};

export function EventEditButton({ event }: Props) {
  const [openEditDrawer, setOpenEditDrawer] = useState(false);

  if (!isDevelopment()) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="submit"
          size="sm"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setOpenEditDrawer(true)}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Event
        </Button>
      </div>

      {openEditDrawer && (
        <EditEventFormDrawer
          event={event}
          onClose={() => setOpenEditDrawer(false)}
          onSuccess={() => {
            setOpenEditDrawer(false);
            // Refresh the page to show updated data
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
