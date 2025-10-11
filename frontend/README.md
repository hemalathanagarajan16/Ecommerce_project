# Angular Standalone E-commerce (Minimal)

This is a minimal Angular (standalone components) app skeleton intended to fix the errors you posted:
- includes `undici-types` in devDependencies to satisfy `@types/node`'s Fetch-related imports
- uses standalone components with `standalone: true` and `imports` arrays
- `tsconfig.json` uses `moduleResolution: node`

To run:
1. `npm install`
2. `npm start` (requires Angular CLI from devDependencies)

Note: This is a minimal skeleton. For real production usage tweak versions and configuration as needed.
