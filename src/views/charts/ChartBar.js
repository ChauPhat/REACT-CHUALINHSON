import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FiltersBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Tuần 5", "Tuần 6", "Tuần 7", "Tuần 8", "Tuần 9", "Tuần 10"],
    datasets: [
      {
        label: "Đoàn Sinh Có Mặt",
        data: [50, 100, 150, 150, 50, 100, 150, 200, 50, 100, 150],
        backgroundColor: "#3a86ff",
        borderRadius: 50,
         maxBarThickness: 20,
      },
      {
        label: "Đoàn Sinh Vắng Mặt",
        data: [20, 20, 20, 10, 20, 10, 20, 10, 50, 10, 1],
        backgroundColor: "#bc4b51",
        borderRadius: 50,
        maxBarThickness: 20,
      },
    ],
  });

  const [filter, setFilter] = useState("all");

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);

    if (value === "quarter1") {
      setChartData({
        ...chartData,
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Tuần 5", "Tuần 6", "Tuần 7", "Tuần 8", "Tuần 9", "Tuần 10"],
        datasets: [
          {
            ...chartData.datasets[0],
            data: [50, 100, 150, 150, 50, 100, 150, 200, 50, 100],
          },
          {
            ...chartData.datasets[1],
            data: [20, 20, 20, 10, 20, 10, 20, 10, 50, 10],
          },
        ],
      });
    } else if (value === "quarter2") {
      setChartData({
        ...chartData,
        labels: ["Tuần 11", "Tuần 12", "Tuần 13", "Tuần 14", "Tuần 15", "Tuần 16", "Tuần 17", "Tuần 18", "Tuần 19", "Tuần 20"],
        datasets: [
          {
            ...chartData.datasets[0],
            data: [20, 70, 70, 170, 50, 70, 70, 140, 50, 100],
          },
          {
            ...chartData.datasets[1],
            data: [20, 20, 20, 10, 20, 10, 20, 10, 50, 10],
          },
        ],
      });
    } else {
      setChartData({
        ...chartData,
        labels: ["Tuần 21", "Tuần 22", "Tuần 23", "Tuần 24", "Tuần 25", "Tuần 26", "Tuần 27", "Tuần 28", "Tuần 29", "Tuần 30"],
        datasets: [
          {
            ...chartData.datasets[0],
            data: [30, 70, 50, 150, 50, 120, 70, 150, 50, 100],
          },
          {
            ...chartData.datasets[1],
            data: [10, 10, 10, 10, 10, 10, 20, 10, 50, 10],
          },
        ],
      });
    }
  };
  const containerStyle = {
    border: '2px solid rgba(8, 10, 12, .175)',
    borderRadius: '8px',         
    padding: '10px',             
  };

  return (
    <div className="chart-container" style={containerStyle} >

    <div class="form-group">
    <h3>Điểm Danh Theo:</h3>
    <br/>
    <select value={filter} onChange={handleFilterChange} id="quarter-select" class="form-select" aria-label="Default select example">
        <option value="quarter1">Tuần 1  &#8594; 10</option>
        <option value="quarter2">Tuần 10 &#8594; 20</option>
        <option value="quarter3">Tuần 20 &#8594; 30</option>
    </select>
  </div>

      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
    
            tooltip: {
              callbacks: {
                title: (context) => {
                    
                  return context[0].label;
                },
                label: (context) => {
                  const datasets = context.chart.data.datasets;
                  const label1 = `${datasets[0].label}: ${datasets[0].data[context.dataIndex]}`;
                  const label2 = `${datasets[1].label}: ${datasets[1].data[context.dataIndex]}`;
                  return [label1, label2];
                },
              },
            },
          },
       
        }}
      />
    </div>
  );
};

export default FiltersBarChart;
