import { ConfigProvider } from "antd";
import Home from "./page/Home";


function App() {
 
  

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#2b323b",
            borderColor: "#20252b",
            headerColor: "#9e9c9b",
            bodySortBg: "#2b323b",
            headerSplitColor: "#20252b",
          },
        },
        token: {
          fontWeightStrong: 500,
          colorBgContainer: "#2b323b",
        },
      }}
    >
    <Home/>
    </ConfigProvider>
  );
}

export default App;
