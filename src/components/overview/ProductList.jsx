import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faMagnifyingGlass,
  faSquarePlus,
  faCircleMinus,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { fetchProductCatalog } from "../../backendCalls/productCatalog";
import ProductEdit from "./ProductEdit";

const ITEMS_PER_PAGE = 15;

const ProductList = () => {
  const [productCatalog, setProductCatalog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await fetchProductCatalog();
      setProductCatalog(response);
    };
    getData();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setProductCatalog((prev) => [...prev, ...data]);
      setCurrentPage(1);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSaveEdit = (updatedProduct) => {
    setProductCatalog((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item
      )
    );
    setEditingProduct(null);
  };

  const filteredData = productCatalog.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const namedetail = item.namedetail?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || namedetail.includes(search);
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section>
      <div className="flex justify-between">
        <div className="flex rounded-full bg-white shadow-btn py-2 px-4 w-[350px] items-center gap-4">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600" />
          <input
            type="text"
            placeholder="Tìm kiếm mã hàng hóa, tên hàng hóa"
            className="outline-0 w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex gap-4">
          <label className="flex bg-white shadow-btn py-2 px-4 items-center gap-4 rounded-sm cursor-pointer">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
            <span className="font-medium">Nhập từ Excel</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>

          <div className="flex bg-white shadow-btn py-2 px-4 items-center gap-4 rounded-sm" onClick={editingProduct}>
            <FontAwesomeIcon icon={faSquarePlus} />
            <span className="font-medium">Thêm hàng hóa</span>
          </div>
        </div>
      </div>

      <TableList data={paginatedData} onEdit={setEditingProduct} />

      <div className="flex justify-center mt-2 gap-2 mb-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Trang trước
        </button>
        <span className="px-3 py-1">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Trang sau
        </button>
      </div>

      {editingProduct && (
        <ProductEdit
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveEdit}
        />
      )}
    </section>
  );
};

const TableList = ({ data, onEdit }) => {
  return (
    <div className="mt-6">
      <table className="w-full border-collapse text-sm mb-12 text-center">
        <thead>
          <tr>
            <th className="border border-black px-1">STT</th>
            <th className="border border-black px-1">Mã hàng hóa</th>
            <th className="border border-black">Tên hàng hóa</th>
            <th className="border border-black">Tên nhà cung</th>
            <th className="border border-black">Loại thép</th>
            <th className="border border-black">Mã thép</th>
            <th className="border border-black">Số lượng </th>
            <th className="border border-black">
              Độ dài <br />
              (m)
            </th>
            <th className="border border-black">
              Đơn trọng <br />
              (kg)
            </th>
            <th className="border border-black py-2">
              Tổng khối lượng <br /> (kg)
            </th>
            <th className="border border-black">Ghi chú</th>
            <th className="border border-black">Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const length = item.catalog
              ? item.catalog.length
              : item.length || 0;
            const weight = item.catalog
              ? item.catalog.weightperbundle / item.catalog.barsperbundle
              : item.weight || 0;
            const totalWeight = item.catalog
              ? item.totalbar * weight
              : item.total || 0;

            return (
              <tr key={item.id || index}>
                <td className="border border-black py-0.5">{index + 1}</td>
                <td className="border border-black">{item.name}</td>
                <td className="border border-black">{item.namedetail}</td>
                <td className="border border-black">{item.brandname}</td>
                <td className="border border-black">{item.type}</td>
                <td className="border border-black">{item.steeltype}</td>
                <td className="border border-black">{item.totalbar}</td>
                <td className="border border-black">{length}</td>
                <td className="border border-black">{weight.toFixed(2)}</td>
                <td className="border border-black">
                  {totalWeight.toFixed(2)}
                </td>
                <td className="border border-black">{item.note}</td>
                <td className="border border-black text-center py-1">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="px-2 cursor-pointer"
                    onClick={() => onEdit(item)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
