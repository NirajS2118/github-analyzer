/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gh: {
          bg: "#0d1117",
          surface: "#161b22",
          border: "#30363d",
          blue: "#58a6ff",
          green: "#3fb950",
          orange: "#f78166",
        },
      },
    },
  },
  plugins: [],
};
