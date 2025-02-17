import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";
import { fetchVisitorCountHistory } from "../../api";
import { hasKey, setItem, getItem } from "../../utils/localStorage";

const VISITOR_COUNT_KEY = "visitorCount";
const msCacheExpiryTime = 86400000;

const VisitorChart = () => {
  const chartInstanceRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    let result = [];

    const initializeChart = async () => {
      if (hasKey(VISITOR_COUNT_KEY)) {
        const { count, expires } = getItem(VISITOR_COUNT_KEY);
        if (expires > Date.now()) {
          result = count;
        } else {
          result = await fetchVisitorCountHistory();
          if (result) {
            result.pop();
          }

          setItem(VISITOR_COUNT_KEY, {
            ...(getItem(VISITOR_COUNT_KEY) ?? null),
            count: result,
            expires: Date.now() + msCacheExpiryTime,
          });
        }
      } else {
        result = await fetchVisitorCountHistory();
        if (result) {
          result.pop();
        }

        setItem(VISITOR_COUNT_KEY, {
          ...(getItem(VISITOR_COUNT_KEY) ?? null),
          count: result,
          expires: Date.now() + msCacheExpiryTime,
        });
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
    <div style={{ width: "40vw", height: "45vh" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default VisitorChart;
