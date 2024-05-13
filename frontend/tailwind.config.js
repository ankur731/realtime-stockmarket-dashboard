/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbackground: {
          darkBg: "#1e1e1e",
          darkTile: "#20252b",
          darkTile2:"#2b323b"
        },
        darkText: {
          darkText0:"#ececec",
          darkText1:"#cdcdcd",
          darkText2:"#a6a6a6"
        },
        text: {
          danger: "#dd1717",
          success:"#4bb543"
        }
      }
    },
  },
  plugins: [],
}

