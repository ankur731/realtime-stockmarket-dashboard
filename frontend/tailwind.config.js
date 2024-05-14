/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkbackground: {
          darkBg: "#1e1e1e",
          darkTile: "#20252b",
          darkTile2:"#2b323b"
        },
        lightbackground: {
          lightBg: "#dcdcdc",
          lightTile: "#f5f5f7",
          lightTile2:"#dcdcdc"
        },
        darkText: {
          darkText0:"#ececec",
          darkText1:"#cdcdcd",
          darkText2:"#a6a6a6"
        },
        lightText: {
          text1:"#252525",
          text2:"#333333",
          text3:"#454545",
          text4:"#727272",
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

