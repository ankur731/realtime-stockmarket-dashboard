import React, { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import { GoChevronDown } from "react-icons/go";
import { HiPlusSmall } from "react-icons/hi2";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import styles from "../main.module.css";
import useStore from "../store";
import { socket } from "../page/Home";
import axios from "axios";

function StocksTable() {
  const { stockData, setStockData } = useStore();
  const [tableData, setTableData] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState(new Set());

  async function requestData(symbol) {
    const rooms = Object.values(joinedRooms).map((item) => {
      return item;
    });

    socket.emit("leaveRoom", rooms);

    socket.emit("joinRoom", symbol);
    setJoinedRooms([symbol]);
  }

  const convertToTable = (data) => {
    const transformedData = data.map((item, index) => {
      return {
        key: index,
        symbol: item.symbol,
        last: item.last,
        logo: item.logo,
        change: parseFloat(item.differencePercentage).toFixed(2),
      };
    });

    return transformedData;
  };
  async function getTopStocks() {
    const response = await axios.get("http://localhost:3000/listedStocks");

    const transformedData = convertToTable(response.data);
    setTableData(transformedData);
  }

  useEffect(() => {
    getTopStocks();
    requestData("HCL");
    socket.emit("sendData", "HCL");
    socket.on("topStocks", (data) => {
      const transformedData = convertToTable(data);
      setTableData(transformedData);
    });

    return () => {
      socket.off("updatedData");
    };
  }, []);

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (text, record) => (
        <div className="flex gap-1 items-center cursor-pointer">
          <img
            src={record.logo}
            className="min-w-6 object-cover min-h-6 w-6 h-6  rounded-full"
          />
          <p
            onClick={() => socket.emit("sendData", text)}
            className="text-darkText-darkText1 dark:text-lightText-text3"
          >
            {text}
          </p>
        </div>
      ),
    },
    {
      title: "Last",
      dataIndex: "last",
      key: "last",
      render: (text) => (
        <p className="text-darkText-darkText1  dark:text-lightText-text3 cursor-pointer">{text}</p>
      ),
    },
    {
      title: "Change",
      dataIndex: "change",
      key: "change",
      render: (text) => (
        <p
          className={`text-darkText-darkText1   cursor-pointer ${
            text < 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {text}
        </p>
      ),
    },
  ];
  return (
    <div
      className="overflow-auto  h-[100%] relative"
      style={{ scrollbarWidth: "none" }}
    >
      <div
        className="w-[100%] h-[40px] bg-darkBackground-darkTile dark:bg-white  flex border-1 border-red-500 bg-[#20252b]  justify-between sticky top-0 z-1"
        style={{ zIndex: "99" }}
      >
        <h5 className="flex dark:bg-white dark:text-lightText-text1 items-center gap-1 m-0 cursor-pointer font-semibold text-darkText-darkText1">
          Watchlist{" "}
          <GoChevronDown className="cursor-pointer  dark:text-lightText-text4 text-darkText-darkText1" />
        </h5>
        <div className="flex items-center gap-4">
          <HiPlusSmall
            fontSize={24}
            className="cursor-pointer  dark:text-lightText-text4 text-darkText-darkText1"
          />
          <PiDotsThreeOutlineLight
            fontSize={22}
            className="cursor-pointer  dark:text-lightText-text4 text-darkText-darkText1"
          />
        </div>
      </div>
      <div className={`${styles.tableWrapper} mt-3 z-0 relative `}>
        <Table
          pagination={false}
          size="small"
          rowHoverable={true}
          columns={columns}
          dataSource={tableData}
          //   scroll={{ x: `calc(95% - 30px)` }}
        />
      </div>
    </div>
  );
}

export default StocksTable;
