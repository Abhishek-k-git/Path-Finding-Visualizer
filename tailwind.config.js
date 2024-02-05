/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,html,css}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        gridmap: "repeat(52, 0fr)",
      },
    },
  },
  plugins: [],
};
