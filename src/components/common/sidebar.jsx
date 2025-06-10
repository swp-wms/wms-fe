import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { handleLogout } from "../../backendCalls/user";

const sideElement = [
  {
    id: 1,
    icon: faHouse,
    path: "/tong-quan-kho",
    name: "Tổng quan kho",
    allowed: [3, 4]
  },
  {
    id: 2,
    icon: faInbox,
    path: "/nhap-hang",
    name: "Nhập hàng",
    allowed: [3, 4]
  },
  {
    id: 3,
    icon: faRightFromBracket,
    path: "/xuat-hang",
    name: "Xuất hàng",
    allowed: [3, 4]
  },
  {
    id: 4,
    icon: faChartSimple,
    path: "/thong-ke-kho",
    name: "Thống kê kho",
    allowed: [3]
  },
  {
    id: 5,
    icon: faTruckFast,
    path: "/ke-hoach-van-chuyen",
    name: "Kế hoạch vận chuyển",
    allowed: [3, 4]
  },
  {
    id: 6,
    icon: faFile,
    path: "/cac-loai-don-tu-khac",
    name: "Các loại đơn từ khác",
    allowed: [3, 4]
  }, {
    id: 7,
    icon: faFile,
    path: "/danh-sach-nguoi-dung",
    name: "Danh sách người dùng",
    allowed: [1]
  }
];

const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  const logout = async () => {
    await handleLogout();
    navigate('/dang-nhap');
  }
  return (
    <div className="flex flex-col h-screen w-[300px] bg-white px-6 shadow-lg justify-between">
      <div>
        <div className="flex flex-row items-center justify-between py-4 ">
          <img src="/logo.png" className="w-1/2" />
          <FontAwesomeIcon icon={faBars} className="w-1/5" />
        </div>
        <hr className="opacity-10" />
        <ul className="flex flex-col gap-2 mt-8">
          {sideElement.map((item) => {
            if (item.allowed.includes(user.roleid)) {

              return (
                <li
                  key={item.id}
                  className=" text-gray-600 py-2 hover-btn"
                >
                  <FontAwesomeIcon icon={item.icon} className="w-1/5" />
                  <Link to={item.path}>{item.name}</Link>
                </li>
              )
            }
          })}
        </ul>
      </div>

      <div className="mb-4 flex flex-row items-center justify-between">
        <div className="flex flex-row rounded-full bg-white shadow-btn p-2 w-fit justify-between items-center gap-2">
          <FontAwesomeIcon icon={faCircleUser} size="xl" />
          <span className="px-3 font-medium">
            {user.role.rolename}
          </span>
        </div>
        <div className="rounded-full bg-red-500 size-8 flex items-center justify-center shadow-btn">
          <FontAwesomeIcon icon={faPowerOff} onClick={logout} title="Logout" className="hover:cursor-pointer" color="white" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
