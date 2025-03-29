/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    colors: {
      primary: {
        50: '#edf8ff',
        100: '#d6edff',
        200: '#b5e1ff',
        300: '#83d0ff',
        400: '#48b5ff',
        500: '#1e91ff',
        600: '#0671ff',
        700: '#0054e9',
        800: '#0847c5',
        900: '#0d409b',
        950: '#0e285d',
      },
      success: {
        50: '#f0fdf3',
        100: '#ddfbe4',
        200: '#bdf5cb',
        300: '#89eca4',
        400: '#4eda74',
        500: '#2dd55b',
        600: '#1a9f3e',
        700: '#187d34',
        800: '#18632e',
        900: '#165127',
        950: '#062d12',
      },
      warning: {
        50: '#ffffea',
        100: '#fffcc5',
        200: '#fff985',
        300: '#ffef46',
        400: '#ffe11b',
        500: '#ffc409',
        600: '#e29600',
        700: '#bb6a02',
        800: '#985208',
        900: '#7c430b',
        950: '#482300',
      },
      danger: {
        50: '#fff0f1',
        100: '#ffdde0',
        200: '#ffc1c6',
        300: '#ff959d',
        400: '#ff5966',
        500: '#ff2637',
        600: '#fc0619',
        700: '#c5000f',
        800: '#af0512',
        900: '#900c16',
        950: '#500006',
      },
      zinc: {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        400: "#a1a1aa",
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        800: "#27272a",
        900: "#18181b",
        950: "#09090b"
      },
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

