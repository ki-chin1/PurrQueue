/**
 * TAILWIND CSS CONFIGURATION
 * 
 * Configures Tailwind CSS for this project:
 * - content: Tells Tailwind where to scan for class names
 * - theme: Extends default theme with custom colors/fonts if needed
 * - plugins: Additional Tailwind plugins (forms plugin included for better form styling)
 */

import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config;
