# Library Utilities Documentation

This directory contains shared utility functions used throughout the YGOPhMeta application.

## Files Overview

### `constants.ts`

Centralized configuration and constant values.

**Exports:**

- `PATHS` - File system paths for data and images
- `API_ERRORS` - Standardized error messages
- `API_SUCCESS` - Success messages
- `IMAGE_CONFIG` - Image processing configuration
- `HTTP_STATUS` - HTTP status codes
- `AllowedImageFormat` - Type helper for image formats

**Usage:**

```typescript
import { PATHS, API_ERRORS, HTTP_STATUS } from "@/lib/constants";

const playersPath = PATHS.DATA.PLAYERS;
return errorResponse(API_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
```

---

### `api-response.ts`

Standardized API response formatting for Next.js API routes.

**Exports:**

- `ApiResponse<T>` - Interface for API responses
- `successResponse<T>()` - Create success response
- `errorResponse()` - Create error response
- `validationError()` - Create validation error (400)
- `notFoundError()` - Create not found error (404)
- `internalError()` - Create internal server error (500)

**Usage:**

```typescript
import { successResponse, validationError } from "@/lib/api-response";

// Success
return successResponse({ user }, "User created successfully");

// Error
return validationError("Email is required");
```

---

### `validation.ts`

Data validation utilities for form data and user input.

**Exports:**

- `isNonEmptyString(value)` - Check if value is non-empty string
- `isValidFile(value)` - Check if value is valid File object
- `validateRequiredFields(fields, required)` - Validate multiple fields
- `isValidUUID(value)` - Validate UUID format
- `sanitizeFilename(filename)` - Make filename filesystem-safe
- `isValidEmail(email)` - Validate email format
- `isValidUrl(url)` - Validate URL format

**Usage:**

```typescript
import { validateRequiredFields, isValidUUID } from "@/lib/validation";

const validation = validateRequiredFields({ name, email, file }, [
  "name",
  "email",
  "file",
]);

if (!validation.valid) {
  return validationError(`Missing: ${validation.missing?.join(", ")}`);
}

if (!isValidUUID(eventId)) {
  return validationError("Invalid event ID");
}
```

---

### `image-processor.ts`

Image processing, conversion, and storage utilities.

**Exports:**

- `ImageProcessOptions` - Interface for processing options
- `isValidImageType(file)` - Check if file type is allowed
- `isValidFileSize(file)` - Check if file size is within limits
- `validateImageFile(file)` - Validate file type and size
- `convertToWebP(file, options)` - Convert image to WebP format
- `saveImage(buffer, filepath)` - Save buffer to file
- `processAndSaveImage(file, filepath, options)` - Complete processing pipeline
- `deleteImage(filepath)` - Safely delete image file

**Usage:**

```typescript
import { processAndSaveImage } from "@/lib/image-processor";

const result = await processAndSaveImage(file, filepath, {
  quality: 90,
  width: 800,
  height: 600,
  fit: "cover",
});

if (!result.success) {
  return errorResponse(result.error);
}
```

---

### `data-loader.ts`

JSON data file management with type safety.

**Exports:**

- `loadJsonData<T>(filepath)` - Generic JSON loader
- `saveJsonData<T>(filepath, data)` - Generic JSON saver
- `loadPlayers()` - Load players.json
- `loadShops()` - Load shops.json
- `loadEvents()` - Load events.json
- `loadDecks()` - Load decks.json
- `loadBanlist()` - Load banlist.json
- `fileExists(filepath)` - Check if file exists

**Usage:**

```typescript
import { loadPlayers, saveJsonData } from "@/lib/data-loader";

// Load data
const players = await loadPlayers();

// Save data
await saveJsonData(PATHS.DATA.PLAYERS, updatedPlayers);
```

---

### `utils.ts`

General utility functions (existing file).

**Exports:**

- `cn(...inputs)` - Merge Tailwind classes with clsx and tailwind-merge

**Usage:**

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class")} />
```

---

## Best Practices

### 1. Import Organization

Group imports by source:

```typescript
// Standard library
import path from "path";
import fs from "fs/promises";

// Next.js
import { NextRequest } from "next/server";

// Local utilities
import { successResponse, errorResponse } from "@/lib/api-response";
import { validateRequiredFields } from "@/lib/validation";
import { processAndSaveImage } from "@/lib/image-processor";
```

### 2. Error Handling Pattern

Always use try-catch in API routes:

```typescript
export async function POST(req: NextRequest) {
  try {
    // Validate
    const validation = validateRequiredFields(data, required);
    if (!validation.valid) {
      return validationError("...");
    }

    // Process
    const result = await processAndSaveImage(...);
    if (!result.success) {
      return errorResponse(result.error);
    }

    // Success
    return successResponse(data);
  } catch (error) {
    console.error("Error:", error);
    return internalError(
      error instanceof Error ? error.message : API_ERRORS.INTERNAL_ERROR
    );
  }
}
```

### 3. Type Safety

Always provide type parameters:

```typescript
// Good
const players = await loadJsonData<Player[]>(PATHS.DATA.PLAYERS);

// Better - use helper functions
const players = await loadPlayers(); // Already typed
```

### 4. Constants Usage

Use constants instead of string literals:

```typescript
// Bad
return NextResponse.json({ error: "Not found" }, { status: 404 });

// Good
return notFoundError(API_ERRORS.NOT_FOUND);
```

### 5. Image Processing

Always validate before processing:

```typescript
const validation = validateImageFile(file);
if (!validation.valid) {
  return errorResponse(validation.error);
}

const result = await processAndSaveImage(file, filepath);
```

## Testing Utilities

When writing tests for these utilities:

```typescript
// Example test structure
describe("validateRequiredFields", () => {
  it("should return valid: true when all fields present", () => {
    const result = validateRequiredFields(
      { name: "John", email: "john@example.com" },
      ["name", "email"],
    );
    expect(result.valid).toBe(true);
  });

  it("should return missing fields", () => {
    const result = validateRequiredFields({ name: "John" }, ["name", "email"]);
    expect(result.valid).toBe(false);
    expect(result.missing).toEqual(["email"]);
  });
});
```

## Extending Utilities

### Adding New Validation Functions

```typescript
// Add to validation.ts
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}
```

### Adding New Data Loaders

```typescript
// Add to data-loader.ts
export async function loadJudges() {
  return loadJsonData(PATHS.DATA.JUDGES);
}
```

### Adding New API Response Types

```typescript
// Add to api-response.ts
export function conflictError(
  message: string = "Resource already exists",
): NextResponse<ApiResponse> {
  return errorResponse(message, HTTP_STATUS.CONFLICT);
}
```

## Related Documentation

- [Project Structure](../.github/copilot-instructions.md)
- [API Development Guidelines](../.github/copilot-instructions.md#api-development)
- [Refactoring Summary](../REFACTORING_SUMMARY.md)
