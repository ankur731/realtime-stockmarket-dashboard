import React, { useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { themeStore } from "../store";
import { apexcharts } from "apexcharts";
function MainCandleChart({ series }) {
  const { theme } = themeStore();

  useEffect(() => {
    ApexCharts.exec("realtime", "updateSeries", [{ data: series }]);
    console.log("Updateing");
  }, [series]);

  const options = {
    chart: {
      // height: 650,
      id: "realtime",
      animations: {
        enabled: true, // Enable animations
        easing: "easein", // Choose easing function
        speed: 1000, // Set animation speed (in milliseconds)
        animateGradually: {
          enabled: true, // Enable gradual animation
          delay: 100, // Set delay between each data point animation (in milliseconds)
        },
        dynamicAnimation: {
          enabled: true, // Enable dynamic animation
          speed: 500, // Set dynamic animation speed (in milliseconds)
        },
      },

      zoom: {
        type: "x", // Enable horizontal zooming
        enabled: true, // Enable zooming
      },
      toolbar: {
        autoSelected: "pan",
        show: true,
        // tools: {
        //   download: true,
        //   selection: true,
        //   zoom: true,
        //   zoomin: true,
        //   zoomout: true,
        //   pan: true,
        //   reset: true,
        // },

        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        itemMargin: {
          horizontal: 8,
          vertical: 8,
        },
      },
      theme: {
        mode: "dark",
        palette: "palette1",
        color: "#fff",
      },
    },

    // series: [
    //   {
    //     name: "candle",
    //     data: data,
    //   },
    // ],
    // zoom: {
    //     type: 'x',
    //     enabled: true,
    //     autoScaleYaxis: true
    //   },
    xaxis: {
      type: "category",
      //tickPlacement: 'between',
      labels: {
        show: true,
        style: {
          colors: theme === "dark" ? "#727272" : "#cdcdcd",
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: theme === "dark" ? "#727272" : "#cdcdcd",
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    tooltip: {
      theme: "dark", // Use a dark theme for the tooltip
      style: {
        fontSize: "8px",
        fontFamily: "Arial",
        color: "#ffffff", // Change the text color to [#f1f5f7]
      },
    },
  };

  return (
    <>
      <Chart
        options={options}
        series={[{ data: series }]}
        type="candlestick"
        height={"98%"}
      />
    </>
  );
}

export default MainCandleChart;
