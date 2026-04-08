# Event Edit Functionality

This document describes the edit functionality for events in the YGOPhMeta application.

## Files Created

### 1. Edit Event Form Component

**Location:** `/src/components/edit-event-form-drawer.tsx`

A drawer component that allows editing existing events with:

- All event fields (title, host, when, where, format, official status, rounds)
- Winners management (add, remove, edit)
- Decks management (add, remove, edit)
- Notes field
- Form validation
- Success/error handling
- Development-only mode enforcement

### 2. Edit Event API Route

**Location:** `/src/app/api/edit-event/route.ts`

API endpoint that handles event updates with:

- Event lookup across all monthly JSON files
- Date-based file switching (moves event to correct monthly file if date changes)
- Validation of required fields
- Duplicate ID checking
- Proper error handling

## How It Works

### Data Storage

Events are stored in monthly JSON files in `/public/data/events/` with the format `YYYY-MM.json` (e.g., `2025-12.json`). Each file contains an array of events for that month.

### Edit Flow

1. User opens the edit drawer with an existing event
2. Form is pre-populated with current event data
3. User makes changes
4. On submit:
   - Validates that editing is in development mode
   - Formats the date
   - Sends PUT request to `/api/edit-event`
   - API finds the event by ID across all monthly files
   - If date changed, moves event to appropriate monthly file
   - Updates the event data
   - Returns success/error response

### Month File Switching

When an event's date is changed:

- Event is removed from the original monthly file
- Event is added to the new monthly file
- Preserves all event data during the move

## Usage Example

### Option 1: Add to Individual Event Page

For the individual event page (`/src/app/events/[id]/page.tsx`), you would need to:

1. Convert the page to a client component or add a client component section
2. Import the edit drawer:

```tsx
import { EditEventFormDrawer } from "@/components/edit-event-form-drawer";
import { isDevelopment } from "@/utils/enviroment";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
```

3. Add state for the edit drawer:

```tsx
const [openEditEventDrawer, setOpenEditEventDrawer] = useState(false);
```

4. Add edit button (only in development):

```tsx
{
  isDevelopment() && (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setOpenEditEventDrawer(true)}
    >
      <Pencil className="w-3 h-3 mr-1" />
      Edit Event
    </Button>
  );
}
```

5. Add the drawer component:

```tsx
{
  openEditEventDrawer && (
    <EditEventFormDrawer
      event={event}
      onClose={() => setOpenEditEventDrawer(false)}
      onSuccess={() => {
        // Optionally refresh the page or refetch data
        window.location.reload();
      }}
    />
  );
}
```

### Option 2: Add to Events List Page with Event Drawer

If you want to add edit functionality to a drawer view (similar to shops):

1. Create or modify the EventDrawer component to accept an `onEdit` callback:

```tsx
interface EventDrawerProps {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Event;
  onEdit?: () => void; // Add this
}
```

2. Add an edit button inside the EventDrawer:

```tsx
{
  isDevelopment() && (
    <Button variant="outline" size="sm" onClick={onEdit}>
      <Pencil className="w-3 h-3 mr-1" />
      Edit
    </Button>
  );
}
```

3. In the events page (`/src/app/events/page.tsx`):

```tsx
import { EditEventFormDrawer } from "@/components/edit-event-form-drawer";
import { EventDrawer, useEventDrawer } from "@/components/event-drawer";

// Add state
const [selected, setSelected] = useState<Event | null>(null);
const { open, openDrawer, closeDrawer } = useEventDrawer();
const [openEditEventDrawer, setOpenEditEventDrawer] = useState(false);

// Modify onClick to use drawer instead of new tab
function onClick(row: Event) {
  setSelected(row);
  openDrawer();
}

// Add edit handlers
function handleOpenEditEventDrawer() {
  setOpenEditEventDrawer(true);
}

function handleCloseEditEventDrawer() {
  setOpenEditEventDrawer(false);
}

function handleEditSuccess() {
  setOpenEditEventDrawer(false);
  // Optionally refresh data
}

// Add drawer components after DataTable
<EventDrawer
  open={open}
  onOpenChange={(o) => (o ? openDrawer() : closeDrawer())}
  data={selected}
  onEdit={handleOpenEditEventDrawer}
/>;

{
  selected && openEditEventDrawer && (
    <EditEventFormDrawer
      event={selected}
      onClose={handleCloseEditEventDrawer}
      onSuccess={handleEditSuccess}
    />
  );
}
```

## Component API

### EditEventFormDrawer Props

```tsx
type Props = {
  event: Event; // The event to edit
  onClose: () => void; // Called when drawer is closed
  onSuccess?: () => void; // Optional callback on successful edit
};
```

### API Endpoint

**Endpoint:** `PUT /api/edit-event`

**Request Body:**

```json
{
  "originalEventId": "event-uuid",
  "originalWhen": "Dec 20 2025",
  "eventData": {
    "id": "event-uuid",
    "title": "Updated Title",
    "host": "Host Name",
    "when": "Dec 21 2025",
    "where": "Location",
    "format": "OCG",
    "official": true,
    "ordinalType": "SIMPLE",
    "rounds": 4,
    "winners": [...],
    "decks": [...],
    "notes": "Optional notes"
  }
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "event": { ...updated event data }
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error message"
}
```

## Important Notes

1. **Development Only:** Edit functionality only works when `isDevelopment()` returns true
2. **Date Format:** The API handles date formatting automatically - accepts both ISO dates and formatted dates
3. **Month File Management:** Events are automatically moved between monthly files when dates change
4. **Validation:** All required fields are validated on both client and server
5. **ID Preservation:** Event IDs should generally not be changed to maintain consistency
6. **Image Paths:** Deck image paths are preserved and should reference files in `/public/images/events/{eventId}/`

## Testing

1. Ensure you're in development mode (`npm run dev`)
2. Navigate to an event
3. Click the "Edit Event" button
4. Make changes to any field
5. Submit the form
6. Verify the changes in the JSON file
7. If you changed the date to a different month, verify the event moved to the correct monthly file

## Future Enhancements

Potential improvements:

- Image upload/management during edit
- Bulk edit for multiple events
- Event duplication feature
- Change history/audit log
- Undo functionality
