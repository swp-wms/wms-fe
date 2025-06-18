import { useState, useEffect, useRef } from "react";
import partnerCalls from "../../backendCalls/partner";
import catalogCalls from "../../backendCalls/catalog";
import productCalls from "../../backendCalls/product";



//INITIAL FORM VALUES FOR PARTNER
const initialPartner = {
  id: "",
  name: "",
  address: "",
  taxcode: "",
  phonenumber: "",
  email: "",
  bankaccount: "",
  bankname: "",
  note: "",
};

//INITIAL ERROR VALUES
const initialPartnerErrors = {
  id: "",
  name: "",
  address: "",
  taxcode: "",
  phonenumber: "",
  bankaccount: "",
  email: "",
};

const initialProduct = {
  name: "",
  partnerid: "",
  type: "",
  totalbar: 0,
  brandname: "",
  steeltype: "",
  namedetail: "",
  totalweight: 0,
};
const initialProductErrors = {
  name: "",         // mã hàng
  partnerid: "",
  type: "",
  totalbar: 0,
  brandname: "",
  steeltype: "",
  namedetail: "",
  totalweight: 0,
};

const initialCatalog ={
  brandname: "",
  standard: "",
  barsperbundle: 0,
  length: 0,
  weightpermeter:null,
  weightperbundle:null,
  type: "",
  weightperroll:null,
}
const initialCatalogErrors ={
  brandname: "",
  standard: "",
  barsperbundle: "",
  length: "",
  weightpermeter:"",
  weightperbundle:"",
  type: "",
  weightperroll:"",
}
const hasSpecialChars = (str) => {
  // Check for special characters using a regex
  return /[!@#$%^&*(),.?":{}|<>]/.test(str);
}
  

const isEmailValid = (email) =>{
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}




const CompleteForm = ({ activeTab, setActiveTab, setShowForm, partnerList, productList }) => {
  const [partner, setPartner] = useState(initialPartner);
  const [partnerErrors, setPartnerErrors] = useState(initialPartnerErrors);

  const [product, setProduct] = useState(initialProduct);
  const [catalog, setCatalog] = useState(initialCatalog);
  const [productErrors, setProductErrors] = useState(initialProductErrors);
  const [catalogErrors, setCatalogErrors] = useState(initialCatalogErrors);
  const [catalogList, setCatalogList] = useState([]);
  

  let isCatalogExists = useRef(false);
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const catalogs = await catalogCalls.fetchCatalog();
        setCatalogList(catalogs);
      } catch (error) {
        console.error("Error fetching catalogs:", error);
      }
    };

    fetchCatalogs();
    
  }, []);
//----------------- VALIDATION FUNCTIONS -----------------
  const validateField = (name, value) => {
  switch (name) {
    case "id":
      if (!value.trim()) return "Bắt buộc";
      if (hasSpecialChars(value)) return "Không chứa ký tự đặc biệt";
      if (Array.isArray(partnerList) && partnerList.some(item => item.id.trim() === value.trim())) return "Mã đã tồn tại";
      break;
    case "name":
      if (!value.trim()) return "Bắt buộc";
      if (hasSpecialChars(value)) return "Không chứa ký tự đặc biệt";
      break;
    case "address":
      if (!value.trim()) return "Bắt buộc";
      break;
    case "taxcode":
      if (!value.trim()) return "Bắt buộc";
      if (isNaN(value)) return "Chỉ nhập số";
      break;
    case "phonenumber":
      if (value && isNaN(value)) return "Chỉ nhập số";
      break;
    case "account":
      if (value && isNaN(value)) return "Chỉ nhập số";
      break;
    case "email":
      if (value && !isEmailValid(value)) return "Email không hợp lệ";
      break;
    default:
      break;
  }
  return "";
};


const validateProductField = (name, value) => {
  switch (name) {
    case "name": // mã hàng
      if (!value.trim()) return "Bắt buộc";
      if (!/^TD\d{1,4}(CB\d{1,3}V|C\d{2,3}|CD\d{2}|CB\d|CB\d{2,3})$/.test(value.trim())) return "Định dạng: TD + 1-4 số";
      if( Array.isArray(productList) && productList.some(item => item.name.trim() === value.trim())) return "Mã hàng đã tồn tại";
      break;
    case "brandname":
      if (!value.trim()) return "Bắt buộc";
      break;
    case "namedetail": 
      // Auto-filled
      break;
    case "type":
      if (!value.trim()) return "Bắt buộc";
    break;
    
  }
  return "";
};

const validateCatalogField = (name, value, catalog) => {
  switch(name){
    case "length":
      if (value === "" || value === null) return "Bắt buộc";
      if (isNaN(value) || Number(value) < 0) return "Không được nhập số âm";
      break;

    //  case "barsperbundle":
    //   if (value === "" || value === null) return "Bắt buộc";
    //   if (!/^\d+$/.test(value) || Number(value) <= 0) return "Phải là số nguyên dương";
    //   break;

       case "weightpermeter":
      if (isNaN(value) || Number(value) <= 0) return "Phải là số thực dương";
      break;

      case "type":
      if (!value.trim()) return "Bắt buộc";
      break;

        case "weightperbundle":
      // Only required if steeltype is "Thép Thanh"
      if (catalog.steeltype === "Thép Thanh") {
        if (value === "" || value === null) return "Bắt buộc cho Thép Thanh";
        if (isNaN(value) || Number(value) <= 0) return "Phải là số thực dương";
      }
      break;
    case "weightperoll":
      // Only required if steeltype is "Thép Cuộn"
      if (catalog.steeltype === "Thép Cuộn") {
        if (value === "" || value === null) return "Bắt buộc cho Thép Cuộn";
        if (isNaN(value) || Number(value) <= 0) return "Phải là số thực dương";
      }
      break;
  }
}




//--------------------Validate for submit-------------------
// Validate all fields on submit
  const validate = () => {
    let valid = true;
    let newErrors = {};
    Object.keys(initialPartnerErrors).forEach((key) => {
      const errorMsg = validateField(key, partner[key]);
      if (errorMsg) valid = false;
      newErrors[key] = errorMsg;
    });
    setPartnerErrors(newErrors);
    return valid;
  };

const validateProduct = () => {
  let valid = true;
  let newErrors = {};

  // Only validate the required fields
  const requiredFields = ["name", "brandname", "type", "partnerid"];
  requiredFields.forEach((key) => {
    const errorMsg = validateProductField(key, product[key], product);
    if (errorMsg) valid = false;
    newErrors[key] = errorMsg;
  });

  // Validate namedetail as well (if needed)
  newErrors.namedetail = validateProductField("namedetail", product.namedetail, product);

  // For optional fields, set error as empty string
  Object.keys(initialProductErrors).forEach((key) => {
    if (!requiredFields.includes(key) && key !== "namedetail") {
      newErrors[key] = "";
    }
  });
  
  setProductErrors(newErrors);
  return valid;
};
//-------------------------------------------



//----------HANDLERS FOR INPUT CHANGES-----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartner((prev) => ({ ...prev, [name]: value }));
    const errorMsg = validateField(name, value);
    if (errorMsg) {
      setPartnerErrors((prev) => ({ ...prev, [name]: errorMsg }));
      // console.log('Error in field:', name, errorMsg);
    }

    // Reset error for the field being edited
    // setPartnerErrors((prev) => ({ ...prev, [name]: "" }));

  }

  const handleProductChange = (e) => {
  const { name, value } = e.target;
  let updatedProduct = { ...product, [name]: value };

  // Auto-fill tên hàng hóa (namedetail) when mã hàng (name) changes
  if (name === "name" && /^TD\d{1,4}/.test(value.trim())) {
    const afterT = value.trim().substring(2);
    updatedProduct.namedetail = "Thép " + afterT;
  }

  // Extract steeltype (Dxx) from name
  let steeltype = "";
  const match = (name === "name" ? value : updatedProduct.name).match(/^TD(\d{1,4})/);
  if (match) steeltype = `D${match[1]}`;
  updatedProduct.steeltype = steeltype;

  // Check for catalog autofill if both brandname and steeltype are present
  if (updatedProduct.brandname && steeltype) {
    const foundCatalog = catalogList.find(
      catalog =>
        catalog.brandname.trim().toLowerCase() === updatedProduct.brandname.trim().toLowerCase() &&
        catalog.steeltype.trim().toLowerCase() === steeltype.trim().toLowerCase()
    );
    
    if (foundCatalog) {
      console.log("Found catalog:", foundCatalog);
      setCatalog(foundCatalog);
      isCatalogExists.current=true;
    } else {
      isCatalogExists.current=false;
      setCatalog(initialCatalog);
    }
  } else {
    isCatalogExists.current=false;
    setCatalog(initialCatalog);
  }
  
  setProduct(updatedProduct);

  // Validate on change
  const errorMsg = validateProductField(name, value, updatedProduct);
  setProductErrors((prev) => ({ ...prev, [name]: errorMsg }));

  // Also validate namedetail if name changes
  if (name === "name") {
    setProductErrors((prev) => ({
      ...prev,
      namedetail: validateProductField("namedetail", updatedProduct.namedetail, updatedProduct),
    }));
  }
  console.log("isCatalogExists:", isCatalogExists);
};

  const handleCatalogChange = (e) => {
    const { name, value } = e.target;
    setCatalog((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Validate on change
    const errorMsg = validateCatalogField(name, value, { ...catalog, [name]: value });
    // You can manage catalog errors state if needed, e.g. setCatalogErrors
    setCatalogErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'partner') {
      if(validate() ) partnerCalls.addPartner(partner);
      
    }else if (activeTab === 'product') {
      if(validateProduct()){
        console.log('add product:', product);
        if(isCatalogExists.current) productCalls.addProduct(product);
        }
      }
      setShowForm(false);
  };


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
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          MÃ DOANH NGHIỆP
                        </label>
                        <input
                          type="text"
                          name="id"
                          value={partner.id}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {partnerErrors.id && (<div className="text-red-500 text-xs mt-1">{partnerErrors.id}</div>)}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          Địa chỉ:
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={partner.address}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {partnerErrors.address && (<div className="text-red-500 text-xs mt-1">{partnerErrors.address}</div>)}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          Số điện thoại:
                        </label>
                        <input
                          type="tel"
                          name="phonenumber"
                          value={partner.phonenumber}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {partnerErrors.phonenumber && (<div className="text-red-500 text-xs mt-1">{partnerErrors.phonenumber}</div>)}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          Email:
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={partner.email}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {partnerErrors.email && (<div className="text-red-500 text-xs mt-1">{partnerErrors.email}</div>)}
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
                          name="name"
                          value={partner.name}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {partnerErrors.name && (<div className="text-red-500 text-xs mt-1">{partnerErrors.name}</div>)}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          Mã số thuế:
                        </label>
                        <input
                          type="text"
                          name="taxcode"
                          value={partner.taxcode}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {partnerErrors.taxcode && (<div className="text-red-500 text-xs mt-1">{partnerErrors.taxcode}</div>)}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          Số tài khoản:
                        </label>
                        <input
                          type="text"
                          name="bankaccount"
                          value={partner.bankaccount}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {partnerErrors.bankaccount && (<div className="text-red-500 text-xs mt-1">{partnerErrors.bankaccount}</div>)}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          Tên ngân hàng:
                        </label>
                        <input
                          type="text"
                          name="bankname"
                          value={partner.bankname}
                          onChange={handleChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {partnerErrors.bankname && (<div className="text-red-500 text-xs mt-1">{partnerErrors.bankname}</div>)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800 uppercase">
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
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          MÃ HÀNG
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={product.name}
                          onChange={handleProductChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {productErrors.name && (
                          <div className="text-red-500 text-xs mt-1">
                            {productErrors.name}
                          </div>
                        )}

                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          TÊN HÃNG
                        </label>
                        <input
                          type="text"
                          name="brandname"
                          value={product.brandname}
                          onChange={handleProductChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {productErrors.brandname && (
                          <div className="text-red-500 text-xs mt-1">
                            {productErrors.brandname}
                          </div>
                        )}

                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          TÊN HÀNG HÓA
                        </label>
                        <input
                          type="text"
                          name="namedetail"
                          value={product.namedetail}
                          onChange={handleProductChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {productErrors.namedetail && (
                          <div className="text-red-500 text-xs mt-1">
                            {productErrors.namedetail}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          DÀI:
                        </label>
                        <input
                          type="text"
                          name="length"
                          value={catalog.length || ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {catalogErrors.length && (
                          <div className="text-red-500 text-xs mt-1">
                            {catalogErrors.length}
                          </div>
                        )}

                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          TIÊU CHUẨN: 
                        </label>
                        <input
                          type="text"
                          name="standard"
                          value={catalog.standard || ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {catalogErrors.standard && (
                          <div className="text-red-500 text-xs mt-1">
                            {catalogErrors.standard}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          TÊN NHÀ CUNG CẤP:
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
                        <label className="text-sm font-bold text-gray-800 uppercase">
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
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          TIÊU CHUẨN: 
                        </label>
                        <input
                          type="text"
                          value={catalog.standard}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                          name="standard"
                        />
                        {catalogErrors.standard && (
                          <div className="text-red-500 text-xs mt-1">
                            {catalogErrors.standard}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          QĐ CÂY/BÓ:
                        </label>
                        <input
                          type="text"
                          name="barsperbundle"
                          value={catalog.barsperbundle || ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {catalogErrors.barsperbundle && (
                          <div className="text-red-500 text-xs mt-1">
                            {catalogErrors.barsperbundle}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          KG/M:
                        </label>
                        <input
                          type="text"
                          name="weightpermeter"
                          value={catalog.weightpermeter || ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {catalogErrors.weightpermeter && (
                          <div className="text-red-500 text-xs mt-1">
                            {catalogErrors.weightpermeter}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          LOẠI THÉP:
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
                        {productErrors.type && (
                          <div className="text-red-500 text-xs mt-1">
                            {productErrors.type}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          KHỐI LƯỢNG BÓ:
                        </label>
                        <input
                          type="text"
                          name="weightperbundle"
                          value={catalog.weightperbundle || ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {catalogErrors.weightperbundle && (
                          <div className="text-red-500 text-xs mt-1">
                            {catalogErrors.weightperbundle}
                          </div>
                        )}
                      </div> 
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800 uppercase">
                          KHỐI LƯỢNG CUỘN:
                        </label>
                        <input
                          type="text"
                          name="weightperroll"
                          value={catalog.weightperroll || ""}
                          onChange={handleCatalogChange}
                          className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                        {catalogErrors.weightperroll && (
                          <div className="text-red-500 text-xs mt-1">
                            {catalogErrors.weightperroll}
                          </div>
                        )}
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
                type="button"
                className="inline-flex items-center justify-center text-gray-700 bg-white border border-gray-200 hover:bg-gray-300 px-4 py-1 text-sm rounded-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                </svg>
                Chỉnh sửa
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