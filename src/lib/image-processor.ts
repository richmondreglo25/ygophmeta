/**
 * Image processing utilities
 * Handles image conversion, optimization, and storage
 */

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { IMAGE_CONFIG } from "./constants";

/**
 * Image processing options
 */
export interface ImageProcessOptions {
  quality?: number;
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

/**
 * Validates if a file is an allowed image type
 */
export function isValidImageType(file: File): boolean {
  return (IMAGE_CONFIG.FORMATS.ALLOWED as readonly string[]).includes(
    file.type,
  );
}

/**
 * Validates if a file size is within limits
 */
export function isValidFileSize(file: File): boolean {
  return file.size <= IMAGE_CONFIG.MAX_SIZE_BYTES;
}

/**
 * Validates an image file (type and size)
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!isValidImageType(file)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${IMAGE_CONFIG.FORMATS.ALLOWED.join(", ")}`,
    };
  }

  if (!isValidFileSize(file)) {
    return {
      valid: false,
      error: `File size exceeds ${IMAGE_CONFIG.MAX_SIZE_MB}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Converts and optimizes an image to WebP format
 */
export async function convertToWebP(
  file: File,
  options: ImageProcessOptions = {},
): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const {
    quality = IMAGE_CONFIG.QUALITY.HIGH,
    width,
    height,
    fit = "cover",
  } = options;

  let processor = sharp(buffer);

  // Resize if dimensions provided
  if (width || height) {
    processor = processor.resize(width, height, { fit });
  }

  // Convert to WebP
  const webpBuffer = await processor.webp({ quality }).toBuffer();

  return webpBuffer;
}

/**
 * Saves a buffer to a file, creating directories if needed
 */
export async function saveImage(
  buffer: Buffer,
  filepath: string,
): Promise<void> {
  const directory = path.dirname(filepath);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(filepath, buffer);
}

/**
 * Processes and saves an image file
 */
export async function processAndSaveImage(
  file: File,
  filepath: string,
  options?: ImageProcessOptions,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Convert to WebP
    const webpBuffer = await convertToWebP(file, options);

    // Save file
    await saveImage(webpBuffer, filepath);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Deletes an image file if it exists
 */
export async function deleteImage(filepath: string): Promise<void> {
  try {
    await fs.unlink(filepath);
  } catch (error) {
    // File doesn't exist or other error - ignore
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
