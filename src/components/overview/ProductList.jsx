import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faMagnifyingGlass,
  faSquarePlus,
  faCircleMinus,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

const ProductList = () => {
  const [data, setData] = useState(Data);

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const rows = jsonData.slice(1).map((row, index) => ({
        id: index + 1,
        code: row[0] || "",
        name: row[1] || "",
        unit: row[2] || "",
        length: row[3] || "",
        quantity: row[4] || "",
        total: row[5] || "",
        note: "",
        option: "",
      }));

      setData(rows);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex rounded-full bg-white shadow-btn py-2 px-4 w-[350px] items-center gap-4">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600" />
          <input
            type="text"
            placeholder="Tìm kiếm mã hàng hóa, tên hàng hóa"
            className="outline-0 w-full"
          />
        </div>
        <div className="flex gap-4">
          <label className="flex bg-white shadow-btn py-2 px-4 items-center gap-4 rounded-sm cursor-pointer">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
            <span className="font-medium">Nhập từ Excel</span>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImportExcel}
              className="hidden"
            />
          </label>

          <div className="flex bg-white shadow-btn py-2 px-4 items-center gap-4 rounded-sm">
            <FontAwesomeIcon icon={faSquarePlus} />
            <span className="font-medium">Thêm hàng hóa</span>
          </div>
        </div>
      </div>

      <TableList data={data} />
    </div>
  );
};

const TableList = ({ data }) => {
  return (
    <div className="mt-6">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-black py-0.5">STT</th>
            <th className="border border-black">Mã hàng</th>
            <th className="border border-black w-[30%]">Tên hàng</th>
            <th className="border border-black">Đơn trọng</th>
            <th className="border border-black">Dài</th>
            <th className="border border-black">Số lượng</th>
            <th className="border border-black w-[15%]">Tổng khối lượng</th>
            <th className="border border-black w-[10%]">Ghi chú</th>
            <th className="border border-black">Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border border-black text-center">{item.id}</td>
              <td className="border border-black text-center">{item.code}</td>
              <td className="border border-black text-center">{item.name}</td>
              <td className="border border-black text-center">{item.unit}</td>
              <td className="border border-black text-center">{item.length}</td>
              <td className="border border-black text-center">
                {item.quantity}
              </td>
              <td className="border border-black text-center">{item.total}</td>
              <td className="border border-black text-center">
                <input type="text" className="w-full text-center" />
              </td>
              <td className="border border-black text-center py-1">
                <FontAwesomeIcon
                  icon={faCircleMinus}
                  className="px-2 text-red-600"
                />
                <FontAwesomeIcon icon={faPenToSquare} className="px-2" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Dữ liệu mặc định ban đầu
const Data = [
  {
    id: 1,
    code: "CD19029H",
    name: "",
    unit: "",
    length: "",
    quantity: "",
    total: "",
    note: "",
    option: "",
  },
  {
    id: 2,
    code: "",
    name: "",
    unit: "",
    length: "",
    quantity: "",
    total: "",
    note: "",
    option: "",
  },
];

export default ProductList;
