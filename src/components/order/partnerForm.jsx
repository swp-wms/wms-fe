import { usePartnerFormLogic } from "./partnerFormLogic";

const CompleteForm = (props) => {
  const {
    partner, partnerErrors, product, productErrors, catalog, catalogErrors, catalogList,
    handleChange, handleProductChange, handleCatalogChange, handleSubmit,
    activeTab, setActiveTab, setShowForm, partnerList, setPartnerList,productList, selectedProducts, selectedPartner, setSelectedPartner, setSelectedProducts,
    initialData
  } = usePartnerFormLogic(props);

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
          <button className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8 rounded"
              onClick={() => setShowForm(false)}
              >
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
                        <label className="text-sm font-bold text-gray-800 flex">
                          <div className="flex items-center w-auto">
                            MÃ DOANH NGHIỆP
                          </div>
                          {partnerErrors.id && (
                            <div className="w-auto inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                              {partnerErrors.id}
                              </div>
                          )}
                        
                        </label>
                        <input
                          type="text"
                          name="id"
                          value={partner.id}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          <div className="">Địa chỉ:</div>
                          {partnerErrors.address && (<div className="w-[60%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">{partnerErrors.address}</div>)}
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={partner.address}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          <div className="w-auto">Số điện thoại:</div>
                          {partnerErrors.phonenumber && (<div className="w-auto inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">{partnerErrors.phonenumber}</div>)}
                        </label>
                        <input
                          type="tel"
                          name="phonenumber"
                          value={partner.phonenumber}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          <div className="w-auto">Email:</div>
                          {partnerErrors.email && (<div className="w-auto inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">{partnerErrors.email}</div>)}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={partner.email}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          <div className="w-auto">TÊN DOANH NGHIỆP</div>
                          {partnerErrors.name && (<div className="w-auto inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">{partnerErrors.name}</div>)}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={partner.name}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          <div className="w-auto">Mã số thuế:</div>
                          {partnerErrors.taxcode && (<div className="w-auto inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">{partnerErrors.taxcode}</div>)}
                        </label>
                        <input
                          type="text"
                          name="taxcode"
                          value={partner.taxcode}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          <div className="w-auto">Số tài khoản:</div>
                          {partnerErrors.bankaccount && (<div className="w-auto inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">{partnerErrors.bankaccount}</div>)}
                        </label>
                        <input
                          type="text"
                          name="bankaccount"
                          value={partner.bankaccount}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-800  flex">
                            <div className="w-auto">Tên ngân hàng:</div>
                            {partnerErrors.bankname && (<div className="w-auto inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">{partnerErrors.bankname}</div>)}
                          </label>
                        <input
                          type="text"
                          name="bankname"
                          value={partner.bankname}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800  flex">
                      Ghi chú:
                    </label>
                    <textarea
                      rows="3"
                      name="note"
                      value={partner.note}
                      onChange={handleChange}

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
                        <label className="static text-sm font-bold text-gray-800  flex">
                          MÃ HÀNG
                          {productErrors.name && (
                          <div className="w-[80%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {productErrors.name}
                          </div>
                        )}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={product.name}
                          onChange={handleProductChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />

                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          TÊN HÃNG
                          {productErrors.brandname && (
                          <div className="w-[80%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {productErrors.brandname}
                          </div>
                        )}

                        </label>
                        <input
                          type="text"
                          name="brandname"
                          value={product.brandname}
                          onChange={handleProductChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                      
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          TÊN HÀNG HÓA
                          {productErrors.namedetail && (
                          <div className="w-[80%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {productErrors.namedetail}
                          </div>
                        )}
                        </label>
                        <input
                          type="text"
                          name="namedetail"
                          value={product.namedetail}
                          onChange={handleProductChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                      
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          DÀI:
                          {catalogErrors.length && (
                          <div className="w-[80%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {catalogErrors.length}
                          </div>
                        )}
                        </label>
                        <input
                          type="text"
                          name="length"
                          value={product.type == "Thép Thanh"? catalog.length : ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm disabled:bg-gray-200"
                          disabled={product.type !== "Thép Thanh"}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          TIÊU CHUẨN: 
                          {catalogErrors.standard && (
                          <div className="w-[80%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {catalogErrors.standard}
                          </div>
                        )}
                        </label>
                        <input
                          type="text"
                          name="standard"
                          value={catalog.standard || ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          TÊN NHÀ CUNG CẤP:
                           {productErrors.partnerid && (
                          <div className="w-[60%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {productErrors.partnerid}
                          </div>
                        )}
                        </label>
                        <select className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          name="partnerid"
                          value={product.partnerid || ""}
                          onChange={handleProductChange}>
                          <option value="">Chọn nhà cung cấp</option>
                          {partnerList.map((partner) => (
                            <option key={partner.id} value={partner.id}>
                              {partner.name}
                            </option>
                          ))}
                        </select>
                       
                        </div>

                      {/* <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          SỐ LƯỢNG:
                        </label>
                        <input
                          type="text"
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                      </div>*/}

                      
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          TIÊU CHUẨN: 
                          {catalogErrors.standard && (
                          <div className="w-[80%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {catalogErrors.standard}
                          </div>
                        )}
                        </label>
                        <input
                          type="text"
                          value={catalog.standard}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          name="standard"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          QĐ CÂY/BÓ:
                          {catalogErrors.barsperbundle && (
                          <div className="w-[70%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {catalogErrors.barsperbundle}
                          </div>
                        )}
                        </label>
                        <input
                          type="text"
                          name="barsperbundle"
                          value={product.type == "Thép Thanh" ? catalog.barsperbundle : ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm disabled:bg-gray-200"
                          disabled={product.type !== "Thép Thanh"} 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          KG/M:
                          {catalogErrors.weightpermeter && (
                          <div className="w-[79%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {catalogErrors.weightpermeter}
                          </div>
                        )}
                        </label>
                        <input
                          type="text"
                          name="weightpermeter"
                          value={product.type == "Thép Thanh"?(catalog.weightperbundle/catalog.barsperbundle/catalog.length).toFixed(3) : ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm disabled:bg-gray-200"
                          disabled={product.type !== "Thép Thanh"}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          LOẠI THÉP:
                          {productErrors.type && (
                          <div className="w-[80%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {productErrors.type}
                          </div>
                        )}
                        </label>
                        <select
                          type="text"
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          name="type"
                          value={product.type || ""}
                          onChange={e => { handleProductChange(e); handleCatalogChange(e); }}
                        >
                          <option value="">Chọn loại thép</option>
                          <option value="Thép Thanh">Thép Thanh</option>
                          <option value="Thép Cuộn">Thép Cuộn</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          KHỐI LƯỢNG BÓ:
                          {catalogErrors.weightperbundle && (
                          <div className="w-[65%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {catalogErrors.weightperbundle}
                          </div>
                        )}
                        </label>
                        <input
                          type="text"
                          name="weightperbundle"
                          value={product.type == "Thép Thanh"?catalog.weightperbundle : ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm disabled:bg-gray-200"
                          disabled={product.type !== "Thép Thanh"}
                        />
                      </div> 
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800  flex">
                          KHỐI LƯỢNG CUỘN:
                          {catalogErrors.weightperroll && (
                          <div className="w-[60%] inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                            {catalogErrors.weightperroll}
                          </div>
                        )}
                        </label>
                        <input
                          type="text"
                          name="weightperroll"
                          value={catalog.weightperroll || ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm disabled:bg-gray-200"
                          disabled={product.type !== "Thép Cuộn"}
                        />
                      </div>
                      
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800  flex">
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

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-3 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                className="inline-flex items-center justify-center text-gray-700 border border-gray-200 hover:bg-gray-300 bg-white px-4 py-1 text-sm rounded-md"
                onClick={() => setShowForm(false)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Quay lại
              </button>

              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center text-gray-700 bg-white border border-gray-200 hover:border-gray-300 px-4 py-1 text-sm rounded-md"
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
    </div>
  </div>
);
}

export default CompleteForm