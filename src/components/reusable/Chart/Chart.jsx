import React from "react";
import { Line } from "react-chartjs-2";

const Chart = ({ data, options }) => {
  if (!data || data.length === 0) {
    return (
      <h1 style={{ textAlign: "center" }}>Select currencies and a timespan.</h1>
    );
  } else {
    return (
      <div className="chart">
        <Line data={data} options={options} height={400} width={600}></Line>
      </div>
    );
  }
};

export default Chart;
