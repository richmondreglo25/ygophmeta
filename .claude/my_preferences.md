# My Preferences for YGOPhMeta Project

## Card Component Styling Standards

### Base Card Styles

- **Shadow**: Always use `shadow-sm` for base cards
- **Border Radius**: Always use `rounded-sm` for consistent corner rounding
- **Border**: Include `border` for defined edges
- **Hover Effect**: On hover, increase shadow slightly with `hover:shadow-md`
- **Transition**: Add smooth transitions with `transition-shadow` and `duration-200`

### Standard Card Pattern

```tsx
<Card className="shadow-sm rounded-sm border hover:shadow-md transition-shadow duration-200">
  {/* Card content */}
</Card>
```

### Card Variants by Context

#### Data Table Mobile Cards

```tsx
<Card className="hover:shadow-md transition-shadow duration-200 border rounded-sm shadow-sm">
  <CardContent className="p-4">{/* Content */}</CardContent>
</Card>
```

#### Info Cards

```tsx
<Card className="flex flex-col border rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200">
  <CardHeader className="p-4">
    <CardTitle className="text-sm">{title}</CardTitle>
  </CardHeader>
  <CardContent className="text-sm p-4 pt-0">{content}</CardContent>
  <CardFooter className="flex justify-end p-4 pt-0">{actions}</CardFooter>
</Card>
```

#### Stat Cards (Quick Stats)

```tsx
<Card className="p-4 text-center shadow-sm rounded-sm border hover:shadow-md transition-shadow duration-200">
  {/* Stats content */}
</Card>
```

#### Winner/Player Cards

```tsx
<Card className="flex flex-col h-full w-full p-0 rounded-sm border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
  {/* Player content */}
</Card>
```

## Code Style Guidelines

### Do NOT modify UI component files

- Never update files in `src/components/ui/` directory
- These are from shadcn/ui and should remain unchanged
- Apply custom styling through className props only

### Avatar Image Pattern

Always use this pattern for avatar images to prevent stretching:

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

**Key points:**

- Add explicit width/height to both Avatar container and AvatarImage
- Use `object-cover` to maintain aspect ratio
- Use `rounded-full` on AvatarImage for circular shape
- Add `flex justify-center items-center` for proper centering

### Mobile Scrollable Sections

For lists that may have many items on mobile:

```tsx
<div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
  {/* Content */}
</div>
```

**Guidelines:**

- Use `max-h-[60vh]` to limit height to 60% of viewport
- Add `overflow-y-auto` for vertical scrolling
- Use smaller gaps (gap-2) to keep items compact
- **Do not** add border/padding around scrollable container - keep it clean

### Styling Approach

- Use Tailwind utility classes via className prop
- Maintain consistent spacing with p-4, p-3 patterns
- Keep text sizes consistent: text-sm for body, text-xs for meta info
- Use semantic color classes: text-blue-600, text-gray-600, etc.

### Component Structure

- Follow the existing pattern: CardHeader → CardContent → CardFooter
- Keep padding consistent across similar components
- Maintain flex layouts for proper spacing

## Project Conventions

### File Organization

- Components in `src/components/`
- UI primitives in `src/components/ui/`
- Page components in `src/app/`
- Type definitions in `src/types/`
- Utilities in `src/utils/`

### Naming Conventions

- React components: PascalCase
- Utility functions: camelCase
- CSS classes: kebab-case (Tailwind)
- Types/Interfaces: PascalCase

### Import Order

1. React/Next.js imports
2. Third-party libraries
3. UI components
4. Local components
5. Utils/helpers
6. Types
7. Styles

## General Coding Preferences

### TypeScript

- Always use explicit types
- Prefer interfaces over types for object shapes
- Use type inference where obvious

### React

- Use functional components
- Prefer hooks over class components
- Keep components small and focused
- Extract reusable logic into custom hooks

### Styling

- Mobile-first responsive design
- Use Tailwind utilities over custom CSS
- Keep dark mode support consistent
- Maintain accessibility standards
- For mobile views, use card-based layouts with vertical information display
- Use `useMediaQuery({ maxWidth: 639 })` for mobile detection (sm breakpoint)

## Tabs Component Pattern

When using tabs for categorization:

```tsx
<Tabs defaultValue={defaultTab} className="w-full">
  <TabsList className="grid w-full grid-cols-3 mb-4">
    <TabsTrigger value="tab1" className="flex items-center gap-2">
      <Icon size={14} />
      <span className="hidden xs:inline">Label</span>
    </TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">{/* Content */}</TabsContent>
</Tabs>
```

**Guidelines:**

- Show icon-only on smallest screens, icon + label on xs+ breakpoint
- Use `hidden xs:inline` on label text for responsive behavior
- Keep icons neutral colored (no text-red-600, etc.) - let tab state handle styling
- Use descriptive content headers inside TabsContent with category name

## Accordion Component Pattern

For collapsible sections:

```tsx
<AccordionItem key={key} value={key}>
  <AccordionTrigger className="hover:no-underline px-4">
    {/* Trigger content */}
  </AccordionTrigger>
  <AccordionContent className="px-4 pb-4">{/* Content */}</AccordionContent>
</AccordionItem>
```

**Guidelines:**

- Do not add outer card styling (border, shadow) to AccordionItem
- Keep content clean and spacious with appropriate padding
- Use `hover:no-underline` to remove default underline on hover

## Do Not

- Modify shadcn/ui component files
- Mix custom CSS with Tailwind (use Tailwind only)
- Create unnecessary abstractions
- Ignore TypeScript errors
- Skip accessibility attributes
- Do not update cards in the featured component
