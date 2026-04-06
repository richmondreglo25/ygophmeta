import { NextRequest } from "next/server";
import {
  errorResponse,
  successResponse,
  validationError,
  notFoundError,
  internalError,
} from "@/lib/api-response";
import { validateRequiredFields } from "@/lib/validation";
import { loadShops, saveJsonData } from "@/lib/data-loader";
import { PATHS, API_ERRORS } from "@/lib/constants";
import { Shop } from "@/types/shop";

/**
 * PUT handler for editing shop data
 * Updates an existing shop in the shops.json file
 */
export async function PUT(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { originalName, shopData } = body as {
      originalName: string;
      shopData: Shop;
    };

    // Validate required fields
    const validation = validateRequiredFields({ originalName }, [
      "originalName",
    ]);

    if (!validation.valid) {
      return validationError(
        `${API_ERRORS.MISSING_FIELDS}: ${validation.missing?.join(", ")}`,
      );
    }

    // Validate shop data structure
    const shopValidation = validateRequiredFields(shopData, [
      "name",
      "address",
      "openHours",
    ]);

    if (!shopValidation.valid) {
      return validationError(
        `Invalid shop data: ${shopValidation.missing?.join(", ")}`,
      );
    }

    // Load existing shops data
    const shops = (await loadShops()) as Shop[];

    // Find shop by original name
    const shopIndex = shops.findIndex((s) => s.name === originalName);

    if (shopIndex === -1) {
      return notFoundError("Shop not found");
    }

    // If name is being changed, check for duplicates
    if (shopData.name !== originalName) {
      const duplicateExists = shops.some((s) => s.name === shopData.name);
      if (duplicateExists) {
        return errorResponse("Shop with this name already exists");
      }
    }

    // Update the shop
    shops[shopIndex] = {
      ...shops[shopIndex],
      ...shopData,
    };

    // Save updated data
    await saveJsonData(PATHS.DATA.SHOPS, shops);

    // Respond with success
    return successResponse(
      { shop: shops[shopIndex] },
      "Shop updated successfully",
    );
  } catch (error) {
    console.error("Shop edit error:", error);
    return internalError(
      error instanceof Error ? error.message : API_ERRORS.INTERNAL_ERROR,
    );
  }
}
