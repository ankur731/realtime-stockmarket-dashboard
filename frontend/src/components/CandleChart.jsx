import React, { useEffect, useState } from "react";

import useStore, { themeStore } from "../store";
import apexchart from "apexcharts";
import MainCandleChart from "../charts/CandleChart";

function CandleChart({ series }) {
  const [activeTimeRangeBtn, setActiveTimeRangeBtn] = useState(1);
  const { stockData } = useStore();
  const { theme } = themeStore();
 

 
  return (
    <>
      {stockData && stockData.data && stockData.data.length > 1 ? (
        <div className="h-[100%] dark:bg-lightbackground-lightTile bg-darkbackground-darkTile w-[100%] p-2 pb-3 pl-1">
          <div className="w-[100%] h-10 p-3 px-4 pr-2 flex justify-between items-center">
            <div className="flex gap-x-2 items-center">
              <img className="w-6 h-6 rounded-full" src={stockData.logo} />
              <h4 className="text-darkText-darkText0 m-0   dark:text-lightText-text2 text-lg font-semibold">
                {stockData?.name || "N/A"} . 1D . NASDAQ
              </h4>
              <div className="flex gap-4 pl-3">
                <p className="text-darkText-darkText1 m-0  dark:text-lightText-text3 ">
                  0{" "}
                  <span
                    className={` ${
                      parseFloat(
                        stockData.data[stockData.data.length - 1].open
                      ) >
                      parseFloat(stockData.data[stockData.data.length - 2].open)
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {parseFloat(
                      stockData.data[stockData.data.length - 1].open
                    ).toFixed(4)}
                  </span>
                </p>
                <p className="text-darkText-darkText1 m-0  dark:text-lightText-text3 ">
                  {" "}
                  H{" "}
                  <span
                    className={` ${
                      parseFloat(
                        stockData.data[stockData.data.length - 1].open
                      ) >
                      parseFloat(stockData.data[stockData.data.length - 2].open)
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {parseFloat(
                      stockData.data[stockData.data.length - 1].high
                    ).toFixed(4)}
                  </span>
                </p>
                <p
                  className={`text-darkText-darkText1 m-0  dark:text-lightText-text3 `}
                >
                  {" "}
                  L{" "}
                  <span
                    className={` ${
                      parseFloat(
                        stockData.data[stockData.data.length - 1].open
                      ) >
                      parseFloat(stockData.data[stockData.data.length - 2].open)
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {parseFloat(
                      stockData.data[stockData.data.length - 1].low
                    ).toFixed(4)}
                  </span>
                </p>
                <p className="text-darkText-darkText1 m-0  dark:text-lightText-text3 ">
                  {" "}
                  C{" "}
                  <span
                    className={` ${
                      parseFloat(
                        stockData.data[stockData.data.length - 1].open
                      ) >
                      parseFloat(stockData.data[stockData.data.length - 2].open)
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {parseFloat(
                      stockData.data[stockData.data.length - 1].close
                    ).toFixed(4)}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <p
                onClick={() => setActiveTimeRangeBtn(1)}
                className={`text-darkText-darkText1  dark:text-lightText-text3 p-1 cursor-pointer ${
                  activeTimeRangeBtn === 1
                    ? "bg-darkbackground-darkTile2 dark:bg-lightbackground-lightTile2"
                    : "hover:bg-darkbackground-darkTile2"
                } rounded-md hover:dark:bg-lightbackground-lightTile2 px-3`}
              >
                1D
              </p>
              <p
                onClick={() => setActiveTimeRangeBtn(2)}
                className={`text-darkText-darkText1 dark:text-lightText-text3 p-1 cursor-pointer ${
                  activeTimeRangeBtn === 2
                    ? "bg-darkbackground-darkTile2 dark:bg-lightbackground-lightTile2"
                    : "hover:bg-darkbackground-darkTile2"
                } rounded-md hover:dark:bg-lightbackground-lightTile2 px-3`}
              >
                1W
              </p>
              <p
                onClick={() => setActiveTimeRangeBtn(3)}
                className={`text-darkText-darkText1  dark:text-lightText-text3 p-1 cursor-pointer ${
                  activeTimeRangeBtn === 3
                    ? "bg-darkbackground-darkTile2 dark:bg-lightbackground-lightTile2"
                    : "hover:bg-darkbackground-darkTile2"
                } rounded-md hover:dark:bg-lightbackground-lightTile2 px-3`}
              >
                1M
              </p>
              <p
                onClick={() => setActiveTimeRangeBtn(4)}
                className={`text-darkText-darkText1  dark:text-lightText-text3 p-1 cursor-pointer ${
                  activeTimeRangeBtn === 4
                    ? "bg-darkbackground-darkTile2 dark:bg-lightbackground-lightTile2"
                    : "hover:bg-darkbackground-darkTile2"
                } rounded-md hover:dark:bg-lightbackground-lightTile2 px-3`}
              >
                1Y
              </p>
            </div>
          </div>
          <MainCandleChart series={series}/>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default CandleChart;
