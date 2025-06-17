import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAnglesUp } from "@fortawesome/free-solid-svg-icons";
import { fetchWarehouses } from "../../backendCalls/warehouse";
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
          <span className=" text-xl">({weight} kg)</span>
        </div>
      </div>
    </div>
  );
};

const WarehouseStatus = () => {
  const [actual, setActual] = useState(0);
  const [actualWeight, setActualWeight] = useState(0);
  const estimated = 80;
  const difference = estimated - actual;

  let changeLabel = "";
  let icon = "";
  if (difference > 0) {
    icon = faAnglesUp;
    changeLabel = `Tăng ${difference.toFixed(2)}%`;
  } else if (difference < 0) {
    icon = faAnglesDown;
    changeLabel = `Giảm ${Math.abs(difference.toFixed(2))}%`;
  } else changeLabel = "Không thay đổi";

  useEffect(() => {
    const getData = async () => {
      const response = await fetchWarehouses();
      setActual(response[0].percent.toFixed(2));
      setActualWeight((response[0].sum*0.001).toFixed(2));
    };
    getData();
  }, []);

  return (
    <div className="grid grid-cols-5 gap-14 py-8 items-center">
      <div className="col-span-2">
        {actual && actualWeight && (
          <WaterTank
            title={`Sức chứa kho còn lại thực tế: ${15000000-actualWeight} kg`}
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
            className="mr-4 translate-y-1 animate-bounce"
          />
          {changeLabel}
        </div>
      </div>

      <div className="col-span-2">
        <div className="flex justify-between mb-2 items-center gap-6">
          <span className="text-sm font-medium">
            Sức chứa kho còn lại ước tính: {15000000-(15000000 * estimated) / 100} kg 
          </span>
          
          <input
            type="date"
            className="border rounded px-2 py-1 text-xs shadow-sm w-28"
          />
        </div>
        <div className="-translate-y-2">
          <WaterTank
            percentage={estimated}
            weight={(15000 * estimated) / 100}
          />
        </div>
      </div>
    </div>
  );
};

export default WarehouseStatus;
