import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faMagnifyingGlass,
  faSquarePlus,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { fetchProductCatalog } from "../../backendCalls/productCatalog";
import ProductEdit from "./ProductEdit";
import { fetchCatalog } from "../../backendCalls/catalog";

const ProductList = () => {
  const [productCatalog, setProductCatalog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await fetchProductCatalog();
      setProductCatalog(response);
      console.log(response);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const response = await fetchCatalog();
      setCatalog(response);
      console.log(response);
    };
    getData();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleAddNew = () => {
    const emptyProduct = {
      id: null,
      name: "",
      namedetail: "",
      brandname: "",
      type: "Thép Thanh",
      steeltype: "",
      totalbar: 0,
      length: 0,
      weight: 0,
      total: 0,
      note: "",
      catalog: null,
    };
    setSelectedProduct(emptyProduct);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProductCatalog((prev) => {
      const index = prev.findIndex((p) => p.id === updatedProduct.id);
      // Nếu sản phẩm mới (chưa có id trong list), thêm vào
      if (index === -1) {
        return [...prev, updatedProduct];
      }
      // Nếu đã có, cập nhật
      const updatedList = [...prev];
      updatedList[index] = updatedProduct;
      return updatedList;
    });
  };

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

  const filteredData = productCatalog.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const namedetail = item.namedetail?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || namedetail.includes(search);
  });

  const ITEMS_PER_PAGE = 15;
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

          <button
            className="flex bg-white shadow-btn py-2 px-4 items-center gap-4 rounded-sm cursor-pointer"
            onClick={handleAddNew}
          >
            <FontAwesomeIcon icon={faSquarePlus} />
            <span className="font-medium">Thêm hàng hóa</span>
          </button>
        </div>
      </div>

      <TableList
        data={paginatedData}
        onEdit={handleEdit}
        setSelectedProduct={setSelectedProduct}
      />

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

      {open && selectedProduct && (
        <ProductEdit
          product={selectedProduct}
          onClose={handleClose}
          onUpdate={handleUpdateProduct}
          catalog={catalog}
        />
      )}
    </section>
  );
};

const TableList = ({ data, onEdit, setSelectedProduct }) => {
  return (
    <div className="mt-6">
      <table className="w-full border-collapse text-sm mb-12 text-center">
        <thead>
          <tr>
            <th className="border border-black px-1">STT</th>
            <th className="border border-black px-1">Mã hàng hóa</th>
            <th className="border border-black">Tên hàng hóa</th>
            <th className="border border-black">Tên đối tác</th>
            <th className="border border-black">Tên hãng thép</th>
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
            const length = item ? item.length : item.length || 0;
            const weight = item
              ? item.weightperbundle / item.barsperbundle
              : item.weight || 0;
            // const totalWeight = item ? item.totalbar * weight : item.total || 0;

            return (
              <tr key={index}>
                <td className="border border-black py-0.5">{index + 1}</td>
                <td className="border border-black px-2">{item.pd}</td>
                <td className="border border-black">{item.namedetail}</td>
                <td className="border border-black px-2">{item.name}</td>
                <td className="border border-black px-2">{item.brandname}</td>
                <td className="border border-black px-2">{item.type}</td>
                <td className="border border-black px-2">{item.steeltype}</td>
                <td className="border border-black px-2">{item.totalbar}</td>
                <td className="border border-black px-2">{length}</td>
                <td className="border border-black px-2">
                  {weight.toFixed(2)}
                </td>
                <td className="border border-black">
                  {(Number(item.totalweight) || 0).toFixed(2)}
                </td>

                <td className="border border-black">{item.note}</td>
                <td className="border border-black text-center py-1">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="px-2 cursor-pointer"
                    onClick={() => {
                      onEdit(item), setSelectedProduct(item);
                    }}
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
