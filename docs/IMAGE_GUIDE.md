# KLUST product image editing prompts

Use two reference images for each edit: **Image 1 is your original product or model photo; Image 2 is the official KLUST logo**. Attach the actual logo file so the editor can preserve its lettering and emblem rather than inventing an approximation.

## T-shirt on a model

> Edit Image 1 to place the exact KLUST logo from Image 2 on the centre chest of the T-shirt, at a realistic print size of approximately 18–22 cm wide. Preserve every letter, emblem detail, colour, and proportion of the supplied logo. Make the logo follow the fabric's perspective, folds, lighting, and shadows so it looks naturally screen-printed onto the shirt. Preserve the person's face, identity, body, pose, skin tone, hair, the shirt's original colour and fit, the background, and the camera framing. Do not redraw the logo, invent text, add a rectangular background behind it, or change anything outside the printed area. Return a sharp, high-resolution image suitable for a shopping catalog.

For a smaller chest print, replace “centre chest” with “wearer's left chest” and “18–22 cm” with “7–9 cm”. When you want only the crest, attach the official crest as Image 2; do not ask the editor to invent or recreate it.

## T-shirt photographed without a model

> Use Image 1 as the original product photograph and Image 2 as the exact logo reference. Add the KLUST logo to the centre chest of the T-shirt at a believable retail print size. Preserve the original garment shape, neckline, sleeves, seams, fabric texture, colour, shadows, background, and camera angle. Align the print to the garment surface and preserve natural fabric folds through the printed area. Copy the supplied logo faithfully, including all text, colours, and proportions. Change only the printed area. Do not add people, props, extra lettering, tags, watermarks, or a background box behind the logo. Produce a clean, high-resolution catalog image.

## Ceramic mug

> Edit the mug in Image 1 by placing the exact KLUST logo from Image 2 on its front-facing surface, opposite the handle. Keep the logo centred on the visible printable area, occupying approximately half of the mug body's visible width, with clear space around the edges. Wrap it subtly around the cylindrical surface so the perspective and curvature look natural. Preserve the logo's lettering, colours, emblem, and proportions. Match the original ceramic reflections, glaze, lighting, and shadows. Preserve the mug's shape, colour, handle, contents, background, and camera framing. Change only the printed area. Do not invent text, alter the handle, add a white rectangle, or create a floating sticker. Return a sharp, high-resolution shopping catalog image.

## Fixing inaccurate lettering

> Keep the original photo unchanged. Replace only the inaccurate printed logo with the exact logo supplied in Image 2. Preserve the supplied logo as an image instead of generating new lettering. Maintain its aspect ratio and all emblem details. Match the product's perspective and lighting without changing the text. If exact lettering cannot be preserved, leave the original photo unmodified rather than inventing a replacement.

If an image editor still distorts small lettering, use the original logo as a transparent image layer in an editor with perspective or warp controls. Exact logo compositing is more dependable than repeated AI text generation.

## Preparing the images for this app

- Export PNG images, ideally 1200 × 1200 pixels, with consistent framing and a simple studio background.
- Use the matching garment or mug colour in each variant image. The app does not recolour a single photograph.
- Replace the files in `assets/products/` using their existing filenames. For example, replace `heritage-tee-cloud.png` and `heritage-tee-navy.png` with their respective photos.
- For another filename or format, update the corresponding static `require()` in `src/data/products.ts`. Keep image references static so Metro can bundle them.
- The landing page now uses the supplied collection artwork at `assets/campaigns/campus-collection.png`. Replace that file to update the campaign image; `assets/products/hero.png` is a legacy temporary illustration and is no longer displayed. Keep the campaign artwork separate from individual catalog variants.
- Restart Expo with `npx expo start --clear` after replacing assets. Re-run the web screenshot walkthrough if you also want to refresh the report's sample screens.
- Avoid running `npm run assets` after inserting final photos: that command deliberately rebuilds and overwrites the temporary illustrations.

## Asset filenames

| Product           | Filename prefix  | Colours                 |
| ----------------- | ---------------- | ----------------------- |
| The Heritage Tee  | `heritage-tee-`  | `cloud`, `navy`, `blue` |
| The Varsity Tee   | `varsity-tee-`   | `navy`, `cloud`         |
| The Studio Tee    | `studio-tee-`    | `blue`, `cloud`         |
| The Weekender Tee | `weekender-tee-` | `cloud`, `blue`         |
| The Athletics Tee | `athletics-tee-` | `blue`, `navy`          |
| The Essential Tee | `essential-tee-` | `navy`, `cloud`         |
| The Alumni Tee    | `alumni-tee-`    | `cloud`, `navy`         |
| The Scholars Tee  | `scholars-tee-`  | `blue`, `cloud`         |
| The Campus Mug    | `campus-mug-`    | `cloud`, `blue`         |
| The Crest Mug     | `crest-mug-`     | `navy`, `cloud`         |
| The Daily Mug     | `daily-mug-`     | `blue`, `cloud`         |
| The Two Tone Mug  | `duo-mug-`       | `cloud`, `blue`         |

Append the colour and `.png` to each prefix: `studio-tee-blue.png`, for example. There are 25 variant images across the 12 products.
