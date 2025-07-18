import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchImportWarehouses } from "../../backendCalls/import";
import { fetchExportWarehouses } from "../../backendCalls/export";
import {
  fetchWeightByBrand,
  fetchWeightByPartner,
  fetchWeightByType,
} from "../../backendCalls/warehouse";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const SummaryBoard = () => {
  const [importBars, setImportBars] = useState(0);
  const [importWeight, setImportWeight] = useState(0);
  const [importBarsPercent, setImportBarsPercent] = useState(0);
  const [importWeightPercent, setImportWeightPercent] = useState(0);
  const [exportBars, setExportBars] = useState(0);
  const [exportWeight, setExportWeight] = useState(0);
  const [exportBarsPercent, setExportBarsPercent] = useState(0);
  const [exportWeightPercent, setExportWeightPercent] = useState(0);
  const [weightBrands, setWeightBrands] = useState([]);
  const [weightPartners, setWeightPartners] = useState([]);
  const [weightTypes, setWeightTypes] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await fetchImportWarehouses();
      setImportBars(response[0].sumbars);
      setImportWeight(response[0].sumweight);
      setImportBarsPercent(response[0].changebarspercent.toFixed(2));
      setImportWeightPercent(response[0].changeweightpercent.toFixed(2));
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const response = await fetchExportWarehouses();
      setExportBars(response[0].sumbars);
      setExportWeight(response[0].sumweight);
      setExportBarsPercent(response[0].changebarspercent.toFixed(2));
      setExportWeightPercent(response[0].changeweightpercent.toFixed(2));
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const response = await fetchWeightByBrand();
      console.log(response);
      setWeightBrands(response);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const response = await fetchWeightByType();
      console.log(response);
      setWeightTypes(response);
    };
    getData();
  }, []);

  const doughnutDataBrand = {
    name: "Tổng khối lượng thép phân loại theo nhà cung",
    labels: weightBrands.map((item) => item.brandname),
    values: weightBrands.map((item) => item.total_weight),
  };
  const doughnutDataType = {
    name: "Tổng khối lượng theo phân loại thép",
    labels: weightTypes.map((item) => item.type),
    values: weightTypes.map((item) => item.total_weight),
  };

  useEffect(() => {
    const getData = async () => {
      const response = await fetchWeightByPartner();
      console.log(response);
      setWeightPartners(response);
    };
    getData();
  });

  const barData = {
    labels: weightPartners.map((item) => item.name),
    values: weightPartners.map((item) => item.total_weight),
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-12 mb-10">
        <Board
          number={importBars === null ? 0 : importBars}
          title={"Tổng số lượng hàng nhập"}
          status={importBarsPercent}
        />
        <Board
          number={exportBars === null ? 0 : exportBars}
          title={"Tổng số lượng hàng xuất"}
          status={exportBarsPercent}
        />
        <Board
          number={importWeight === null ? 0 : importWeight}
          title={"Tổng khối lượng hàng nhập"}
          status={importWeightPercent}
        />
        <Board
          number={exportWeight === null ? 0 : exportWeight}
          title={"Tổng khối lượng hàng xuất"}
          status={exportWeightPercent}
        />
      </div>
      <div className="flex justify-between mb-10 w-full gap-12 ">
        <DoughnutChart chartData={doughnutDataBrand} />
        <DoughnutChart chartData={doughnutDataType} />
      </div>

      <div className="bg-white shadow-btn rounded-lg w-[100%] flex justify-center mb-10">
        <BarChart chartData={barData} />
      </div>
    </>
  );
};

export default SummaryBoard;

const Board = ({ number, title, status }) => {
  return (
    <div className="bg-white shadow p-4 flex flex-col gap-2 rounded-lg items-center font-semibold">
      <div>{title}</div>
      <div className="text-3xl font-bold">{number}</div>
      <div className="flex justify-between items-center text-sm w-full">
        <div>So với tháng trước: </div>
        <div
          className={`font-bold ${
            parseFloat(status) >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}%
        </div>
      </div>
    </div>
  );
};

const BarChart = ({ chartData }) => {
  const backgroundColors = generateColorSet(chartData.values.length);
  return (
    <div className="w-full flex justify-center py-8 px-12">
      <Bar
        data={{
          labels: chartData.labels,
          datasets: [
            {
              label: "Khối lượng thép (kg)",
              backgroundColor: backgroundColors,
              data: chartData.values,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Biểu đồ thống kê tổng khối lượng nhập kho theo nhà cung cấp",
              font: {
                size: 14,
              },
              padding: {
                top: 5,
                bottom: 30,
              },
            },
          },
        }}
      />
    </div>
  );
};

const DoughnutChart = ({ chartData }) => {
  const backgroundColors = generateColorSet(chartData.values.length);
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Khối lượng (kg)",
        backgroundColor: backgroundColors,
        data: chartData.values,
      },
    ],
  };

  return (
    <div className="bg-white shadow-btn px-12 w-full rounded-lg flex justify-center">
      <Doughnut
        className="w-full scale-90"
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: { font: { size: 16 } },
            },
            title: {
              display: true,
              position: "top",
              text: chartData.name,
              font: {
                size: 16,
              },
              padding: {
                top: 5,
                bottom: 30,
              },
            },
          },
        }}
      />
    </div>
  );
};

const baseColors = [
  "#3195ff",
  "#3cba9f",
  "pink",
  "#c45850",
  "#ffcc00",
  "#9966ff",
  "#ff6666",
  "#00cc99",
  "#ff99cc",
  "#66ff66",
  "#0099cc",
  "#ff9933",
];

// Nếu cần thêm màu thì tạo mới màu HEX ngẫu nhiên
const generateColorSet = (count) => {
  const colors = [...baseColors];
  const usedColors = new Set(colors);

  while (colors.length < count) {
    let color;
    do {
      color =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
    } while (usedColors.has(color));
    usedColors.add(color);
    colors.push(color);
  }

  return colors.slice(0, count);
};
