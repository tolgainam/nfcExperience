# AGENTS.md

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

## Code Style Guidelines

### Imports & Formatting
- Use absolute imports from `src/` root
- Group imports: React → third-party → internal → types
- Use `.tsx` for React components, `.ts` for utilities
- No default exports for components (use named exports)

### TypeScript
- Strict mode enabled - all types must be explicit
- Use `interface` for object shapes, `type` for unions/primitives
- Prefer `const` assertions for configuration objects
- Use proper typing for Supabase queries with Database type

### Naming Conventions
- Components: PascalCase (e.g., `LanguageSwitcher`)
- Files: PascalCase for components, camelCase for utilities
- Variables: camelCase, use descriptive names
- Constants: UPPER_SNAKE_CASE for configuration

### Error Handling
- Always handle async errors with try/catch
- Use proper TypeScript error types
- Implement loading states for all async operations
- Validate URL parameters before database queries

### React Patterns
- Use functional components with hooks
- Implement proper TypeScript interfaces for props
- Use `useTranslation()` for all UI text
- Apply campaign theming via CSS variables from database

### Database & Supabase
- Use typed Database interface from `types/database.ts`
- Handle null/undefined responses properly
- Use `.maybeSingle()` for optional queries
- Implement retry logic for network errors

### Testing & Quality
- Run `npm run lint` before commits
- Check TypeScript compilation with `npm run build`
- Test both English and French language switching
- Verify campaign theming applies correctly per `cc` parameter