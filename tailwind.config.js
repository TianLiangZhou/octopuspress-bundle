/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['templates/*.twig'],
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      black: colors.black,
      white: colors.white,
      basic: {
        100: "#ffffff",
        200: "#f7f9fc",
        300: "#edf1f7",
        400: "#e4e9f2",
        500: "#c5cee0",
        600: "#8f9bb3",
        700: "#2e3a59",
        800: "#222b45",
        900: "#192038",
        1000: "#151a30",
        1100: "#101426"
      },
      primary: {
        100: "#f2f6ff",
        200: "#d9e4ff",
        300: "#a6c1ff",
        400: "#598bff",
        500: "#3366ff",
        600: "#274bdb",
        700: "#1a34b8",
        800: "#102694",
        900: "#091c7a"
      },
      danger: {
        100: "#fff2f2",
        200: "#ffd6d9",
        300: "#ffa8b4",
        400: "#ff708d",
        500: "#ff3d71",
        600: "#db2c66",
        700: "#b81d5b",
        800: "#94124e",
        900: "#700940",
      },
      warning: {
        100: "#fffdf2",
        200: "#fff1c2",
        300: "#ffe59e",
        400: "#ffc94d",
        500: "#ffaa00",
        600: "#db8b00",
        700: "#b86e00",
        800: "#945400",
        900: "#703c00"
      },
      success: {
        100: "#f0fff5",
        200: "#ccfce3",
        300: "#8cfac7",
        400: "#2ce69b",
        500: "#00d68f",
        600: "#00b887",
        700: "#00997a",
        800: "#007d6c",
        900: "#004a45"
      },
      info: {
        100: "#f2f8ff",
        200: "#c7e2ff",
        300: "#94cbff",
        400: "#42aaff",
        500: "#0095ff",
        600: "#006fd6",
        700: "#0057c2",
        800: "#0041a8",
        900: "#002885",
      }
    },
    extend: {},
  },
  plugins: [],
}
