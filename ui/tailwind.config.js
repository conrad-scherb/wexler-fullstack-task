/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],

  theme: {
    extend: {
      spacing: {
        25: "6.25rem",
      },
      gridTemplateColumns: {
        thumbnail: "repeat(auto-fit, minmax(100px, max-content))",
      },
    },
  },
};
