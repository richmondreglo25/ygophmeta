import { NextRequest } from "next/server";
import {
  errorResponse,
  successResponse,
  validationError,
  notFoundError,
  internalError,
} from "@/lib/api-response";
import { validateRequiredFields } from "@/lib/validation";
import { loadJsonData, saveJsonData, fileExists } from "@/lib/data-loader";
import { API_ERRORS } from "@/lib/constants";
import { Event } from "@/types/event";
import path from "path";
import fs from "fs/promises";

/**
 * Extract year and month from a date string
 * Handles formats like "Dec 20 2025" or "2025-12-20"
 */
function extractYearMonth(dateStr: string): { year: number; month: number } {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // JavaScript months are 0-indexed
  };
}

/**
 * Get the file path for a given year and month
 */
function getMonthFilePath(year: number, month: number): string {
  const monthStr = month.toString().padStart(2, "0");
  return path.join(
    process.cwd(),
    "public",
    "data",
    "events",
    `${year}-${monthStr}.json`,
  );
}

/**
 * Find an event by ID across all monthly event files
 */
async function findEventById(
  eventId: string,
): Promise<{ events: Event[]; filePath: string } | null> {
  const eventsDir = path.join(process.cwd(), "public", "data", "events");

  try {
    const files = await fs.readdir(eventsDir);
    const monthlyFiles = files.filter((f) => f.match(/^\d{4}-\d{2}\.json$/));

    for (const file of monthlyFiles) {
      const filePath = path.join(eventsDir, file);
      const events = (await loadJsonData(filePath)) as Event[];
      const eventExists = events.some((e) => e.id === eventId);

      if (eventExists) {
        return { events, filePath };
      }
    }

    return null;
  } catch (error) {
    console.error("Error searching for event:", error);
    return null;
  }
}

/**
 * PUT handler for editing event data
 * Updates an existing event in the appropriate monthly JSON file
 * If the event date changes, moves it to the correct monthly file
 */
export async function PUT(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { originalEventId, originalWhen, eventData } = body as {
      originalEventId: string;
      originalWhen: string;
      eventData: Event;
    };

    console.log(body);

    // Validate required fields
    const validation = validateRequiredFields({ originalEventId }, [
      "originalEventId",
    ]);

    if (!validation.valid) {
      return validationError(
        `${API_ERRORS.MISSING_FIELDS}: ${validation.missing?.join(", ")}`,
      );
    }

    // Validate event data structure
    const eventValidation = validateRequiredFields(eventData, [
      "id",
      "title",
      "host",
      "when",
      "where",
      "format",
    ]);

    if (!eventValidation.valid) {
      return validationError(
        `Invalid event data: ${eventValidation.missing?.join(", ")}`,
      );
    }

    // Find the original event file
    const originalEventData = await findEventById(originalEventId);

    if (!originalEventData) {
      return notFoundError("Event not found");
    }

    const { events: originalEvents, filePath: originalFilePath } =
      originalEventData;

    // Find the event index
    const eventIndex = originalEvents.findIndex(
      (e) => e.id === originalEventId,
    );

    if (eventIndex === -1) {
      return notFoundError("Event not found in file");
    }

    // Extract year and month from both original and new dates
    const originalYearMonth = extractYearMonth(originalWhen);
    const newYearMonth = extractYearMonth(eventData.when);

    // Check if the event needs to be moved to a different monthly file
    const needsFileSwitch =
      originalYearMonth.year !== newYearMonth.year ||
      originalYearMonth.month !== newYearMonth.month;

    if (needsFileSwitch) {
      // Remove event from original file
      const updatedOriginalEvents = originalEvents.filter(
        (e) => e.id !== originalEventId,
      );
      await saveJsonData(originalFilePath, updatedOriginalEvents);

      // Add event to new file
      const newFilePath = getMonthFilePath(
        newYearMonth.year,
        newYearMonth.month,
      );

      let newFileEvents: Event[] = [];
      if (await fileExists(newFilePath)) {
        newFileEvents = (await loadJsonData(newFilePath)) as Event[];
      }

      // Check for duplicate ID in new file
      if (
        eventData.id !== originalEventId &&
        newFileEvents.some((e) => e.id === eventData.id)
      ) {
        return errorResponse(
          "Event with this ID already exists in target file",
        );
      }

      newFileEvents.push(eventData);
      await saveJsonData(newFilePath, newFileEvents);
    } else {
      // Update in the same file
      // If ID is being changed, check for duplicates
      if (
        eventData.id !== originalEventId &&
        originalEvents.some((e) => e.id === eventData.id)
      ) {
        return errorResponse("Event with this ID already exists");
      }

      originalEvents[eventIndex] = eventData;
      await saveJsonData(originalFilePath, originalEvents);
    }

    // Respond with success
    return successResponse({ event: eventData }, "Event updated successfully");
  } catch (error) {
    console.error("Event edit error:", error);
    return internalError(
      error instanceof Error ? error.message : API_ERRORS.INTERNAL_ERROR,
    );
  }
}
