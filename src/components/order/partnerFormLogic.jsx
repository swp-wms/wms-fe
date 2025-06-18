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
  steeltype: "",
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
  steeltype: "",
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




export function usePartnerFormLogic({ activeTab, setActiveTab, setShowForm, partnerList, productList }) {
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

    const handleProductChange = (e) => {

    }
    
  }, []);

  useEffect(() => {
  if (activeTab === "product" && setShowForm) {
    // Validate product fields immediately
    let newProductErrors = {};
    let newCatalogErrors = {};

    // Validate required product fields
    ["name", "brandname", "type", "partnerid"].forEach((key) => {
      newProductErrors[key] = validateProductField(key, product[key], product);
    });

    // Validate required catalog fields
    ["brandname", "standard", "barsperbundle", "length", "weightpermeter", "weightperbundle", "type", "weightperroll"].forEach((key) => {
      newCatalogErrors[key] = validateCatalogField(key, catalog[key], catalog);
    });

    setProductErrors((prev) => ({ ...prev, ...newProductErrors }));
    setCatalogErrors((prev) => ({ ...prev, ...newCatalogErrors }));
  }
  if (activeTab === "partner" && setShowForm) {
    // Validate partner fields immediately
    let newPartnerErrors = {};
    Object.keys(initialPartnerErrors).forEach((key) => {
      newPartnerErrors[key] = validateField(key, partner[key]);
    });
    setPartnerErrors((prev) => ({ ...prev, ...newPartnerErrors }));
  }


}, [activeTab, setShowForm]);
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
    case "type":
      if (value.trim() === "") return "Bắt buộc";
    break;
    case "partnerid":
      if (value.trim() === "") return "Bắt buộc";
      // Check if partner exists in the list
      if (!partnerList.some(partner => partner.id === value.trim())) return "Đối tác không tồn tại";
      break;
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
    
    
  }
  return "";
};

const validateCatalogField = (name, value, catalog) => {
  switch(name){
    case "length":
      if (value === "" || value === null) return "Bắt buộc";
      if (isNaN(value) || Number(value) < 0) return "Không được nhập số âm";
      break;

     case "barsperbundle":
      if (value === "" || value === null) return "Bắt buộc";
      if (!/^\d+$/.test(value) || Number(value) <= 0) return "Phải là số nguyên dương";
      break;

       case "weightpermeter":
      if (      Number(value) <= 0) return "Phải là số thực dương";
      break;

      case "type":
      if (!value.trim() === "#") return "Bắt buộc";
      break;

    case "weightperbundle":
      // Only required if type is "Thép Thanh"
      if (catalog.type === "Thép Thanh") {
        if (value === "" || value === null) return "Bắt buộc cho Thép Thanh";
        if (isNaN(value) || Number(value) <= 0) return "Phải là số thực dương";
      }
      break;
    case "weightperoll":
      // Only required if type is "Thép Cuộn"
      if (catalog.type === "Thép Cuộn") {
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
  let newCatalogErrors = {};

  // Only validate the required fields
  const requiredFields = ["name", "brandname", "type", "partnerid"];
  requiredFields.forEach((key) => {
    const errorMsg = validateProductField(key, product[key], product);
    if (errorMsg) valid = false;
    newErrors[key] = errorMsg;
  });

  const catalogFields = ["brandname", "standard", "barsperbundle", "length", "weightpermeter", "weightperbundle", "type", "weightperroll"];
  catalogFields.forEach((key) => {
    const errorMsg = validateCatalogField(key, catalog[key], catalog);
    if (errorMsg) valid = false;
    newCatalogErrors[key] = errorMsg;
  })
  



  // Validate namedetail as well (if needed)
  newErrors.namedetail = validateProductField("namedetail", product.namedetail, product);

  // For optional fields, set error as empty string
  Object.keys(initialProductErrors).forEach((key) => {
    if (!requiredFields.includes(key) && key !== "namedetail") {
      newErrors[key] = "";
    }
  });

  Object.keys(initialCatalogErrors).forEach((key) => {
    if (!catalogFields.includes(key)) {
      newCatalogErrors[key] = "";
    }
  });
  console.log("Product Errors:", newErrors);
  setCatalogErrors(newCatalogErrors);
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
  let updatedCatalog = { ...catalog };

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
  updatedCatalog.steeltype = steeltype;
  if(updatedProduct.brandname && updatedProduct.brandname.trim() !== "") 
      updatedCatalog.brandname = updatedProduct.brandname.trim();

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
      setCatalog(updatedCatalog); 
    }
  } else {
    isCatalogExists.current=false;
    setCatalog(updatedCatalog);
  }
  
  console.log("Catalog: " , updatedCatalog);
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
    console.log("Catalog: ", catalog);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'partner') {
      if(validate() ) partnerCalls.addPartner(partner);
      
    }else if (activeTab === 'product') {
      if(validateProduct()){
        if(isCatalogExists.current){
           productCalls.addProduct(product);
           setShowForm(false);
        }
        
        else {
            console.log("Catalog: ",catalog);
            const log = catalogCalls.addCatalog(catalog)
            .then(() => {
              console.log(log);
               console.log('add product:', product);
              productCalls.addProduct(product);
            })
          }
        }
      }
      setShowForm(false);
  };


  return {
    partner, setPartner,  partnerErrors, setPartnerErrors,
    product, setProduct, productErrors, setProductErrors,
    catalog, setCatalog, catalogErrors, setCatalogErrors,
    catalogList, setCatalogList,
    handleChange, handleProductChange, handleCatalogChange, handleSubmit,
    activeTab, setActiveTab, setShowForm, partnerList, productList
  };
}