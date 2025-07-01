import React, { act, useState } from "react";
import supplement from "../../backendCalls/supplement";
import supplementType from "../../data/supplementType";

const SupplementOrderList = ({ supplementList, className = "" }) => {
  const [activeSupplementOrder, setActiveSupplementOrder] = useState();
  const [activeTable, setActiveTable] = useState();

  const total = (array, criteria) => {
    let sum = 0;
    array.forEach((item) => {
      if (item[criteria]) sum += item[criteria];
    });
    return sum;
  };

  const handleViewSupplementDetail = async (item) => {
    const response = await supplement.getSupplementById(item.id);

    setActiveSupplementOrder(response);
    setActiveTable(true);
  };

  return (
    <div className={className}>
      {supplementList != null && (
        <ul className="h-full overflow-y-auto">
          {supplementList.map((item, index) => (
            <div
              key={index}
              className="flex flex-row w-full p-3 mt-2 border-1 border-gray-200 rounded-lg shadow-lg"
            >
              {/* <li>
                                <div className=""><span className="font-medium ">Ngày tạo: </span>{item.createdate}</div>
                                <div 
                                <div className=""><span className="font-medium">Tổng số cây: </span>{total(item.detail,"numberofbars")}</div>
                                <div className=""><span className="font-medium">Tổng khối lượng: </span>{total(item.detail,"weight")}</div>
                            </li> */}

              <div class="flex-1">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                  <div class="flex items-center text-slate-800 font-semibold">
                    <span class="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path d="M12 11.993a.75.75 0 0 0-.75.75v.006c0 .414.336.75.75.75h.006a.75.75 0 0 0 .75-.75v-.006a.75.75 0 0 0-.75-.75H12ZM12 16.494a.75.75 0 0 0-.75.75v.005c0 .414.335.75.75.75h.005a.75.75 0 0 0 .75-.75v-.005a.75.75 0 0 0-.75-.75H12ZM8.999 17.244a.75.75 0 0 1 .75-.75h.006a.75.75 0 0 1 .75.75v.006a.75.75 0 0 1-.75.75h-.006a.75.75 0 0 1-.75-.75v-.006ZM7.499 16.494a.75.75 0 0 0-.75.75v.005c0 .414.336.75.75.75h.005a.75.75 0 0 0 .75-.75v-.005a.75.75 0 0 0-.75-.75H7.5ZM13.499 14.997a.75.75 0 0 1 .75-.75h.006a.75.75 0 0 1 .75.75v.005a.75.75 0 0 1-.75.75h-.006a.75.75 0 0 1-.75-.75v-.005ZM14.25 16.494a.75.75 0 0 0-.75.75v.006c0 .414.335.75.75.75h.005a.75.75 0 0 0 .75-.75v-.006a.75.75 0 0 0-.75-.75h-.005ZM15.75 14.995a.75.75 0 0 1 .75-.75h.005a.75.75 0 0 1 .75.75v.006a.75.75 0 0 1-.75.75H16.5a.75.75 0 0 1-.75-.75v-.006ZM13.498 12.743a.75.75 0 0 1 .75-.75h2.25a.75.75 0 1 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM6.748 14.993a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" />
                        <path
                          fillRule="evenodd"
                          d="M18 2.993a.75.75 0 0 0-1.5 0v1.5h-9V2.994a.75.75 0 1 0-1.5 0v1.497h-.752a3 3 0 0 0-3 3v11.252a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3V7.492a3 3 0 0 0-3-3H18V2.993ZM3.748 18.743v-7.5a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-13.5a1.5 1.5 0 0 1-1.5-1.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>{item.createdate}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-1 bg-gray-100 text-green-700 text-xs font-medium rounded-full">
                      {supplementType.find((s) => s.code === item.type)?.name}
                    </span>
                    <span class="text-sm text-slate-500">bởi Nguyễn Văn A</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="space-y-1">
                    <div class="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Loại đơn
                    </div>
                    <div class="text-sm font-semibold text-slate-700">
                      {supplementType.find((s) => s.code === item.type)?.name}
                    </div>
                  </div>
                  {/* <div class="space-y-1">
                                    <div class="text-xs font-medium text-slate-500 uppercase tracking-wide">Người tạo</div>
                                    <div class="text-sm font-semibold text-slate-700">Nguyễn Văn A</div>
                                </div> */}
                  <div class="space-y-1">
                    <div class="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Tổng số cây
                    </div>
                    <div class="text-lg font-bold text-emerald-600">
                      {total(item.detail, "numberofbars")}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Tổng khối lượng
                    </div>
                    <div class="text-lg font-bold text-emerald-600">
                      {total(item.detail, "weight")}
                    </div>
                  </div>
                  <button
                    className="ml-auto bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleViewSupplementDetail(item)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path
                        fillRule="evenodd"
                        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ul>
      )}

      {activeTable && (
        <div className=" pl-90 pt-30 fixed inset-0 bg-black/50">
          <div className="relative z-50">
            <div className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white border border-gray-200 shadow-lg rounded-lg w-full mx-4">
              <div className=" m-5 h-full flex flex-col">
                <button
                  className="text-red-600 aspect-square bg-gray-50 border-1 border-green-100 shadow-sm hover:text-red-700 hover:bg-gray-100 p-1 h-8 w-8 mb-2 rounded"
                  onClick={() => setActiveTable(false)}
                >
                  <svg
                    className="h-4 w-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <h2 className="text-lg font-bold mb-4">Chi tiết đơn bù</h2>
                <h4 className="font-bold mb-4">Ngày tạo: <span className="font-normal">{activeSupplementOrder.createdate}</span> </h4>
                <h4 className="font-bold">
                  Loại đơn: 
                  <span className="font-normal">
                    {supplementType.find((s) => s.code === activeSupplementOrder.type)?.name}
                  </span>
                </h4>
                <div className="flex gap-4">
                  <h4 className="font-medium">Ghi chú:</h4>

                  <textarea
                    rows={6}
                    className="flex-1 border border-gray-400 rounded  mb-3 px-2 py-2 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ghi chú ..."
                    value={activeSupplementOrder.note || ""}
                    onChange={(e) => setOrderNote(e.target.value)}
                  />
                </div>

                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">
                        STT
                      </th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">
                        Mã hàng
                      </th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black">
                        Tên hàng hóa
                      </th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-16">
                        Dài
                      </th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">
                        Số lượng
                      </th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">
                        Khối lượng
                      </th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSupplementOrder.detail.map((item, index) => (
                      <tr className="hover:bg-gray-50" key={index}>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">
                          {index + 1}
                        </td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">
                          {item.product.name}
                        </td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">
                          {item.product.namedetail}
                        </td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">
                          {item.product.catalog.length}
                        </td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">
                          {item.numberofbars}
                        </td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">
                          {item.weight}
                        </td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">
                          {item.note}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        className="border border-gray-800 px-2 py-2 pl-15 text-xs font-bold text-black w-12"
                        colSpan={4}
                      >
                        Tổng cộng
                      </td>
                      <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">
                        {total(
                          activeSupplementOrder?.detail || [],
                          "numberofbars"
                        )}
                      </td>
                      <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">
                        {Number(
                          total(activeSupplementOrder?.detail || [], "weight")
                        ).toFixed(2)}
                      </td>
                      <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplementOrderList;
