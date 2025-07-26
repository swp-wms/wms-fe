import { useState, useEffect, useRef } from "react";
import partnerCalls from "../../backendCalls/partner";
import catalogCalls from "../../backendCalls/catalog";
import productCalls from "../../backendCalls/product";
import toast, { Toaster } from 'react-hot-toast';

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

const initialCatalog = {
  brandname: "",
  steeltype: "",
  standard: "",
  barsperbundle: 0,
  length: 0,
  weightpermeter: null,
  weightperbundle: null,
  type: "",
  weightperroll: null,
}
const initialCatalogErrors = {
  brandname: "",
  steeltype: "",
  standard: "",
  barsperbundle: "",
  length: "",
  weightpermeter: "",
  weightperbundle: "",
  type: "",
  weightperroll: "",
}
const hasSpecialChars = (str) => {
  // Check for special characters using a regex
  return /[!@#$%^&*(),.?":{}|<>]/.test(str);
}


const isEmailValid = (email) => {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}




export function usePartnerFormLogic({ 
  activeTab, 
  setActiveTab, 
  setShowForm, 
  partnerList, 
  setPartnerList, 
  productList, 
  selectedProducts, 
  setSelectedProducts, 
  selectedPartner, 
  setSelectedPartner, 
  initialData = null
}) {
  
  const getInitialProduct = () => {
    if (initialData?.product) {
      return {
        ...initialProduct,
        ...initialData.product
      };
    }
    return initialProduct;
  };

  const getInitialCatalog = () => {
    if (initialData?.catalog) {
      return {
        ...initialCatalog,
        ...initialData.catalog
      };
    }
    return initialCatalog;
  };



  const [partner, setPartner] = useState(initialPartner);
  const [partnerErrors, setPartnerErrors] = useState(initialPartnerErrors);

  const [product, setProduct] = useState(getInitialProduct());
  const [catalog, setCatalog] = useState(getInitialCatalog());
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

    const fetchPartners = async () => {
      try {
        const partners = await partnerCalls.fetchPartners();
        // console.log("Fetched partners:", partners);
        // Filter out partners with empty id
        const filteredPartners = partners.filter(partner => partner.id && partner.id.trim() !== "");
        setPartnerList(filteredPartners);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    }

    fetchPartners();

  },[selectedProducts],selectedPartner);

    useEffect(() => {
    if (initialData) {
      if (initialData.product) {
        setProduct(prev => ({
          ...prev,
          ...initialData.product
        }));
      }
      if (initialData.catalog) {
        setCatalog(prev => ({
          ...prev,
          ...initialData.catalog
        }));
      }
    }
  }, [initialData]);

  // ... rest of your existing logic


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
        else if (hasSpecialChars(value)) return "Không chứa ký tự đặc biệt";
        else if (partnerList && partnerList.some(item => item.id.trim() === value.trim())) return "Mã đã tồn tại";
        else return "";
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


  const validateProductField = (name, value,product) => {
    switch (name) {
      case "type":
        
        if (value.trim() === "") return "Bắt buộc";
      
        break;
      case "partnerid":
        if (value.trim() === "") return "Bắt buộc";
        // Check if partner exists in the list
        if (partnerList.some(partner => partner.id === value.trim())) return "Đối tác không tồn tại";
        break;
      case "name": // mã hàng
        console.log(productList);
        if (!value.trim()) return "Bắt buộc";
        if (!/^TD\d{1,4}((CB\d{1,3}V|C\d{2,3}|CD\d{2}|CB\d|CB\d{2,3})|[a-zA-Z])$/.test(value.trim())) return "Vui lòng nhập: TDxCBxxxT hoặc TDxxCBxxxV";
        if (Array.isArray(productList) && productList.some(prod => prod.name.trim().toLowerCase() === value.trim().toLowerCase() &&
                                                                prod.brandname.trim().toLowerCase() === product.brandname.trim().toLowerCase() &&
                                                                prod.partnerid.trim().toLowerCase() === product.partnerid.trim().toLowerCase()))  {

          return "Sản phẩm đã tồn tại";
        }
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
    switch (name) {
      case "length":
      if (catalog.type === "Thép Thanh") {
        if (value === "" || value === null) return "Bắt buộc";
        if (Number(value) < 0) return "Không được nhập số âm";
        if (isNaN(value)) return "Vui lòng nhập vào kí tự là số";
      }
      break;

      case "barsperbundle":
        if (catalog.type === "Thép Thanh") {
          if (value === "" || value === null) return "Bắt buộc";
          if (!/^\d+$/.test(value) || Number(value) <= 0) return "Phải là số nguyên dương";
        }
        break;

      // case "weightpermeter":
      //   if (catalog.type === "Thép Thanh") {
      //     if (Number(value) <= 0) return "Phải là số thực dương";
      //   }
      //   break;

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
    if (!valid)
      toast.error("Vui lòng kiểm tra lại thông tin đối tác");
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
      const errorMsg2 = validateCatalogField(key, catalog[key], catalog);
      if (errorMsg2) valid = false;
      newCatalogErrors[key] = errorMsg2;
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
    console.log("Catalog Errors:", newCatalogErrors);
    setCatalogErrors(newCatalogErrors);
    setProductErrors(newErrors);

    if (!valid) {
      toast.error("Vui lòng kiểm tra lại thông tin hàng hóa");
    }

    return valid;
  };
  //-----------------------------------------------------



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
    setPartnerErrors((prev) => ({ ...prev, [name]: "" }));

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
    if (updatedProduct.brandname && updatedProduct.brandname.trim() !== "")
      updatedCatalog.brandname = updatedProduct.brandname.trim();

    // Check for catalog autofill if both brandname and steeltype are present
    if (updatedProduct.brandname && steeltype && updatedProduct.type) {
      const foundCatalog = catalogList.find(
        catalog =>
          catalog.brandname.trim().toLowerCase() === updatedProduct.brandname.trim().toLowerCase() &&
          catalog.steeltype.trim().toLowerCase() === steeltype.trim().toLowerCase() &&
          catalog.type.trim().toLowerCase() === updatedProduct.type.trim().toLowerCase()
      );
      
      if (foundCatalog) {
        console.log("Found catalog:", foundCatalog);
        setCatalog(foundCatalog);
        isCatalogExists.current = true;
      } else {
        isCatalogExists.current = false;
        setCatalog(updatedCatalog);
      }
    } else {
      isCatalogExists.current = false;
      setCatalog(updatedCatalog);
    }
    console.log("isCatalogExists:", isCatalogExists.current);
    console.log("Catalog: ", updatedCatalog);
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
      if (validate()) {
        //ADD PARTNER
        partnerCalls.addPartner(partner);
        toast.success("Thêm đối tác thành công");
        setShowForm(false);
        setSelectedPartner(partner);
      }


    } else if (activeTab === 'product') {
      if (validateProduct()) {

        const {trueId, ...productWithoutTrueId} = product; // Remove trueId from product}
        if (isCatalogExists.current) {
          console.log('Catalog already exists:', catalog);
          productCalls.addProduct(productWithoutTrueId);
          toast.success("Thêm sản phẩm thành công");
          setShowForm(false);
          if(initialData !== null && selectedPartner !== null && selectedPartner.isfactory) {
            // If initialData is provided, update the existing productWithoutTrueId
            const updatedProducts = selectedProducts.map((p) =>
              p.name === initialData.product.name ? 
            { ...productWithoutTrueId, 
                trueId: initialData.product.trueId,  // Keep the trueId from initialData
                catalog: catalog,
                partner: partner
              } : p
            );
            setSelectedProducts(updatedProducts);
            initialData = null; // Reset initialData after use
          }else{
            setSelectedProducts((prev) => [
              ...prev,
              {
                ...productWithoutTrueId,
                trueId: selectedProducts.length === 0 ? 1 : selectedProducts[selectedProducts.length - 1].trueId + 1,
                catalog: catalog,

              }
            ])
          }
        }

        else {
          
          catalogCalls.addCatalog(catalog)
          
            .then(() => {
              console.log('Catalog added successfully:', catalog);
              productCalls.addProduct(productWithoutTrueId);
              toast.success("Thêm sản phẩm thành công");
              setShowForm(false);
             if(initialData !== null && selectedPartner.isfactory) {
            // If initialData is provided, update the existing product
            const updatedProducts = selectedProducts.map((p) =>
              p.name === initialData.product.name ? 
            { ...productWithoutTrueId, 
                trueId: initialData.product.trueId,  // Keep the trueId from initialData
                catalog: catalog,
                partner:partner } : p
            );
            setSelectedProducts(updatedProducts);
            initialData = null; // Reset initialData after use
          }else{
            setSelectedProducts((prev) => [
              ...prev,
              {
                ...productWithoutTrueId,
                trueId: selectedProducts.length === 0 ? 1 : selectedProducts[selectedProducts.length - 1].trueId + 1,
                catalog: catalog,
                }
              ]);
            }})
            .catch((error) => {
              toast.error("Lỗi khi thêm sản phẩm");
              console.error(error);
            });
        }
      }
    }

  };


  return {
    partner, setPartner, partnerErrors, setPartnerErrors,
    product, setProduct, productErrors, setProductErrors,
    catalog, setCatalog, catalogErrors, setCatalogErrors,
    catalogList, setCatalogList,
    handleChange, handleProductChange, handleCatalogChange, handleSubmit,
    activeTab, setActiveTab, setShowForm, partnerList, setPartnerList, selectedProducts, selectedPartner, setSelectedProducts, setSelectedPartner,
    initialData
  };
}