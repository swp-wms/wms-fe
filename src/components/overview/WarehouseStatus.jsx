import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAnglesUp, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import {
  fetchWarehouses,
  fetchWarehousesByDate,
} from "../../backendCalls/warehouse";
// import ImportExcel from "./ImportExcel";

const getColorByPercentage = (percentage) => {
  if (percentage < 40) return "#e8f5e9";
  if (percentage < 80) return "#fff9c4";
  return "#ffddd9";
};

const WaterTank = ({ title, percentage, color, weight }) => {
  const fillColor = color || getColorByPercentage(percentage);
  return (
    <div className="flex flex-col items-start">
      <p className="mb-8 text-sm font-medium">{title}</p>
      <div className="relative w-full h-60 border-2 border-t-0 rounded-b-lg overflow-hidden shadow">
        <div
          className="absolute bottom-0 w-full transition-all duration-500 border-t"
          style={{
            height: `${percentage}%`,
            backgroundColor: fillColor,
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 font-bold">
          <span className="text-3xl">{percentage}% </span>
          <span className="text-xl">({weight} kg)</span>
        </div>
      </div>
    </div>
  );
};

const WarehouseStatus = () => {
  const today = new Date().toISOString().split("T")[0];
  const [actual, setActual] = useState(0);
  const [actualWeight, setActualWeight] = useState(0);
  // const [selectedDate, setSelectedDate] = useState(() => {
  //   const today = new Date();
  //   const yyyy = today.getFullYear();
  //   const mm = String(today.getMonth() + 1).padStart(2, "0");
  //   const dd = String(today.getDate()).padStart(2, "0");
  //   return `${yyyy}-${mm}-${dd}`;
  // });
  const [selectedDate, setSelectedDate] = useState(today);
  const [estimated, setEstimated] = useState(0);
  const [estimatedWeight, setEstimatedWeight] = useState(0);

  const difference = estimated - actual;

  let changeLabel = "";
  let icon = faLayerGroup;
  if (difference > 0) {
    icon = faAnglesUp;
    changeLabel = `Tăng ${difference.toFixed(4)}%`;
  } else if (difference < 0) {
    icon = faAnglesDown;
    changeLabel = `Giảm ${Math.abs(difference.toFixed(4))}%`;
  } else changeLabel = "Không thay đổi";

  useEffect(() => {
    const getData = async () => {
      const response = await fetchWarehouses();
      if (response && response[0]) {
        const percent = parseFloat(response[0].percent.toFixed(4));
        const weight = parseFloat(response[0].sum.toFixed(2));
        setActual(percent);
        setActualWeight(weight);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (!selectedDate) return;
      const response = await fetchWarehousesByDate(selectedDate);
      if (response) {
        setEstimated(response.percent_future.toFixed(4));
        setEstimatedWeight(response.totalFuture.toFixed(2));
      }
    };
    getData();
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-5 gap-14 py-8 items-center">
      <div className="col-span-2">
        {actual && actualWeight && (
          <WaterTank
            title={`Sức chứa kho còn lại thực tế: ${
              15000000 - actualWeight
            } kg`}
            percentage={actual}
            weight={actualWeight}
          />
        )}
      </div>

      <div className="text-center text-lg font-semibold text-gray-700">
        <span className="font-bold flex flex-col">
          <span className="text-nowrap">Sức chứa tối đa</span>
          <span>15.000.000 kg</span>
        </span>
        <div className="mt-2">
          <FontAwesomeIcon
            icon={icon}
            className="mr-2 translate-y-1 animate-bounce"
          />
          {changeLabel}
        </div>
      </div>

      <div className="col-span-2">
        <div className="flex justify-between mb-2 items-center gap-6">
          <span className="text-sm font-medium">
            Sức chứa kho còn lại ước tính: {15000000 - estimatedWeight} kg
          </span>

          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="border rounded px-2 py-1 text-sm shadow-sm w-32"
            />
          </div>
        </div>
        <div className="-translate-y-2">
          <WaterTank percentage={estimated} weight={estimatedWeight} />
        </div>
      </div>
    </div>
  );
};

export default WarehouseStatus;
