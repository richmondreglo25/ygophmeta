import { NextRequest } from "next/server";
import path from "path";
import {
  errorResponse,
  successResponse,
  validationError,
  notFoundError,
  internalError,
} from "@/lib/api-response";
import { processAndSaveImage } from "@/lib/image-processor";
import { validateRequiredFields } from "@/lib/validation";
import { loadPlayers } from "@/lib/data-loader";
import { PATHS, API_ERRORS } from "@/lib/constants";
import { Player } from "@/types/player";

/**
 * POST handler for profile image upload
 * Uploads a profile image for a specific player
 */
export async function POST(req: NextRequest) {
  try {
    // Parse multipart/form-data
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const file = formData.get("image") as File;

    // Validate required fields
    const validation = validateRequiredFields({ name, file }, ["name", "file"]);

    if (!validation.valid) {
      return validationError(
        `${API_ERRORS.MISSING_FIELDS}: ${validation.missing?.join(", ")}`,
      );
    }

    // Load players data
    const players = (await loadPlayers()) as Player[];

    // Find player by name (case-insensitive)
    const player = players.find(
      (p: Player) => p.name && p.name.toLowerCase() === name.toLowerCase(),
    );

    // Validate player and imagePath
    if (!player || !player.imagePath) {
      return notFoundError("Player or imagePath not found");
    }

    // Get the image path (should be like "/people/xxx.webp")
    const imagePath = player.imagePath.startsWith("/")
      ? player.imagePath.slice(1)
      : player.imagePath;

    const filename = path.basename(imagePath);
    const filepath = path.join(PATHS.IMAGES.ROOT, imagePath);

    // Process and save image
    const result = await processAndSaveImage(file, filepath);

    if (!result.success) {
      return errorResponse(result.error || API_ERRORS.UPLOAD_FAILED);
    }

    // Respond with success and file info
    return successResponse({ filename, url: imagePath });
  } catch (error) {
    console.error("Profile image upload error:", error);
    return internalError(
      error instanceof Error ? error.message : API_ERRORS.INTERNAL_ERROR,
    );
  }
}
