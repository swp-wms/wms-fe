import React, { useRef, useState } from "react";

const PartnerSearch = ({
  inputpartner,
  setInputpartner,
  partnerList,
  partnerFilteredSuggestions,
  setpartnerFilteredSuggestions,
  selectedPartner,
  setSelectedPartner,
  focused,
  setFocused,
  setActiveTab
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);


  const handleBlur = () => {
  setTimeout(() => {
    if (
      !inputRef.current?.contains(document.activeElement) &&
      !dropdownRef.current?.contains(document.activeElement)
    ) {
      setShowSuggestions(false);
    }
  }, 100);
};


  const handlePartnerInputChange = (e) => {
    const value = e.target.value;
    setInputpartner(value);
    if(value.trim() === "") {
      setSelectedPartner(null);
    }
    const filteredSuggestions = partnerList.filter(
      partner =>
        partner.name.trim().toLowerCase().includes(value.toLowerCase().trim()) ||
        partner.id.trim().toLowerCase().includes(value.toLowerCase().trim())
    );
    setpartnerFilteredSuggestions(filteredSuggestions);
  };

  const handlePartnerSelect = (partner) => {
    setInputpartner(partner.name || partner.id || "");
    setpartnerFilteredSuggestions([]);
    setSelectedPartner(partner);

    setTimeout(() => {
      console.log("Selected Partner: ", selectedPartner);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const trimmedInput = inputpartner.trim().toLowerCase();
      const matched = partnerList.find((item) =>
        ["name", "id"].some((key) => item[key]?.trim().toLowerCase() === trimmedInput)
      );
      if (matched) {
        setSelectedPartner(matched);
        setpartnerFilteredSuggestions([]);
      
      }
      console.log("selectedPartner: ", selectedPartner);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-600 rounded-md p-4">
      <div className="space-y-4">
        <div className="relative flex">
          <div className="relative flex-grow">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm mã khách hàng, tên công ty"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputpartner}
            onChange={e => { handlePartnerInputChange(e); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          {showSuggestions && partnerFilteredSuggestions.length > 0 && (
            <ul
              ref={dropdownRef}
              tabIndex={-1}
              className="z-50 absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto"
              onBlur={handleBlur}
            >
              {partnerFilteredSuggestions.map((partner, index) => (
                <li key={index}>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-200"
                    onClick={() => {
                      handlePartnerSelect(partner);
                      setShowSuggestions(false);
                    }}
                    onMouseDown={e => e.preventDefault()} // Prevent input blur before click
                  >
                    {partner.id} - {partner.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
            <button className=" ml-1 size-9.5  aspect-square justify-center border border-gray-300 rounded text-sm bg-white hover:bg-gray-100 hover:border-gray-400 align-bottom "
            onClick={()=>setActiveTab('partner')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="c urrentColor" className="size-6 ml-1 text-gray-500" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
          </button>
        
        </div>
        <div className="h-fit border border-gray-300 rounded bg-white p-2">
          <div className="pl-2 pt-2">
            <h2 className="text-sm font-bold text-black">
                    {selectedPartner?.id} - {selectedPartner?.name}
            </h2>
          </div>
          <div className="pl-2 pt-2">
            <label className="block text-sm font-semibold text-black mb-1">
              {selectedPartner ? <>Địa chỉ: <span className="text-sm font-normal text-black mb-1">{selectedPartner.address || ""}</span></> : ""}
            </label>
          </div>
          <div className="pl-2 pt-2">
            <label className="block text-sm font-semibold text-black mb-1">
              {selectedPartner ? <>Mã số thuế: <span className="text-sm font-normal text-black mb-1">{selectedPartner.taxcode || ""}</span></> : ""}
            </label>
          </div>
          <div className="pl-2 pt-2">
            <label className="block text-sm font-semibold text-black mb-1">
              {selectedPartner ? <>Số điện thoại: <span className="text-sm font-normal text-black mb-1">{selectedPartner.phonenumber || ""}</span></> : ""}
            </label>
          </div>
          <div className="pl-2 pt-2">
            <label className="block text-sm font-semibold text-black mb-1">
              {selectedPartner ? <>Email: <span className="text-sm font-normal text-black mb-1">{selectedPartner.email || ""}</span></> : ""}
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-black whitespace-nowrap">
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
            <label className="text-sm font-semibold text-black whitespace-nowrap mt-2">GHI CHÚ:</label>
            <textarea
              rows={6}
              className="flex-1 border border-gray-400 rounded px-3 py-2 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSearch;
