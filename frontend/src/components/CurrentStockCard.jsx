import React, { useEffect, useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import useStore from "../store";

function CurrentStockCard() {
    const { stockData } = useStore();
    const [currentStockDetails, setCurrentStockDetails] = useState({
        name: "",
        marketName: "",
        symbol:"",
        currentPrice: "",
        difference: "",
        differencePercentage: "",
        logo: "",
        description:""
    })

    useEffect(() => {
       
        // console.log(stockData.data.length);
        
       
    // console.log("In stock table", stockData?.timeSeries);
  }, [stockData]);

  return (
    <div className="flex flex-col gap-y-4">
      {(1==2 ) ? (
        <div>
          <h1>Loading</h1>
        </div>
      ) : (
        <>
          <div className="w-[100%] flex  justify-between">
            <h5 className="flex items-center gap-3 m-0 cursor-pointer text-lg font-semibold text-darkText-darkText1 dark:text-lightText-text1">
              <img
                src="assets/IBM_logo.jpg"
                className="min-w-6 min-h-6 w-6 h-6  rounded-full"
              />{" "}
              {stockData?.name || "N/A"}
            </h5>
            <div className="flex gap-4">
              <RxDashboard
                fontSize={20}
                className="cursor-pointer  dark:text-lightText-text4 text-darkText-darkText1"
              />
              <PiDotsThreeOutlineLight
                fontSize={18}
                className="cursor-pointer  dark:text-lightText-text4 text-darkText-darkText1"
              />
              <FiEdit
                fontSize={18}
                className="cursor-pointer  dark:text-lightText-text4 text-darkText-darkText1"
              />
            </div>
          </div>
          <div className="">
            <p className="text-darkText-darkText1 text-sm  dark:text-lightText-text3 font-semibold">
              {stockData?.symbol || "N/A"} -{" "}
              {stockData?.exchange || "N/A"}
            </p>
            <p className="text-darkText-darkText2 text-sm mt-1  dark:text-lightText-text4">
              {stockData.description || "N/A"}
            </p>
          </div>
          {/* <div className="flex justify-start  items-start">
            <h3 className="text-darkText-darkText0 m-0 text-[32px] font-semibold">
              {(stockData?.timeSeries[
                Object.keys(stockData?.timeSeries)[0]
              ].open).toFixed(2) || "N/A"}
              <span className="text-sm font-normal">USD</span>{" "}
              <span className="ml-3 text-lg text-red-500">-1.52 (-0.82%)</span>
            </h3>
          </div> */}
          <div className="flex justify-start items-start">
  <h3 className="text-darkText-darkText0 m-0  dark:text-lightText-text1 text-[32px] font-semibold">
  {(stockData && stockData.data && stockData.data.length > 1) ?
    (<>
        {stockData.data[stockData.data.length - 1].open}
        <span className="text-sm font-normal"> USD</span>{" "}
        <span className={`ml-3 text-lg ${parseFloat(stockData.data[stockData.data.length - 1].open) > parseFloat(stockData.data[stockData.data.length - 2].open) ? 'text-green-500' : 'text-red-500'}`}>
            {(() => {
                const previousOpen = parseFloat(stockData.data[stockData.data.length - 2].open);
                const currentOpen = parseFloat(stockData.data[stockData.data.length - 1].open);
                const difference = (currentOpen - previousOpen).toFixed(4);
                const percentageDifference = ((difference / previousOpen) * 100).toFixed(2);
                return `${difference} (${percentageDifference}%)`;
            })()}
        </span>
    </>) :
    "N/A"
}


  </h3>
</div>

        </>
      )}
    </div>
  );
}

export default CurrentStockCard;
