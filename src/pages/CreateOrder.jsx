import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../components/common/header";
const CreateOrder = () => {
    return (
      <>
      <Header />
      <div className="min-h-screen bg-[#fafafa] pt-22 pl-70 pr-5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Left Column */}
          <div className="space-y-4">
            
            {/* Customer Search Section */}
            <div className="bg-white border-2 border-gray-800 rounded-md p-4">
              <div className="space-y-4">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm mã khách hàng, tên công ty"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="h-32 border border-gray-300 rounded bg-white">
                  {/* Customer list area */}
                </div>
              </div>
            </div>

            {/* Transport Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-black whitespace-nowrap">
                  PHỤ TRÁCH VẬN CHUYỂN:
                </label>
                <div className="relative flex-1">
                  <select className="w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    <option>Mã nhân viên vận chuyển</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="flex gap-4">
                <label className="text-sm font-medium text-black whitespace-nowrap mt-2">GHI CHÚ:</label>
                <textarea 
                  rows={6}
                  className="flex-1 border border-gray-400 rounded px-3 py-2 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
          <div className="h-full space-y-4 border-2 border-gray-800 rounded-md">
            
            {/* Product Search Section */}
            <div className="bg-white border-2 border-white rounded-md p-4">
              <div className="relative rounded-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm mã hàng hóa, tên hàng hóa"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Order Table Section */}
            <div className="m-4 bg-white border-1 border-gray-800 overflow-hidden">
              
              {/* Table */}
              <div className="h-full flex flex-col">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">STT</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Mã hàng</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black">Tên hàng hóa</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-16">Dài</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Đơn trọng</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Số lượng</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Ghi chú</th>
                    </tr>
                  </thead>
                </table>
                
                {/* Empty table body area */}
                <div className="flex-1 bg-white">
                  <div className="h-64"></div>
                </div>
              </div>
            </div>
          </div>
            {/* Bottom Buttons */}
            <div className="mt-5 flex gap-2 justify-end">
              <button className="inline-flex items-center px-4 py-2 border border-gray-400 rounded bg-white text-sm text-black hover:bg-gray-50 shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-400 rounded bg-white text-sm text-black hover:bg-gray-50 shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo lệnh nhập hàng
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-red-400 rounded bg-white text-sm text-red-600 hover:bg-red-50 shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default CreateOrder;