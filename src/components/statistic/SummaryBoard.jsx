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

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Data = [
  {
    number: 1000,
    title: "Tổng số lượng hàng xuất",
    status: "-16.5%",
  },
  {
    number: 1200,
    title: "Tổng số lượng hàng nhập",
    status: "-16.5%",
  },
  {
    number: 10500,
    title: "Tổng khối lượng hàng xuất",
    status: "+8.2%",
  },
  {
    number: 15000,
    title: "Tổng khối lượng hàng nhập",
    status: "+12.4%",
  },
];

const SummaryBoard = () => {
  const [importBars, setImportBars] = useState(0);
  const [importWeight, setImportWeight] = useState(0);
  const [importBarsPercent, setImportBarsPercent] = useState(0);
  const [importWeightPercent, setImportWeightPercent] = useState(0);
  const [exportBars, setExportBars] = useState(0);
  const [exportWeight, setExportWeight] = useState(0);
  const [exportBarsPercent, setExportBarsPercent] = useState(0);
  const [exportWeightPercent, setExportWeightPercent] = useState(0);

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

  return (
    <>
      <div className="grid grid-cols-4 gap-14 mb-10">
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
      <div className="flex gap-14">
        <DoughnutChart />
        <div className="bg-white shadow-btn rounded-lg w-full flex justify-center">
          <BarChart />
        </div>
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

const BarChart = () => {
  return (
    <div className="w-full scale-90 ms-2">
      <Bar
        data={{
          labels: [
            "Công ty thép Đức Anh",
            "Công ty TNHH thép Hòa Phát Hưng Yên",
            "Công ty TNHH thép Kyoei Việt Nam",
            "Công ty CP Tập Đoàn VAS Nghi Sơn",
            "Công ty Cổ phần thép Việt Ý",
            "Công Ty TNHH sản xuất và kinh doanh Thép Việt Đức",
            "Công ty cổ phần thép Việt Nhật",
            "Công ty TNHH Thép Tung Ho Việt Nam",
            "Thép Tung Dịch Hai Duong",
            "Công ty thép Đức Anh ProMax",
          ],
          datasets: [
            {
              label: "Khối lượng thép (kg)",
              backgroundColor: [
                "#c45850",
                "#3195ff",
                "yellow",
                "green",
                "orange",
                "purple",
                "pink",
                "brown",
                "gray",
                "black",
              ],
              data: [2478, 5267, 734, 784, 433, 1104, 675, 979, 406, 509],
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
            },
          },
        }}
      />
    </div>
  );
};

const DoughnutChart = () => {
  return (
    <div className="bg-white shadow-btn py-4 px-5 rounded-lg">
      <Doughnut
        data={{
          labels: [
            "Thép Việt Mỹ (thanh)",
            "Thép Hóa Phát (thanh)",
            "Thép Việt Mỹ (cuộn)",
            "Thép Hòa Phát (cuộn)",
          ],
          datasets: [
            {
              label: "Khối lượng (kg)",
              backgroundColor: ["#3195ff", "#3cba9f", "pink", "#c45850"],
              data: [2478, 734, 784, 433],
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true, position: "bottom" },
            title: {
              display: true,
              position: "top",
              text: "Biểu đồ thống kê tổng khối lượng thép",
            },
          },
          width: 400,
          height: 400,
        }}
      />
    </div>
  );
};
