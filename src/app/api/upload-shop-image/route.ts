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
import { loadShops } from "@/lib/data-loader";
import { PATHS, API_ERRORS } from "@/lib/constants";
import { Shop } from "@/types/shop";

/**
 * POST handler for shop image upload
 * Uploads a logo image for a specific shop
 */
export async function POST(req: NextRequest) {
  try {
    // Parse multipart/form-data
    const formData = await req.formData();

    // Extract fields from form data
    const shopName = formData.get("shopName") as string;
    const image = formData.get("image") as File;

    // Validate required fields
    const validation = validateRequiredFields({ shopName, image }, [
      "shopName",
      "image",
    ]);

    if (!validation.valid) {
      return validationError(
        `${API_ERRORS.MISSING_FIELDS}: ${validation.missing?.join(", ")}`,
      );
    }

    // Load shops data
    const shops = (await loadShops()) as Shop[];

    // Find the shop by name
    const shop = shops.find((s) => s.name === shopName);
    if (!shop) {
      return notFoundError("Shop not found");
    }

    // Get the image path (should be like "/shops/xxxlogo.webp")
    const imagePath = shop.logo.startsWith("/")
      ? shop.logo.slice(1)
      : shop.logo;

    const filename = path.basename(imagePath);
    const filepath = path.join(PATHS.IMAGES.ROOT, imagePath);

    // Process and save image
    const result = await processAndSaveImage(image, filepath);

    if (!result.success) {
      return errorResponse(result.error || API_ERRORS.UPLOAD_FAILED);
    }

    // Respond with success and file info
    return successResponse({ filename, url: imagePath });
  } catch (error) {
    console.error("Shop image upload error:", error);
    return internalError(
      error instanceof Error ? error.message : API_ERRORS.INTERNAL_ERROR,
    );
  }
}
