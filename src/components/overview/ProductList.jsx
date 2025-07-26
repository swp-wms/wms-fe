import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Spreadsheet from "react-spreadsheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faMagnifyingGlass,
  faSquarePlus,
  faPenToSquare,
  faClockRotateLeft,
  faXmark,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import {
  fetchProductCatalog,
  addProduct,
  viewProductHistory,
} from "../../backendCalls/productCatalog";
import ProductEdit from "./ProductEdit";
import { fetchCatalog } from "../../backendCalls/catalog";
import toast from "react-hot-toast";
import moment from "moment";
import { getAllUsers } from "../../backendCalls/user";
import { fetchPartners } from "../../backendCalls/partner";

const headers = [
  { value: "Mã hàng hóa", readOnly: true, className: "font-bold" },
  { value: "Tên hàng hóa", readOnly: true, className: "font-bold" },
  { value: "Tên đối tác", readOnly: true, className: "font-bold" },
  {
    value: "Tên hãng thép",
    readOnly: true,
    className: "font-bold",
  },
  { value: "Loại thép", readOnly: true, className: "font-bold" },
  { value: "Mã thép", readOnly: true, className: "font-bold" },
  { value: "Số lượng", readOnly: true, className: "font-bold" },
  { value: "Độ dài", readOnly: true, className: "font-bold" },
  {
    value: "Khối lượng bó",
    readOnly: true,
    className: "font-bold",
  },
  { value: "Số thanh/bó", readOnly: true, className: "font-bold" },
  {
    value: "Tổng khối lượng",
    readOnly: true,
    className: "font-bold",
  },
  { value: "Mã đối tác", readOnly: true, className: "font-bold" },
];

const ProductList = ({ user }) => {
  const [partners, setPartners] = useState([]);
  const [productCatalog, setProductCatalog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [excelProducts, setExcelProducts] = useState([]);
  const [showExcelConfirm, setShowExcelConfirm] = useState(false);
  const [history, setHistory] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [data, setData] = useState([]);

  // Fetch partner data
  useEffect(() => {
    const getData = async () => {
      const response = await fetchPartners();
      setPartners(response);
      console.log(response);
    };
    getData();
  }, []);

  // Fetch user data
  useEffect(() => {
    const getData = async () => {
      const response = await getAllUsers();
      setUserInfo(response.data);
      console.log(response.data);
    };
    getData();
  }, []);

  // Fetch product data
  useEffect(() => {
    const getData = async () => {
      const response = await fetchProductCatalog();
      const userResponse = await getAllUsers();
      setProductCatalog(response);
      setUserInfo(userResponse.data);
      console.log(response);
      console.log(userResponse.data);
    };
    getData();
  }, []);

  // Fetch catalog data
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

  // Handle add new product
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

  // Handle update product
  const handleUpdateProduct = (updatedProduct) => {
    console.log("Updated Product:", updatedProduct);

    setProductCatalog((prev) => {
      if (!updatedProduct?.productid) {
        return [updatedProduct, ...prev];
      }

      const index = prev.findIndex(
        (p) => p.productid === updatedProduct.productid
      );

      if (index === -1) {
        return [updatedProduct, ...prev];
      }
      const updatedList = [...prev];
      updatedList[index] = updatedProduct;
      return updatedList;
    });
  };

  // Handle search
  const filteredData = productCatalog.filter((item) => {
    const name = item.pd?.toLowerCase() || "";
    const namedetail = item.namedetail?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || namedetail.includes(search);
  });

  // Handle pagination
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle import from Excel
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
        weightperbundle: Number(row["Khối lượng bó"] || 0),
        barsperbundle: Number(row["Số thanh/bó"] || 0),
        partner: row["Mã đối tác"] || "",
      }));

      const mapToSpreadsheetData = (products) => {
        return products.map((item) => {
          const pd = item.pd || "";
          const isValidPD = /^TD\d{2}CB\d{3}[TV]$/.test(pd);
          const steeltype = isValidPD ? `D${pd.slice(2, 4)}` : "";
          const namedetail = isValidPD ? `Thép ${pd.slice(1)}` : "";

          return [
            { value: pd, readOnly: false },
            { value: namedetail, readOnly: true, className: "bg-gray-100" },
            {
              value: item.name || "",
              readOnly: true,
              className: "bg-gray-100",
            },
            { value: item.brandname || "" },
            { value: item.type || "" },
            { value: steeltype, readOnly: true, className: "bg-gray-100" },
            {
              value: item.totalbar?.toString() || "0",
              readOnly: true,
              className: "bg-gray-100",
            },
            {
              value: item.length?.toString() || "0",
              readOnly: true,
              className: "bg-gray-100",
            },
            {
              value: item.weightperbundle?.toString() || "0",
              readOnly: true,
              className: "bg-gray-100",
            },
            {
              value: item.barsperbundle?.toString() || "0",
              readOnly: true,
              className: "bg-gray-100",
            },
            {
              value: item.totalweight,
              readOnly: true,
              className: "bg-gray-100",
            },
            { value: item.partner, readOnly: false },
          ];
        });
      };

      const spreadsheetData = [headers, ...mapToSpreadsheetData(mappedData)];

      setData(spreadsheetData);
      setShowExcelConfirm(true);
    };

    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  const addEmptyRow = () => {
    const newRow = headers.map((_, index) => ({
      value: "",
      readOnly: index === 1 || index === 5 || (index >= 6 && index <= 9),
      className:
        index === 1 || index === 5 || (index >= 6 && index <= 9)
          ? "bg-gray-100"
          : "",
    }));
    setData((prev) => [...prev, newRow]);
  };

  const deleteRow = (rowIndex) => {
    if (rowIndex === 0) return;
    setData((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  const convertSpreadsheetToProducts = (sheetData) => {
    return sheetData.slice(1).map((row) => {
      const pd = row[0]?.value?.trim() || "";
      const isValidPD = /^TD\d{2}CB\d{3}[TV]$/.test(pd);
      const namedetail = isValidPD ? `Thép ${pd.slice(1)}` : "";
      const steeltype = isValidPD ? `D${pd.slice(2, 4)}` : "";

      return {
        pd,
        namedetail,
        name: row[2]?.value?.trim() || "",
        brandname: row[3]?.value?.trim() || "",
        type: row[4]?.value?.trim() || "",
        steeltype,
        totalbar: Number(row[6]?.value) || 0,
        length: Number(row[7]?.value) || 0,
        weightperbundle: Number(row[8]?.value) || 0,
        barsperbundle: Number(row[9]?.value) || 0,
        totalwweight: Number(row[10]?.value) || "",
        partner: row[11]?.value?.trim() || "",
      };
    });
  };

  const validateSpreadsheetBeforeSubmit = (sheetData) => {
    const errors = [];

    sheetData.slice(1).forEach((row, i) => {
      const pd = row[0]?.value || "";
      const name = row[2]?.value || "";
      const brandname = row[3]?.value || "";
      const type = row[4]?.value || "";

      if (!/^TD\d{2}CB\d{3}[TV]$/.test(pd)) {
        errors.push(`Dòng ${i + 1}: Mã hàng hóa không đúng định dạng`);
      }
      if (!name) errors.push(`Dòng ${i + 1}: Thiếu tên đối tác`);
      if (!brandname) errors.push(`Dòng ${i + 1}: Thiếu tên hãng thép`);
      if (!type) errors.push(`Dòng ${i + 1}: Thiếu loại thép`);
    });

    return errors;
  };

  const handleConfirmImport = async () => {
    const errors = validateSpreadsheetBeforeSubmit(data);
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    const editedProducts = convertSpreadsheetToProducts(data);

    const existingKeySet = productCatalog.map((item) => ({
      pd: item.pd?.toLowerCase(),
      name: item.name?.toLowerCase(),
      brandname: item.brandname?.toLowerCase(),
      type: item.type?.toLowerCase(),
    }));

    const duplicates = editedProducts.filter((item) =>
      existingKeySet.some(
        (exist) =>
          exist.pd === item.pd?.toLowerCase() &&
          exist.name === item.name?.toLowerCase() &&
          exist.brandname === item.brandname?.toLowerCase() &&
          exist.type === item.type?.toLowerCase()
      )
    );

    if (duplicates.length > 0) {
      toast.error(`${duplicates.length} mặt hàng đã tồn tại`);
      return;
    }

    const successList = [];
    for (const product of editedProducts) {
      try {
        const productInfo = {
          pd: product.pd?.trim() || "",
          namedetail: product.namedetail?.trim() || "",
          name: product.name?.trim() || "",
          brandname: product.brandname?.trim() || "",
          type: product.type?.trim() || "",
          steeltype: product.steeltype?.trim() || "",
          totalbar: Number(product.totalbar) || 0,
          length: Number(product.length) || 0,
          weight: Number(product.weight) || 0,
          weightperbundle: Number(product.weightperbundle) || 0,
          barsperbundle: Number(product.barsperbundle) || 0,
          totalweight: Number(product.totalweight) || 0,
          partner: product.partner || "",
        };
        if (productInfo.weightperbundle && productInfo.barsperbundle) {
          productInfo.weight =
            productInfo.weightperbundle / productInfo.barsperbundle;
        }
        console.log("ProductInfo: ", productInfo);
        const savedProduct = await addProduct(productInfo);
        console.log("ProductAfter: ", productInfo);
        console.log("SavedProduct: ", savedProduct);
        const resultArray = Array.isArray(productInfo)
          ? productInfo
          : [productInfo];
        console.log("ResultArray: ", resultArray);
        successList.push(...resultArray);
        console.log("Product added:", savedProduct);
      } catch (err) {
        console.error("Lỗi khi thêm:", product, err);
        toast.error(`Lỗi khi thêm sản phẩm mã: ${product.pd}`);
      }
    }

    if (successList.length > 0) {
      setProductCatalog((prev) => [...successList, ...prev]);
      toast.success(`Đã thêm ${successList.length} mặt hàng vào hệ thống.`);
    }

    setShowExcelConfirm(false);
    setExcelProducts([]);
  };

  // Handle close pop up
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (selectedProduct && selectedProduct.productid) {
        const pd_history = await viewProductHistory(selectedProduct.productid);
        console.log("ProductID: ", selectedProduct.productid);

        setHistory(pd_history.data);
        console.log("History: ", pd_history);
      }
    };
    fetchHistory();
  }, [selectedProduct]);

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
        option={true}
        onViewHistory={(product) => {
          if (!product) return;
          setSelectedProduct(product);
          viewProductHistory(product.productid).then(setHistory);
          setOpenHistory(true);
        }}
      />

      {openHistory && selectedProduct && Array.isArray(history) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ms-[20%]">
          <div className="bg-white shadow-lg border rounded p-6 mb-6 relative">
            <button
              className="px-2 bg-red-800 rounded mb-4 hover:scale-105 transition duration-300 ease-in-out absolute top-2 right-2"
              onClick={() => {
                setOpenHistory(false);
                setHistory([]);
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="text-white font-medium"
                size="sm"
              />
            </button>

            <h2 className="text-lg font-semibold mb-2 text-red-800">
              Lịch sử thay đổi: {selectedProduct?.namedetail}
            </h2>
            <table className="w-full border-collapse text-sm text-center mt-2">
              <thead>
                <tr>
                  <th colSpan={2} className="border border-black px-2">
                    Số lượng
                  </th>
                  <th colSpan={2} className="border border-black px-2">
                    Khối lượng (kg)
                  </th>
                  <th rowSpan={2} className="border border-black px-2">
                    Người chỉnh sửa
                  </th>
                  <th rowSpan={2} className="border border-black px-2">
                    Thời gian chỉnh sửa
                  </th>
                </tr>
                <tr>
                  <th className="border border-black px-2">Trước đây</th>
                  <th className="border border-black px-2">Hiện tại</th>
                  <th className="border border-black px-2">Trước đây</th>
                  <th className="border border-black px-2">Hiện tại</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, idx) => (
                  <tr key={idx}>
                    <td className="border border-black px-2">
                      {entry.old_bars}
                    </td>
                    <td className="border border-black px-2">
                      {entry.new_bars}
                    </td>
                    <td className="border border-black px-2">
                      {entry.old_weight}
                    </td>
                    <td className="border border-black px-2">
                      {entry.new_weight}
                    </td>
                    <td className="border border-black px-2">
                      {userInfo.map(
                        (user) =>
                          user.id === entry.warehousekeeperid && user.username
                      )}
                    </td>
                    <td className="border border-black px-2">
                      {moment(entry.update_time).format(
                        " HH:mm:ss - DD/MM/YYYY"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
          setProductCatalog={setProductCatalog}
        />
      )}

      {showExcelConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ms-[20%]">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-black mx-16 w-[80%] text-xs">
            <div className="flex justify-between mb-6">
              <h2 className="text-lg font-semibold ">Xác nhận thêm hàng hóa</h2>
              <div className="flex gap-4 text-white font-medium">
                <button
                  onClick={addEmptyRow}
                  className="bg-green-700 px-4 py-2 rounded-full shadow hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Thêm hàng mới
                </button>
                <button
                  onClick={() => deleteRow(data.length - 1)}
                  className="bg-red-700 px-4 py-2 rounded-full shadow hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                >
                  <FontAwesomeIcon icon={faMinus} className="mr-2" />
                  Xóa hàng cuối
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-auto scrollbar-hide">
              <Spreadsheet
                data={data}
                onChange={(newData) => {
                  const updatedData = [...newData];
                  const rawPartnerMap = {};
                  partners.forEach(({ id, name }) => {
                    rawPartnerMap[id] = name;
                  });

                  const partnerMap = Object.entries(rawPartnerMap).reduce(
                    (acc, [rawId, name]) => {
                      const cleanId = rawId.trim();
                      acc[cleanId] = name;
                      return acc;
                    },
                    {}
                  );
                  console.log("Map", partnerMap);

                  for (let row = 1; row < updatedData.length; row++) {
                    const pdCell = updatedData[row][0];
                    const namedetailCell = updatedData[row][1];
                    const steeltypeCell = updatedData[row][5];
                    const partnerCell = updatedData[row][2];
                    const partnerIdCell = updatedData[row][11];

                    const pd = pdCell?.value?.trim() || "";
                    const match = /^TD(\d{2})CB\d{3}[TV]$/.exec(pd);

                    if (match) {
                      const size = match[1];
                      updatedData[row][1] = {
                        ...namedetailCell,
                        value: `Thép ${pd.slice(2)}`,
                        readOnly: true,
                        className: "bg-gray-100",
                      };
                      updatedData[row][5] = {
                        ...steeltypeCell,
                        value: `D${size}`,
                        readOnly: true,
                        className: "bg-gray-100",
                      };
                    } else {
                      updatedData[row][1] = {
                        ...namedetailCell,
                        value: "",
                        readOnly: true,
                        className: "bg-gray-100",
                      };
                      updatedData[row][5] = {
                        ...steeltypeCell,
                        value: "",
                        readOnly: true,
                        className: "bg-gray-100",
                      };
                    }

                    const partnerId = partnerIdCell?.value?.trim() || "";
                    console.log("partnerId", partnerId);
                    const partnerName = partnerMap[partnerId] || "";
                    console.log("partner", partnerName);
                    if (partnerId) {
                      updatedData[row][2] = {
                        ...partnerCell,
                        value: partnerName,
                        readOnly: true,
                        className: "bg-gray-100",
                      };
                    } else {
                      updatedData[row][2] = {
                        ...partnerCell,
                        value: "",
                        readOnly: true,
                        className: "bg-gray-100",
                      };
                    }
                  }

                  setData(updatedData);
                }}
              />
            </div>

            <p className="py-6">
              Bạn có chắc chắn muốn thêm <strong>{data.slice(1).length}</strong> mặt hàng
              từ file Excel không?
            </p>
            <div className="flex justify-end gap-4 font-medium">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  setShowExcelConfirm(false);
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

const TableList = ({
  data,
  onEdit,
  setSelectedProduct,
  option,
  onViewHistory,
}) => {
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
            {/* <th className="border border-black">Khối lượng bó</th>
            <th className="border border-black">Số thanh/bó</th> */}
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
            {option && <th className="border border-black">Tùy chọn</th>}
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
                {/* <td className="border border-black px-2">
                  {item.weightperbundle}
                </td>
                <td className="border border-black px-2">
                  {item.barsperbundle}
                </td> */}
                <td className="border border-black px-2">{length}</td>
                <td className="border border-black px-2">
                  {(Number(weight) || 0).toFixed(2)}
                </td>
                <td className="border border-black">
                  {(Number(item.totalweight) || 0).toFixed(2)}
                </td>
                {option && (
                  <td className="border border-black text-center space-y-0.5 py-1">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="px-2 cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
                      onClick={() => {
                        onEdit(item), setSelectedProduct(item);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faClockRotateLeft}
                      className="px-2 cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
                      onClick={() => {
                        if (onViewHistory) onViewHistory(item);
                      }}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
