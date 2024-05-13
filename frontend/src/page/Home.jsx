import React from 'react'
import { useEffect, useState } from "react";
import "../App.css";
import io from "socket.io-client";

import styles from "../main.module.css"
import useStore from "../store";
import CandleChart from '../components/CandleChart';
import StocksTable from '../components/StocksTable';
import CurrentStockCard from '../components/CurrentStockCard';
import axios from 'axios';

export const socket = io("http://localhost:3000");



function Home() {
    const [message, setMessage] = useState("hello backend");
    const [receivedMessage, setReceivedMessage] = useState("");
    const [series, setSeries] = useState({});
    const { stockData, setStockData } = useStore();
    
   
    
  
    // // Options for candlestick chart
   
  
    const requestData = () => {
      // const socket = io();
      console.log("Request");
    };
   
  
  
    useEffect(() => {
        if(stockData?.data?.length===0 || !stockData) return 
        console.log(stockData);
        if (!stockData || !stockData.data || stockData?.data?.length == 0)
            return
        const transformedData = stockData?.data.map(entry => {
            const { timestamp, open, high, low, close, volume } = entry;
            
            return {
                x: new Date(timestamp).toLocaleTimeString(),
                y: [parseFloat(open), parseFloat(high), parseFloat(low), parseFloat(close)],
            };
        });

      setSeries(transformedData);
    }, [stockData])
    
    useEffect(() => {

        // socket.emit("sendData", "HCL")
      // Listen for "sendData" event from the backend
        socket.on("sendData", (data) => {
            // alert("data received");
        console.log(data)
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
        const stocks = await axios.get(`http://localhost:3000/listedStocks`)
        const symbols = stocks.data.map(item => {
            return item.symbol
        })
        console.log(symbols)
        
        const response = await axios.post(`http://localhost:3000/liveData`, {symbols})
    }

  return (
    <div>
    <div className="w-full h-full p-2 bg-darkbackground-darkBg overflow-hidden">
              <div className="w-full p-3 py-1 h-10 flex justify-end rounded-sm  bg-darkbackground-darkTile shadow-sm">
                  <button className='px-2 rounded-sm text-white bg-blue-600' onClick={()=>liveData(stockData.symbol)}>Go Live</button>
      </div>
      <div className="flex justify-between gap-2 mt-2 h-[91vh] overflow-hidden">
        <div className="w-[70%] bg-darkbackground-darkTile  rounded-sm overflow-hidden shadow-sm h-[100%]">
         <CandleChart  series={series}/>
        </div>
        <div className="w-[30%]  ">
          <div className="bg-darkbackground-darkTile p-3 px-4 rounded-sm shadow-sm  h-[65%] ">
            
              <StocksTable />
          </div>
          <div className="bg-darkbackground-darkTile  mt-2 p-3 px-4 rounded-sm shadow-sm h-[35%]">
           <CurrentStockCard />
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Home
