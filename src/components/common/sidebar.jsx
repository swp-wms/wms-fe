import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouse,
  faInbox,
  faRightFromBracket,
  faChartSimple,
  faTruckFast,
  faFile,
  faCircleUser,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";

const sideElement = [
  {
    id: 1,
    icon: faHouse,
    path: "/tong-quan-kho",
    name: "Tổng quan kho",
  },
  {
    id: 2,
    icon: faInbox,
    path: "/nhap-hang",
    name: "Nhập hàng",
  },
  {
    id: 3,
    icon: faRightFromBracket,
    path: "/xuat-hang",
    name: "Xuất hàng",
  },
  {
    id: 4,
    icon: faChartSimple,
    path: "/thong-ke-kho",
    name: "Thống kê kho",
  },
  {
    id: 5,
    icon: faTruckFast,
    path: "/ke-hoach-van-chuyen",
    name: "Kế hoạch vận chuyển",
  },
  {
    id: 6,
    icon: faFile,
    path: "/cac-loai-don-tu-khac",
    name: "Các loại đơn từ khác",
  },
];

const role = [
  {
    id: 1,
    name: "Salesman",
  },
  {
    id: 2,
    name: "Warehouse Keeper",
  },
];
const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen w-1/6 fixed bg-white px-4 shadow-lg justify-between">
      <div className="">
        <div className="flex flex-row items-center justify-between py-4 ">
          <img src="/logo.png" className="w-1/2" />
          <FontAwesomeIcon icon={faBars} className="w-1/5" />
        </div>
        <hr className="opacity-10" />
        <ul className="flex flex-col gap-2 mt-8">
          {sideElement.map((item) => (
            <li
              key={item.id}
              className=" text-gray-600 py-2 hover-btn"
            >
              <FontAwesomeIcon icon={item.icon} className="w-1/5" />
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4 flex flex-row items-center justify-between">
        <div className="flex flex-row rounded-full bg-white shadow-btn p-2 w-fit justify-between items-center gap-2">
          <FontAwesomeIcon icon={faCircleUser} size="xl" />
          <span className="px-3 font-medium">
            {role.filter((item) => item.id === 1)[0].name}
          </span>
        </div>
        <div className="rounded-full bg-red-500 size-8 flex items-center justify-center shadow-btn">
          <FontAwesomeIcon icon={faPowerOff} color="white" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
