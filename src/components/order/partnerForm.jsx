import { useState } from "react";

const CompleteForm = () => {
  const [activeTab, setActiveTab] = useState('partner');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50"></div>
      <div className="relative z-50">
        <div className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white border border-gray-200 shadow-lg rounded-lg w-full mx-4">
          
          {/* Header */}
          <div className="flex flex-row items-center justify-between p-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 flex-1">
              THÊM {activeTab === 'partner' ? 'ĐỐI TÁC' : 'HÀNG HÓA'}
            </h2>
            <button className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8 rounded">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 pt-4 bg-white">
            <div className="w-full">
              <div className=" h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600 grid grid-cols-2 w-full">
                <button
                  type="button"
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
                    activeTab === 'partner' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab('partner')}
                >
                  Thêm đối tác
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
                    activeTab === 'product' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab('product')}
                >
                    Thêm hàng hóa
                </button>
              </div>

              {/* partner Form */}
              {activeTab === 'partner' && (
                <div className="py-4">
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            MÃ DOANH NGHIỆP
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            Địa chỉ:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            Số điện thoại:
                          </label>
                          <input
                            type="tel"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            Email:
                          </label>
                          <input
                            type="email"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            TÊN DOANH NGHIỆP
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            Mã số thuế:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            Số tài khoản:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            Tên ngân hàng:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800 uppercase">
                        Ghi chú:
                      </label>
                      <textarea
                        rows="3"
                        className="flex w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm resize-none"
                      />
                    </div>
                  </form>
                </div>
              )}

              {/* Product Form */}
              {activeTab === 'product' && (
                <div className="py-4">
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            MÃ HÀNG
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            TÊN HÃNG
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            TÊN HÀNG HÓA
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            DỊNH:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            SỐ LƯỢNG:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            KHỐI LƯỢNG:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            QĐ CÂY/BÓ:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            KG/M:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            LOẠI THÉP:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800 uppercase">
                            KHỐI LƯỢNG CUỘN:
                          </label>
                          <input
                            type="text"
                            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800 uppercase">
                        GHI CHÚ:
                      </label>
                      <textarea
                        rows="3"
                        className="flex w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm resize-none"
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-3 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              className="inline-flex items-center justify-center text-gray-700 border border-gray-200 hover:bg-gray-300 bg-white px-4 py-1 text-sm rounded-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Quay lại
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center text-gray-700bg-white border border-gray-200 hover:bg-gray-300 px-4 py-1 text-sm rounded-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Chỉnh sửa
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center text-gray-700bg-white border border-gray-200 hover:border-gray-300 px-4 py-1 text-sm rounded-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleteForm;