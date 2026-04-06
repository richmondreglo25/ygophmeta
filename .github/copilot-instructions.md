---
description: Project-wide instructions for the YGOPhMeta application
applyTo: "**/*"
---

# YGOPhMeta Project Instructions

This is a Next.js application for tracking Yu-Gi-Oh! Philippines meta game data, including events, players, shops, and decklists.

## Project Structure

### Core Directories

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - React components (UI components in `/ui` subdirectory)
- `/src/lib` - Shared utilities and helper functions
- `/src/types` - TypeScript type definitions
- `/src/enums` - Enum definitions
- `/src/utils` - Utility functions
- `/src/columns` - Table column definitions
- `/public/data` - JSON data files
- `/public/images` - Static image assets

## Code Style Guidelines

### TypeScript

- Use strict TypeScript settings as defined in `tsconfig.json`
- Always define proper types for function parameters and return values
- Use enums for fixed sets of values
- Prefer interfaces for object shapes, types for unions/intersections
- Use `.ts` extension for pure TypeScript files (no JSX)
- Use `.tsx` extension only for files containing JSX

### React Components

- Use functional components with hooks
- Follow the existing component structure with proper prop typing
- Use the `cn()` utility from `@/lib/utils` for conditional class names
- Follow shadcn/ui patterns for UI components

### File Naming

- Use kebab-case for file names: `event-drawer.tsx`, `api-response.ts`
- Use PascalCase for component files when appropriate
- Match directory names to route segments in App Router

### Imports

- Use absolute imports with `@/` alias
- Group imports: React → Next.js → Third-party → Local
- Use named exports for utilities and types
- Use default exports for page components

## API Development

### API Routes (`/src/app/api`)

All API routes should follow these patterns:

1. **Use shared utilities**:
   - Import response helpers from `@/lib/api-response`
   - Use validation from `@/lib/validation`
   - Use image processing from `@/lib/image-processor`
   - Use data loading from `@/lib/data-loader`
   - Use constants from `@/lib/constants`

2. **Error Handling**:
   - Always wrap route handlers in try-catch
   - Use standardized error responses
   - Log errors with `console.error()`
   - Return appropriate HTTP status codes

3. **Validation**:
   - Validate all input data
   - Use `validateRequiredFields()` for form data
   - Return validation errors with clear messages

4. **Response Format**:

   ```typescript
   // Success
   return successResponse({ data }, "Optional message");

   // Error
   return errorResponse("Error message", HTTP_STATUS.BAD_REQUEST);
   ```

### Example API Route Structure

```typescript
import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  validationError,
  internalError,
} from "@/lib/api-response";
import { validateRequiredFields } from "@/lib/validation";
import { API_ERRORS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const field = formData.get("field") as string;

    const validation = validateRequiredFields({ field }, ["field"]);
    if (!validation.valid) {
      return validationError(
        `${API_ERRORS.MISSING_FIELDS}: ${validation.missing?.join(", ")}`,
      );
    }

    // Process request...

    return successResponse({ result });
  } catch (error) {
    console.error("Error:", error);
    return internalError(
      error instanceof Error ? error.message : API_ERRORS.INTERNAL_ERROR,
    );
  }
}
```

## Component Styling

### Card Components

Always use consistent card styling:

```tsx
<Card className="shadow-sm rounded-sm border hover:shadow-md transition-shadow duration-200">
  <CardContent className="p-4">{/* Content */}</CardContent>
</Card>
```

### Avatar Images

Use this pattern to prevent image stretching:

```tsx
<Avatar className="h-12 w-12 flex justify-center items-center">
  {hasImage && (
    <AvatarImage
      src={imagePath}
      alt={name}
      loading="lazy"
      className="object-cover rounded-full h-12 w-12"
    />
  )}
  <AvatarFallback className="flex justify-center items-center">
    <span className="text-sm">{name.charAt(0)}</span>
  </AvatarFallback>
</Avatar>
```

### Mobile Responsiveness

- Use Tailwind's responsive prefixes: `md:`, `lg:`, etc.
- For scrollable content on mobile:
  ```tsx
  <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
  ```

## Data Management

### JSON Data Files

- Located in `/public/data/`
- Use type-safe loading with `@/lib/data-loader`
- Always validate data structure after loading

### Image Processing

- All images should be converted to WebP format
- Use `@/lib/image-processor` utilities
- Validate file types and sizes before processing
- Store in appropriate `/public/images/` subdirectory

### Types

- Define types in `/src/types/` matching data structure
- Export types for reuse across components and API routes
- Keep types in sync with JSON schemas

## Important Notes

### DO NOT Modify

- Files in `/src/components/ui/` - These are from shadcn/ui
- Apply styling through className props only

### Image Paths

- All image paths in data files should be relative to `/public/images/`
- Format: `/images/category/filename.webp`
- Examples: `/images/people/player.webp`, `/images/events/uuid/deck.webp`

### Static Export

- This project uses `output: "export"` for static deployment
- API routes work during build but are for development/data management
- Images are unoptimized for static hosting

## Common Patterns

### Loading Data in Components

```typescript
import { loadPlayers } from "@/lib/data-loader";

const players = await loadPlayers();
```

### Image Upload

```typescript
import { processAndSaveImage } from "@/lib/image-processor";

const result = await processAndSaveImage(file, filepath, {
  quality: 90,
  width: 800,
});
```

### Validation

```typescript
import { validateRequiredFields, isValidUUID } from "@/lib/validation";

const validation = validateRequiredFields(data, ["field1", "field2"]);
if (!validation.valid) {
  // Handle error
}
```

## Development Workflow

1. Run `npm run dev` for development server
2. Use `npm run build` to test static export
3. Use `npm run lint` to check code style
4. Test thoroughly before deploying

## Deployment

- Project deploys as static site to GitHub Pages
- Run `npm run deploy` to build and deploy
- Ensure `.nojekyll` file is present in output

## Best Practices

1. **DRY (Don't Repeat Yourself)**: Use shared utilities instead of duplicating code
2. **Type Safety**: Always define proper TypeScript types
3. **Error Handling**: Handle errors gracefully with user-friendly messages
4. **Validation**: Validate all user inputs
5. **Performance**: Lazy load images, use pagination for large lists
6. **Accessibility**: Include alt text, proper ARIA labels
7. **Consistency**: Follow established patterns and naming conventions
8. **Documentation**: Add JSDoc comments for complex functions
9. **Testing**: Test components and API routes thoroughly
10. **Code Quality**: Keep functions small and focused

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
