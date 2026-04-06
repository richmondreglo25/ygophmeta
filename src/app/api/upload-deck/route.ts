import { NextRequest } from "next/server";
import path from "path";
import {
  errorResponse,
  successResponse,
  validationError,
  internalError,
} from "@/lib/api-response";
import { processAndSaveImage } from "@/lib/image-processor";
import { validateRequiredFields, isValidUUID } from "@/lib/validation";
import { PATHS, API_ERRORS } from "@/lib/constants";

/**
 * POST handler for deck image upload
 * Uploads a deck image for a specific event and winner position
 */
export async function POST(req: NextRequest) {
  try {
    // Parse multipart/form-data
    const formData = await req.formData();

    // Extract fields from form data
    const eventId = formData.get("eventId") as string;
    const winnerPosition = formData.get("winnerPosition") as string;
    const deckImage = formData.get("deckImage") as File;

    // Validate required fields
    const validation = validateRequiredFields(
      { eventId, winnerPosition, deckImage },
      ["eventId", "winnerPosition", "deckImage"],
    );

    if (!validation.valid) {
      return validationError(
        `${API_ERRORS.MISSING_FIELDS}: ${validation.missing?.join(", ")}`,
      );
    }

    // Validate event ID format
    if (!isValidUUID(eventId)) {
      return validationError("Invalid event ID format");
    }

    // Build upload directory and file path
    const uploadDir = path.join(PATHS.IMAGES.EVENTS, eventId);
    const filename = `${winnerPosition}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Process and save image
    const result = await processAndSaveImage(deckImage, filepath);

    if (!result.success) {
      return errorResponse(result.error || API_ERRORS.UPLOAD_FAILED);
    }

    // Respond with success and file info
    return successResponse({
      filename,
      url: `/images/events/${eventId}/${filename}`,
    });
  } catch (error) {
    console.error("Deck upload error:", error);
    return internalError(
      error instanceof Error ? error.message : API_ERRORS.INTERNAL_ERROR,
    );
  }
}
