import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";
import { fetchVisitorCountHistory } from "../../api";
import { getCachedData, setCachedData } from "../../utils/cache";

const VISITOR_COUNT_KEY = "visitorCount";
const msCacheExpiryTime = 86400000;

const VisitorChart = () => {
  const chartInstanceRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const initializeChart = async () => {
      let result = getCachedData(VISITOR_COUNT_KEY);
      if (!result) {
        result = await fetchVisitorCountHistory();
        if (result) result.pop();
        setCachedData(VISITOR_COUNT_KEY, result, msCacheExpiryTime);
      }

      let labels = [];
      for (let i = 0; i < result.length; ++i) {
        if (i % 10 === 0) labels.push(result[i].date.toString());
        else labels.push("");
      }

      const data = {
        labels: labels,
        datasets: [
          {
            label: "Visitors",
            data: [...result.map((x) => x.count)],
            borderColor: "#ff8c00",
            tension: 0.4,
            pointStyle: false,
            fill: true,
          },
        ],
      };

      const config = {
        type: "line",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Unique visitors per day",
            },
            legend: {
              display: false,
            },
          },
          interaction: {
            intersect: false,
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "number of people",
              },
              suggestedMin: 0,
              suggestedMax: 100,
            },
          },
        },
      };

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(chartRef.current, config);
    };

    initializeChart();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      style={{
        width: "40vw",
        height: "45vh",
        backgroundColor: "#D3D3D3",
        borderRadius: "16px",
      }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default VisitorChart;
