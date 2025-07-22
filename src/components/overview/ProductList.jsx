import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faMagnifyingGlass,
  faSquarePlus,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  fetchProductCatalog,
  addProduct,
} from "../../backendCalls/productCatalog";
import ProductEdit from "./ProductEdit";
import { fetchCatalog } from "../../backendCalls/catalog";
import toast from "react-hot-toast";

const ProductList = ({ user }) => {
  const [productCatalog, setProductCatalog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [excelProducts, setExcelProducts] = useState([]);
  const [showExcelConfirm, setShowExcelConfirm] = useState(false);

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
      if (index === -1) {
        return [...prev, updatedProduct];
      }
      const updatedList = [...prev];
      updatedList[index] = updatedProduct;
      return updatedList;
    });
  };

  const filteredData = productCatalog.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const namedetail = item.namedetail?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || namedetail.includes(search);
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const rawData = XLSX.utils.sheet_to_json(ws);

      const mappedData = rawData.map((row) => ({
        pd: row["Mã hàng hóa"] || "",
        type: row["Loại thép"] || "",
        brandname: row["Tên hãng thép"] || "",
        name: row["Tên đối tác"] || row["Đối tác"] || "",
        namedetail: row["Tên hàng hóa"] || "",
        steeltype: row["Mã thép"] || "",
        totalbar: Number(row["Số lượng"] || 0),
        length: Number(row["Độ dài"] || 0),
        weight: Number(row["Đơn trọng"] || 0),
        totalweight: Number(row["Tổng khối lượng"] || 0),
      }));

      setExcelProducts(mappedData);
      setShowExcelConfirm(true);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleConfirmImport = async () => {
    const generateKey = (item) => item;
    const existingKeySet = productCatalog.map(generateKey);
    console.log(existingKeySet);

    const newItems = [];
    const duplicates = [];

    console.log("Excel products:", excelProducts);
    for (const item of excelProducts) {
      const key = generateKey(item);
      console.log("Key: ", key);

      if (
        existingKeySet.some(
          (existingKey) =>
            existingKey.pd?.trim().toLowerCase() ===
              key.pd?.trim().toLowerCase() &&
            existingKey.name?.trim().toLowerCase() ===
              key.name?.trim().toLowerCase() &&
            existingKey.brandname?.trim().toLowerCase() ===
              key.brandname?.trim().toLowerCase() &&
            existingKey.type?.trim().toLowerCase() ===
              key.type?.trim().toLowerCase()
        )
      ) {
        duplicates.push(item);
        console.log("Sản phẩm trùng mã:", item);
      } else {
        newItems.push(item);
        existingKeySet.push(key);
        console.log("Sản phẩm gửi lên:", item);
      }
    }

    if (duplicates.length > 0) {
      toast.error(`${duplicates.length} mặt hàng đã tồn tại trong hệ thống`);
    }

    if (newItems.length === 0) {
      setShowExcelConfirm(false);
      setExcelProducts([]);
      return;
    }

    const successList = [];
    for (const product of newItems) {
      console.log("Product: ", product);
      try {
        const savedProduct = await addProduct(product);
        console.log("Product added:", savedProduct);
        successList.push(savedProduct);
      } catch (err) {
        console.error("Lỗi khi thêm:", product, err);
        toast.error(`Lỗi khi thêm sản phẩm mã: ${product.pd}`);
      }
    }

    if (successList.length > 0) {
      setProductCatalog((prev) => [...prev, ...successList]);
      toast.success(`Đã thêm ${successList.length} mặt hàng vào hệ thống.`);
    }

    setShowExcelConfirm(false);
    setExcelProducts([]);
  };
  
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
        {user?.roleid === 3 && (
          <div className="flex gap-4">
            <label className="flex bg-white shadow-btn py-2 px-4 items-center gap-4 rounded-sm cursor-pointer">
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
              <span className="font-medium">Nhập từ Excel</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            <button
              className="flex bg-white shadow-btn py-2 px-4 items-center gap-4 rounded-sm cursor-pointer"
              onClick={handleAddNew}
            >
              <FontAwesomeIcon icon={faSquarePlus} />
              <span className="font-medium">Thêm hàng hóa</span>
            </button>
          </div>
        )}
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
          user={user}
        />
      )}
      {showExcelConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ms-[20%] ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] border border-black">
            <h2 className="text-lg font-semibold mb-4">
              Xác nhận thêm hàng hóa
            </h2>
            <p>
              Bạn có chắc chắn muốn thêm <strong>{excelProducts.length}</strong>{" "}
              mặt hàng từ file Excel không?
            </p>
            <div className="mt-4 flex justify-end gap-4 font-medium">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  setShowExcelConfirm(false);
                  setExcelProducts([]);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-800 text-white rounded hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                onClick={handleConfirmImport}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
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
