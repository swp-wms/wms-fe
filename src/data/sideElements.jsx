import {
  faHouse,
  faInbox,
  faRightFromBracket,
  faChartSimple,
  faTruckFast,
  faFile,
  faShapes,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";

const sideElement = [
  {
    id: 0,
    icon: faHouse,
    path: "/",
    name: "Trang chủ",
    allowed: [1, 3, 4, 5]
  },
    {
      id: 1,
      icon: faShapes,
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
      allowed: [3, 4, 5]
    },
    {
      id: 6,
      icon: faHandshake,
      path: "/thong-tin-doi-tac",
      name: "Thông tin đối tác",
      allowed: [3, 4, 5]
    },
    {
      id: 7,
      icon: faFile,
      path: "/cac-loai-don-tu-khac",
      name: "Các loại đơn từ khác",
      allowed: [3, 4, 5]
    }, {
      id: 8,
      icon: faFile,
      path: "/danh-sach-nguoi-dung",
      name: "Danh sách người dùng",
      allowed: [1]
    }
  ];
  
  export default sideElement