/**
 * POSTCSS CONFIGURATION
 * 
 * PostCSS processes CSS files and applies plugins to transform the CSS.
 * In this case, we use:
 * - tailwindcss: Generates Tailwind utility classes
 * - autoprefixer: Adds vendor prefixes for cross-browser compatibility
 */

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
