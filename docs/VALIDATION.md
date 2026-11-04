# Validation record

## Completed checks

- TypeScript strict checks, ESLint, and Prettier formatting.
- Expo dependency compatibility check and all 20 Expo Doctor checks.
- 19 Node test cases covering money formatting, filter combinations, bag variant identity, merging and limits, removal, customer validation, order snapshots, duplicate order IDs, storage restoration, malformed saved data, and historical receipts.
- 13 browser scenario groups in Chromium, using the exported React Native Web app at 390 × 900, device scale factor 2. A second viewport of 320 × 760 checked visible controls for horizontal clipping.
- Android and iOS Hermes exports and the web production export.
- Three actual app screenshots: Shop, Product Details, and Checkout. All use the temporary product illustrations.

## Dark theme and mobile sizing

On 4 November 2026, eight additional mobile checks passed in Chromium and WebKit at 320, 390, 430, and 600 px. The app filled the viewport at 1× scale without horizontal overflow, including after focusing search and checkout inputs. All fields use 16 px text to avoid iOS focus zoom. Dark surfaces, readable foreground colours, and a light native status bar are applied across the app. These are browser emulation results; physical phones were not tested. Reproduce with `npm run verify:mobile` after installing both Playwright browsers.

## Added coverage

- More shows Coming soon, expose no product purchase controls, and return to all available items.
- Block 9 Foyer is visible on Shop, Bag, Checkout, and Receipt.
- Desktop layout and keyboard focus are checked in addition to the mobile viewports.

## Published demo verification

On 4 November 2026, the same 13 scenario groups passed against https://abdullahwarrg-png.github.io/klust-campus-store/. Direct navigation, reload persistence, asset loading, and a fictional RM 127.00 checkout succeeded without runtime exceptions. GitHub Actions completed the build and Pages deployment successfully.

## Browser evidence

The walkthrough bought two Cloud Heritage Tees in size M at RM 49.00 each and one Blue Campus Mug at RM 29.00, totaling RM 127.00. It first exercised additional size/colour entries and removed them, then verified bag persistence, form corrections, storage failure recovery, exactly one order after repeated taps, and persistent order history.

A simulated local storage write failure preserved the two bag lines and created no receipt. Restoring storage and retrying created one order, cleared the bag, and retained its RM 127.00 total. No browser runtime exceptions were recorded.

## Practical limits

Browser behavior does not establish native device compatibility by itself. Native Android and iOS bundles export, but camera QR launch, hardware Back, native keyboards, screen readers, and physical safe areas still need device testing. The narrow-screen check verifies layout bounds, not a complete accessibility audit. Prices and order fulfillment are illustrative. The displayed pickup location is Block 9 Foyer; the demo does not reserve a collection.

## Reproduce

Follow the export, static server, and `npm run verify:web` commands in the README. The browser script saves the latest structured results in `docs/verification.json` and refreshes the three screenshot PNGs.
