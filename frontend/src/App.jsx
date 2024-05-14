import { ConfigProvider } from "antd";
import Home from "./page/Home";
import { useEffect, useState } from "react";
import { themeStore } from "./store";


function App() {
  // const [theme, setTheme] = useState(localStorage.getItem("theme") || 'light');
  const {theme} = themeStore()

  useEffect(() => {
  
    return () => {
      localStorage.removeItem("theme")
    }
})
  const lightTheme = {
    components: {
      Table: {
        headerBg: '#F5f5f7', // Light theme color
        borderColor: '#E5E5E5', // Light theme color
        headerColor: '#000000', // Light theme color
        bodySortBg: '#F7F7F7', // Light theme color
        headerSplitColor: '#E5E5E5', // Light theme color
      },
    },
    token: {
      fontWeightStrong: 500,
      colorBgContainer: '#F1f2f3', // Light theme color
    },
  };

  const darkTheme = {
    components: {
      Table: {
        headerBg: '#2b323b', // Dark theme color
        borderColor: '#20252b', // Dark theme color
        headerColor: '#9e9c9b', // Dark theme color
        bodySortBg: '#2b323b', // Dark theme color
        headerSplitColor: '#20252b', // Dark theme color
      },
    },
    token: {
      fontWeightStrong: 500,
      colorBgContainer: '#2b323b', // Dark theme color
      
    },
  };


  return (
    <ConfigProvider
      theme={theme === 'dark' ? lightTheme : darkTheme}
    >
    <Home/>
    </ConfigProvider>
  );
}

export default App;
