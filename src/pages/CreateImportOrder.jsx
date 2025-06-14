import React,{useState, useRef}  from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import partner from "../backendCalls/partner";
import product from "../backendCalls/product";
const CreateOrder = () => {

  //------------------ USE STATE ------------------
    const [partnerList, setPartnerList] = useState([]);
    const [focused, setFocused] = useState(false);
    const [partnerFilteredSuggestions, setpartnerFilteredSuggestions] = useState([]);
    const [productFilteredSuggessions, setProductFilteredSuggestions] = useState([]);
    const [inputpartner, setInputpartner] = useState("");
    const [inputProduct, setInputProduct] = useState("");
    const productList = product.fetchProducts();

  //------------------ USE REF --------------------
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

    React.useEffect(() => {
      const fetchPartners = async () => {
        try{
          const response = await partner.fetchPartners();
          console.log(response);
          setPartnerList(response);
          // setpartnerFilteredSuggestions(response); // Initialize suggestions with all partners

        }catch(error){
          console.error("Error fetching partners:", error);
        }
      };
      fetchPartners();
    }, );
    
    

    const handlePartnerInputChange = (e) => {
      const value = e.target.value;
      setInputpartner(value);

      //filter partner suggestion based on input
      const filteredSuggestions = partnerList.filter(
        partner => 
          partner.name.trim().toLowerCase().includes(value.toLowerCase().trim())||
          partner.id.trim().toLowerCase().includes(value.toLowerCase().trim())
      );
      console.log("Filtered Suggestions:", filteredSuggestions);
      setpartnerFilteredSuggestions(filteredSuggestions);
    }

    const handleProductInputChange = (e) => {
      const value = e.target.value;
      setInputProduct(value);

      //filter product suggestion based on input
      const filteredSuggestions = productList.filter(
        product => product.name.trim().toLowerCase().includes(value.trim().toLowerCase())
      );
      setProductFilteredSuggestions(filteredSuggestions);
    }

    const handlePartnerSelect = (partner) => {
      setInputpartner(partner.name || partner.id || "");
      setpartnerFilteredSuggestions([]);
    }

    const handleProductSelect = (product) => {
      setInputProduct(product.name);
      setProductFilteredSuggestions([]);
    }
    let currentPartner;
    currentPartner = partnerList.find((partner) => partner.name === inputpartner || partner.id === inputpartner);

    return (
      <>
        {/* <Header /> */}
        <div className="min-h-screen bg-[#fafafa] pt-22 pl-70 pr-5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Left Column */}
              <div className="space-y-4">
                
                {/* partner Search Section */}
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
                        value={inputpartner}
                        onChange={handlePartnerInputChange}
                        onFocus={() =>setFocused(true)}
                        onBlur={() => setTimeout(() => setFocused(false), 100)}
                      />
                      {focused && partnerFilteredSuggestions.length > 0 &&(
                      <ul className="z-50 absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
                        {partnerFilteredSuggestions.map((partner, index) => (
                          <li key={index}>
                            <button 
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-200"
                              onClick={() => handlePartnerSelect(partner)}
                              // onMouseDown={() =>setFocused(false)}
                            >
                              {partner.id} - {partner.name}
                            </button>
                          </li>
                        ))
                        }
                      </ul>
                      )}
                    </div>
                    
                    <div className="h-fit border border-gray-300 rounded bg-white p-2">
                      
                      {/* partner list area */}
                      <div className="pl-2 pt-2">
                        <label className="block text-sm font-medium text-black mb-1">
                          {currentPartner ? (
                            <>
                              Địa chỉ: <span>{currentPartner.address || ""}</span>
                            </>
                          ) : ""}
                        </label>
                      </div>
                      <div className="pl-2 pt-2">
                        <label className="block text-sm font-medium text-black mb-1">
                         {currentPartner ? (
                            <>
                             Mã số thuế: <span>{currentPartner.taxcode || ""}</span>
                            </>
                          ) : ""}
                        </label>
                      </div>
                      <div className="pl-2 pt-2">
                        {currentPartner ? (
                            <>
                              Số điện thoại: <span>{currentPartner.phonenumber || ""}</span>
                            </>
                          ) : ""}
                      </div>
                      <div className="pl-2 pt-2">
                        <label className="block text-sm font-medium text-black mb-1">
                          {currentPartner ? (
                            <>
                              Email: <span>{currentPartner.email || ""}</span>
                            </>
                          ) : ""}
                        </label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-black whitespace-nowrap">
                          PHỤ TRÁCH VẬN CHUYỂN:
                        </label>
                        <div className="relative flex-1">
                          <select className="z-30 w-full px-3 py-2 border border-gray-400 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
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
                        value={inputProduct}
                        onChange={handleProductInputChange}
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