import React from "react";
import { useEffect, useState } from "react";
import "../App.css";
import io from "socket.io-client";
import { IoMoon } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import styles from "../main.module.css";
import useStore, { themeStore } from "../store";
import CandleChart from "../components/CandleChart";
import StocksTable from "../components/StocksTable";
import CurrentStockCard from "../components/CurrentStockCard";
import axios from "axios";
import { DarkModeSwitch } from "react-toggle-dark-mode";

export const socket = io("http://localhost:3000");


function Home() {
    const [message, setMessage] = useState("hello backend");
    const [receivedMessage, setReceivedMessage] = useState("");
    const [series, setSeries] = useState({});
    const { stockData, setStockData } = useStore();
    const [isLive, setIsLive] = useState(false);
    const { theme, setTheme } = themeStore();

    const [darkSide, setDarkSide] = useState(
        false
    );
 
    const toggleDarkMode = (checked) => {
        // setTheme(colorTheme);
        setDarkSide(checked);
        if (checked) {
            localStorage.setItem("theme", "light")
            const root = window.document.documentElement;
            root.classList.add("dark");
            setTheme("dark")
            // root.classList.remove("light");
        } else {
            localStorage.setItem("theme", "dark")
            const root = window.document.documentElement;
            root.classList.remove("dark");
            setTheme("light")
            // root.classList.add("light");
        }
        // setDarkSide(checked);
    };

  // // Options for candlestick chart

  const requestData = () => {
    // const socket = io();
    console.log("Request");
  };

  useEffect(() => {
    if (stockData?.data?.length === 0 || !stockData) return;
    console.log(stockData);
    if (!stockData || !stockData.data || stockData?.data?.length == 0) return;
    const transformedData = stockData?.data.map((entry) => {
      const { timestamp, open, high, low, close, volume } = entry;

      return {
        x: new Date(timestamp).toLocaleTimeString(),
        y: [
          parseFloat(open),
          parseFloat(high),
          parseFloat(low),
          parseFloat(close),
        ],
      };
    });

    setSeries(transformedData);
  }, [stockData]);

  useEffect(() => {
    // socket.emit("sendData", "HCL")
    // Listen for "sendData" event from the backend
    socket.on("sendData", (data) => {
      // alert("data received");
      console.log(data);
      setStockData(data);

      // console.log("LEngth of new data", data?.data.length);
    });

    socket.on("updatedData", (data) => {
      setStockData(data);
      console.log(data);

      console.log("LEngth of updated data", data?.data.length);
    });

    // Clean up event listener on component unmount
    return () => {
      socket.off("sendData");
      socket.off("updatedData");
    };
  }, []);

  const liveData = async (symbo) => {
    try {
      const stocks = await axios.get(`http://localhost:3000/listedStocks`);
      const symbols = stocks.data.map((item) => {
        return item.symbol;
      });
      console.log(symbols);

      const response = await axios.post(`http://localhost:3000/liveData`, {
        symbols,
      });
      if (response.status === 200) {
        setIsLive(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const stopLiveData = async (symbo) => {
    try {
      const stocks = await axios.get(`http://localhost:3000/listedStocks`);
      const symbols = stocks.data.map((item) => {
        return item.symbol;
      });
      console.log(symbols);

      const response = await axios.post(`http://localhost:3000/stopLiveData`, {
        symbols,
      });
      if (response.status === 200) {
        setIsLive(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="w-full h-full p-2 dark:bg-lightbackground-lightBg bg-darkbackground-darkBg overflow-hidden">
        <div className="w-full gap-x-2 p-3 py-1 h-10 flex justify-end rounded-sm  bg-darkbackground-darkTile dark:bg-lightbackground-lightTile shadow-sm">
          <div className="p-1 h-[100%] mr-1  dark:bg-lightbackground-lightTile2 bg-darkbackground-darkTile2 rounded-md px-2 flex justify-center items-center">
            <DarkModeSwitch
              checked={darkSide}
              onChange={toggleDarkMode}
              size={20}
            />
          </div>
          {isLive ? (
            <button
              className="px-2 rounded-sm text-white bg-red-600"
              onClick={() => stopLiveData(stockData.symbol)}
            >
              Stop
            </button>
          ) : (
            <button
              className="px-2 rounded-sm text-white bg-green-600"
              onClick={() => liveData(stockData.symbol)}
            >
              Go Live
            </button>
          )}
        </div>
        <div className="flex justify-between gap-2 mt-2 h-[91vh] overflow-hidden">
          <div className="w-[70%]  dark:bg-lightbackground-lightTile bg-darkbackground-darkTile  rounded-sm overflow-hidden shadow-sm h-[100%]">
            <CandleChart series={series} />
          </div>
          <div className="w-[30%]  ">
            <div className="bg-darkbackground-darkTile  dark:bg-white p-3 px-4 rounded-sm shadow-sm  h-[65%] ">
              <StocksTable />
            </div>
            <div className="bg-darkbackground-darkTile dark:bg-white  mt-2 p-3 px-4 rounded-sm shadow-sm h-[35%]">
              <CurrentStockCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
