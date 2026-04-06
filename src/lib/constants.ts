/**
 * Application constants
 * Centralized configuration values used throughout the application
 */

import path from "path";

/**
 * File system paths
 */
export const PATHS = {
  DATA: {
    ROOT: path.join(process.cwd(), "public", "data"),
    PLAYERS: path.join(process.cwd(), "public", "data", "players.json"),
    SHOPS: path.join(process.cwd(), "public", "data", "shops.json"),
    EVENTS: path.join(process.cwd(), "public", "data", "events.json"),
    DECKS: path.join(process.cwd(), "public", "data", "decks.json"),
    BANLIST: path.join(process.cwd(), "public", "data", "banlist.json"),
  },
  IMAGES: {
    ROOT: path.join(process.cwd(), "public", "images"),
    PEOPLE: path.join(process.cwd(), "public", "images", "people"),
    SHOPS: path.join(process.cwd(), "public", "images", "shops"),
    EVENTS: path.join(process.cwd(), "public", "images", "events"),
  },
  PUBLIC: {
    ROOT: path.join(process.cwd(), "public"),
  },
} as const;

/**
 * API error messages
 */
export const API_ERRORS = {
  MISSING_FIELDS: "Missing required fields",
  INVALID_FILE_TYPE: "Invalid file type",
  FILE_TOO_LARGE: "File size exceeds maximum limit",
  NOT_FOUND: "Resource not found",
  UPLOAD_FAILED: "Failed to upload file",
  PROCESSING_FAILED: "Failed to process image",
  INVALID_REQUEST: "Invalid request",
  INTERNAL_ERROR: "Internal server error",
} as const;

/**
 * API success messages
 */
export const API_SUCCESS = {
  UPLOAD_COMPLETE: "File uploaded successfully",
  UPDATE_COMPLETE: "Resource updated successfully",
  DELETE_COMPLETE: "Resource deleted successfully",
} as const;

/**
 * Image processing configuration
 */
export const IMAGE_CONFIG = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  FORMATS: {
    ALLOWED: ["image/jpeg", "image/png", "image/webp", "image/gif"] as const,
    OUTPUT: "webp",
  },
  QUALITY: {
    HIGH: 90,
    MEDIUM: 80,
    LOW: 60,
  },
} as const;

// Type helpers for IMAGE_CONFIG
export type AllowedImageFormat = (typeof IMAGE_CONFIG.FORMATS.ALLOWED)[number];

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;
