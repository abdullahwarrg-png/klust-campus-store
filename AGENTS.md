# KLUST Campus Store

This is an Expo SDK 58 application built with React Native and TypeScript.

## Architecture

- Use React Navigation native stacks and bottom tabs, as specified for this project.
- Keep product data in `src/data/products.ts` and shopping calculations in `src/utils/shop.ts`.
- Access cart and order state through `useShop`; preserve the serialized persistence queue and save-before-clear checkout behavior.
- Use integer sen for all calculations and `money()` for MYR display.
- Keep shared layout and controls in `src/components` and theme values in `src/theme`.
- Product illustrations are temporary. Follow `docs/IMAGE_GUIDE.md` when replacing them. Do not regenerate the illustrations over final photographs.

## Checks

Run `npm run typecheck`, `npm run lint`, and `npm test` before delivering code changes.
Run `npm run export` to verify Android, iOS, and web bundles. Build output belongs in `dist` and must remain excluded from TypeScript analysis.
See README.md for the reproducible browser walkthrough and screenshot instructions.
