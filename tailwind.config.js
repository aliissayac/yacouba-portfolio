/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gunmetal: {
          DEFAULT: 'var(--gunmetal)',
          light: 'var(--gunmetal-light)',
          mid: 'var(--gunmetal-mid)',
          deep: 'var(--gunmetal-deep)',
        },
        chromium: {
          DEFAULT: 'var(--chromium)',
          dim: 'var(--chromium-dim)',
        },
        titanium: {
          DEFAULT: 'var(--titanium)',
          dim: 'var(--titanium-dim)',
        },
        signal: {
          blue: 'var(--signal-blue)',
          'blue-glow': 'var(--signal-blue-glow)',
          'blue-dim': 'var(--signal-blue-dim)',
        },
        border: {
          rule: 'var(--border-rule)',
          chromium: 'var(--border-chromium)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.88' }],
        '9xl':  ['9rem',  { lineHeight: '0.88' }],
      },
      animation: {
        'orbit-a': 'orbit-a 18s linear infinite',
        'orbit-b': 'orbit-b 22s linear infinite',
        'orbit-c': 'orbit-c 26s linear infinite',
      },
    },
  },
  plugins: [],
};