import { useEffect, useState } from "react";
import {
  getExportOrder,
  getExportWeight,
  getImportOrder,
  getImportWeight,
} from "../../backendCalls/order";
import moment from "moment/moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faNewspaper,
  faPaperPlane,
  faSquareXmark,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { getDeliveriesForOrder } from "../../backendCalls/delivery";
import { deliveryStatus } from "../../data/deliveryStatus";

const ImportHistory = () => {
  const [importHistory, setImportHistory] = useState([]);
  const [exportHistory, setExportHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [importWeight, setImportWeight] = useState([]);
  const [exportWeight, setExportWeight] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [hoveredOrder, setHoveredOrder] = useState(null);
  const [hoverType, setHoverType] = useState(null);
  const [deliveryByOrder, setDeliveryByOrder] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("");
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageImport, setCurrentPageImport] = useState(1);
  const [currentPageExport, setCurrentPageExport] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const getData = async () => {
      const response = await getImportOrder();
      setImportHistory(response);
      if (response.length > 0) {
        setSelectedDate("Tất cả");
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const response = await getExportOrder();
      setExportHistory(response);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const importResponse = await getImportWeight();
      const exportResponse = await getExportWeight();
      setImportWeight(importResponse);
      setExportWeight(exportResponse);
    };
    getData();
  }, []);

  useEffect(() => {
    const allPartners = [
      ...importHistory.map((item) => item.partner?.name),
      ...exportHistory.map((item) => item.partner?.name),
    ];
    setPartners([...new Set(allPartners.filter(Boolean))]);
  }, [importHistory, exportHistory]);

  const getDeliveryByOrder = async (orderId) => {
    const response = await getDeliveriesForOrder(orderId);
    console.log(response.data);
    setDeliveryByOrder(Array.isArray(response.data) ? response.data : []);
  };

  useEffect(() => {
    if (selectedOrder) {
      getDeliveryByOrder(selectedOrder);
    }
  }, []);

  const uniqueDates = [
    "Tất cả",
    ...new Set(
      importHistory
        .map((item) => moment(item.createdate))
        .sort((a, b) => b.valueOf() - a.valueOf())
        .map((date) => date.format("DD-MM-YYYY"))
    ),
  ];

  const selectedIndex = uniqueDates.findIndex((d) => d === selectedDate);

  const getOpacityClass = (index) => {
    const distance = Math.abs(index - selectedIndex);
    if (distance === 0) return "opacity-100 scale-105 z-10";
    if (distance === 1) return "opacity-80";
    if (distance === 2) return "opacity-60";
    if (distance === 3) return "opacity-40";
    return "opacity-20";
  };

  const filteredImportOrders = importHistory
    .filter((item) =>
      selectedDate !== "Tất cả"
        ? moment(item.createdate).format("DD-MM-YYYY") === selectedDate
        : true
    )
    .filter((item) => item.id?.toString().includes(searchKeyword))
    .filter((item) =>
      selectedPartner ? item.partner?.name === selectedPartner : true
    );

  const filteredExportOrders = exportHistory
    .filter((item) =>
      selectedDate !== "Tất cả"
        ? moment(item.createdate).format("DD-MM-YYYY") === selectedDate
        : true
    )
    .filter((item) => item.id?.toString().includes(searchKeyword))
    .filter((item) =>
      selectedPartner ? item.partner?.name === selectedPartner : true
    );

  const totalPagesImport = Math.ceil(
    filteredImportOrders.length / itemsPerPage
  );
  const totalPagesExport = Math.ceil(
    filteredExportOrders.length / itemsPerPage
  );

  const paginatedImportOrders = filteredImportOrders.slice(
    (currentPageImport - 1) * itemsPerPage,
    currentPageImport * itemsPerPage
  );

  const paginatedExportOrders = filteredExportOrders.slice(
    (currentPageExport - 1) * itemsPerPage,
    currentPageExport * itemsPerPage
  );

  useEffect(() => {
    setCurrentPageImport(1);
    setCurrentPageExport(1);
  }, [selectedDate, searchKeyword, selectedPartner]);

  const totalPages = Math.ceil(deliveryByOrder.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDeliveries = deliveryByOrder.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    if (selectedOrder) {
      setCurrentPage(1);
      getDeliveryByOrder(selectedOrder.id || selectedOrder);
    }
  }, [selectedOrder]);

  return (
    <div className="pt-4 absolute w-full left-1/2 -translate-x-1/2 px-16">
      <div className="flex justify-between gap-6 py-4 px-2 text-gray-500 font-medium">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          />
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="">Danh sách tên nhà cung cấp</option>
            {partners.map((partner) => (
              <option key={partner} value={partner}>
                {partner}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-5 bg-green-500 rounded shadow"></div>
            <p>Đơn hàng nhập</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-5 bg-red-500 rounded shadow"></div>
            <p>Đơn hàng xuất</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="flex flex-col gap-2 max-h-screen overflow-y-auto text-center overflow-hidden">
          {uniqueDates.map((date, index) => (
            <div
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`cursor-pointer px-4 py-2 rounded text-sm mx-2 my-1 hover:scale-105 transition-all duration-300
      ${
        selectedDate === date
          ? "bg-white shadow text-black font-semibold"
          : "bg-gray-100 text-gray-400 hover:text-black"
      }
      ${date !== "Tất cả" ? getOpacityClass(index) : "border"}
    `}
            >
              {date === "Tất cả" ? (
                <FontAwesomeIcon
                  icon={faNewspaper}
                  size="lg -translate-x-1 mr-1"
                />
              ) : (
                ""
              )}
              {date}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 col-span-2">
          {paginatedImportOrders.length > 0 ? (
            paginatedImportOrders.map((item) => (
              <div
                key={"import-" + item.id}
                onClick={() => {
                  setSelectedOrder(item);
                  setOrderType("import");
                  getDeliveryByOrder(item.id);
                }}
                onMouseEnter={(e) => {
                  setHoveredOrder({
                    ...item,
                  });
                  setHoverType("import");
                }}
                onMouseLeave={() => {
                  setHoveredOrder(null);
                  setHoverType(null);
                }}
                className="cursor-pointer border rounded-lg shadow-lg bg-white py-2 px-4 hover:scale-105 transition-all duration-300"
              >
                <p className="font-semibold text-lg text-green-600">
                  {item.partner.name}
                </p>
                <div className="text-gray-900 text-sm pt-2">
                  {importWeight
                    .filter((weight) => weight.orderid === item.id)
                    .map((weight) => (
                      <div key={weight.id}>
                        <div>
                          <span className="font-semibold">Mã đơn: </span>
                          <span>{weight.orderid}</span>
                        </div>
                        <div>
                          <span className="font-semibold">
                            Tổng khối lượng:{" "}
                          </span>
                          <span>{weight.totalweight} kg</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <p className="flex flex-col gap-2 text-gray-400 text-center items-center justify-center bg-white py-2 px-4 border-gray-700 shadow h-full rounded">
              <FontAwesomeIcon icon={faBoxOpen} size="2xl" />
              <span>Không có đơn nhập hàng trong ngày được chọn</span>
            </p>
          )}
          {totalPagesImport > 1 && (
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() =>
                  setCurrentPageImport((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPageImport === 1}
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              >
                Trang trước
              </button>
              <span className="text-sm py-1">
                Trang {currentPageImport} / {totalPagesImport}
              </span>
              <button
                onClick={() =>
                  setCurrentPageImport((prev) =>
                    Math.min(prev + 1, totalPagesImport)
                  )
                }
                disabled={currentPageImport === totalPagesImport}
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 col-span-2">
          {paginatedExportOrders.length > 0 ? (
            paginatedExportOrders.map((item) => (
              <div
                key={"export-" + item.id}
                onClick={() => {
                  setSelectedOrder(item);
                  setOrderType("export");
                  getDeliveryByOrder(item.id);
                }}
                onMouseEnter={(e) => {
                  setHoveredOrder({
                    ...item,
                  });
                  setHoverType("export");
                }}
                onMouseLeave={() => {
                  setHoveredOrder(null);
                  setHoverType(null);
                }}
                className="cursor-pointer border rounded-lg shadow-lg bg-white py-2 px-4 hover:scale-105 transition-all duration-300"
              >
                <p className="font-semibold text-lg text-red-600">
                  {item.partner.name}
                </p>
                <div className="text-gray-900 text-sm pt-2">
                  {exportWeight
                    .filter((weight) => weight.orderid === item.id)
                    .map((weight) => (
                      <div key={weight.id}>
                        <div>
                          <span className="font-semibold">Mã đơn: </span>
                          <span>{weight.orderid}</span>
                        </div>
                        <div>
                          <span className="font-semibold">
                            Tổng khối lượng:{" "}
                          </span>
                          <span>{weight.totalweight} kg</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <p className="flex flex-col gap-2 text-gray-400 text-center items-center justify-center bg-white py-2 px-4 border-gray-700 shadow h-full rounded">
              <FontAwesomeIcon icon={faBoxOpen} size="2xl" />
              <span>Không có đơn xuất hàng trong ngày được chọn</span>
            </p>
          )}
          {totalPagesExport > 1 && (
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() =>
                  setCurrentPageImport((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPageImport === 1}
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              >
                Trang trước
              </button>
              <span className="text-sm py-1">
                Trang {currentPageImport} / {totalPagesImport}
              </span>
              <button
                onClick={() =>
                  setCurrentPageImport((prev) =>
                    Math.min(prev + 1, totalPagesImport)
                  )
                }
                disabled={currentPageImport === totalPagesImport}
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </div>

      {hoveredOrder && (
        <div className="absolute -top-4 left-[30%] z-[120] h-screen flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-lg p-4 shadow-xl border w-[500px] pointer-events-auto">
            <h2
              className={`text-lg font-bold mb-2 text-center ${
                hoverType === "import" ? "text-green-600" : "text-red-600"
              }`}
            >
              Thông tin chi tiết
            </h2>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-semibold">Mã đơn hàng:</span>{" "}
                {hoveredOrder.id}
              </p>
              <p>
                <span className="font-semibold">Loại đơn:</span>{" "}
                {hoverType === "import" ? "Đơn nhập hàng" : "Đơn xuất hàng"}
              </p>
              <p>
                <span className="font-semibold">Ngày tạo:</span>{" "}
                {moment(hoveredOrder.createdate).format("DD-MM-YYYY")}
              </p>
              <div>
                {(hoverType === "import" ? importWeight : exportWeight)
                  .filter((w) => w.orderid === hoveredOrder.id)
                  .map((weight) => (
                    <p key={weight.id}>
                      <span className="font-semibold">Tổng khối lượng:</span>{" "}
                      {weight.totalweight} kg
                    </p>
                  ))}
              </div>
              <p>
                <span className="font-semibold">Tên nhà cung:</span>{" "}
                {hoveredOrder.partner?.name}
              </p>
              <p>
                <span className="font-semibold">Địa chỉ:</span>{" "}
                {hoveredOrder.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed top-0 left-0 bottom-0 flex items-center justify-center z-[150] w-full h-screen bg-[#00000017] transition-all duration-300">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl relative border -translate-y-16">
            <FontAwesomeIcon
              onClick={() => setSelectedOrder(null)}
              icon={faSquareXmark}
              className="absolute top-2 right-2 cursor-pointer text-red-700"
            />
            <h2
              className={`text-lg font-bold mb-4 uppercase w-fit px-4 text-white rounded shadow py-1 ${
                orderType === "import" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              Mã đơn hàng: {selectedOrder.id}
            </h2>

            {currentDeliveries.length > 0 ? (
              <div className="mt-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  {currentDeliveries.map((delivery) => (
                    <li key={delivery.id} className="border rounded p-2">
                      <p>
                        <span className="font-semibold">
                          Mã đơn vận chuyển:
                        </span>{" "}
                        {delivery.id}
                      </p>
                      <p>
                        <span className="font-semibold">Thời gian giao:</span>{" "}
                        {delivery.deliverytime || "Không có xe"}
                      </p>
                      <p>
                        <span className="font-semibold">Ngày giao hàng:</span>{" "}
                        {moment(delivery.deliverydate).format("DD-MM-YYYY")}
                      </p>

                      <p className="pt-2 pb-1">
                        <span className="font-semibold">Trạng thái:</span>{" "}
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold shadow"
                          style={{
                            backgroundColor: `${
                              deliveryStatus.find(
                                (status) =>
                                  status.id === delivery.deliverystatus
                              ).color
                            }
                            `,
                            color: `${
                              deliveryStatus.find(
                                (status) =>
                                  status.id === delivery.deliverystatus
                              ).text
                            }`,
                          }}
                        >
                          {
                            deliveryStatus.find(
                              (status) => status.id === delivery.deliverystatus
                            ).name
                          }
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="flex flex-col gap-2 text-gray-400 text-center items-center justify-center py-4 px-4 h-full rounded">
                <FontAwesomeIcon icon={faTruck} size="2xl" />
                <span>Chưa có thông tin giao hàng </span>
              </p>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                >
                  Trang trước
                </button>
                <span className="text-sm py-1">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportHistory;
