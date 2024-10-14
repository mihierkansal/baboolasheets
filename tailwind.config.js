/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          translucentwhite: "#fefeff89",
          translucentzinc: "#22222989",
        },
      },
    },
  },
  plugins: [],
};
