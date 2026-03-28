/**
 * Shared layout constants for consistent container widths and padding.
 *
 * Usage:
 *   import { layout } from "../../utils/layout";
 *
 *   <div className={layout.pageMaxWidth}>          // page-level safety cap
 *     <div className={layout.container}>            // standard content container
 *     <div className={layout.containerNarrow}>      // narrow readability container
 */

const RESPONSIVE_PADDING =
  "px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

export const layout = {
  /** Safety cap for page-level content wrappers — prevents content exceeding 1920px */
  pageMaxWidth: "max-w-[1920px] mx-auto",

  /** Standard content container (1280px) with responsive padding */
  container: `max-w-7xl mx-auto ${RESPONSIVE_PADDING}`,

  /** Narrow container (768px) for readability-focused content (FAQ, blog articles) */
  containerNarrow: `max-w-3xl mx-auto ${RESPONSIVE_PADDING}`,

  /** Responsive padding only — when max-width is handled separately */
  padding: RESPONSIVE_PADDING,
} as const;
