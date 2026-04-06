import { NextRequest } from "next/server";
import {
  errorResponse,
  successResponse,
  validationError,
  notFoundError,
  internalError,
} from "@/lib/api-response";
import { validateRequiredFields } from "@/lib/validation";
import { loadJsonData, saveJsonData } from "@/lib/data-loader";
import { PATHS, API_ERRORS } from "@/lib/constants";
import { Player } from "@/types/player";
import { Judge } from "@/types/judge";
import path from "path";

/**
 * PUT handler for editing profile data (Player or Judge)
 * Updates an existing profile in the respective JSON file
 */
export async function PUT(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { originalName, profileData, profileType } = body as {
      originalName: string;
      profileData: Player | Judge;
      profileType: "Player" | "Judge";
    };

    // Validate required fields
    const validation = validateRequiredFields({ originalName, profileType }, [
      "originalName",
      "profileType",
    ]);

    if (!validation.valid) {
      return validationError(
        `${API_ERRORS.MISSING_FIELDS}: ${validation.missing?.join(", ")}`,
      );
    }

    // Validate profile data structure
    const profileValidation = validateRequiredFields(profileData, [
      "name",
      "ign",
      "city",
    ]);

    if (!profileValidation.valid) {
      return validationError(
        `Invalid profile data: ${profileValidation.missing?.join(", ")}`,
      );
    }

    // Determine the correct file path based on profile type
    const dataPath =
      profileType === "Player"
        ? PATHS.DATA.PLAYERS
        : path.join(process.cwd(), "public", "data", "judges.json");

    // Load existing profiles data
    const profiles = (await loadJsonData(dataPath)) as (Player | Judge)[];

    // Find profile by original name
    const profileIndex = profiles.findIndex((p) => p.name === originalName);

    if (profileIndex === -1) {
      return notFoundError(`${profileType} not found`);
    }

    // If name is being changed, check for duplicates
    if (profileData.name !== originalName) {
      const duplicateExists = profiles.some((p) => p.name === profileData.name);
      if (duplicateExists) {
        return errorResponse(`${profileType} with this name already exists`);
      }
    }

    // Update the profile
    profiles[profileIndex] = {
      ...profiles[profileIndex],
      ...profileData,
    };

    // Save updated data
    await saveJsonData(dataPath, profiles);

    // Respond with success
    return successResponse(
      { profile: profiles[profileIndex] },
      `${profileType} updated successfully`,
    );
  } catch (error) {
    console.error("Profile edit error:", error);
    return internalError(
      error instanceof Error ? error.message : API_ERRORS.INTERNAL_ERROR,
    );
  }
}
