import { useEffect, useState } from "react";
import catalog from "../../backendCalls/catalog";
import toast from "react-hot-toast";

export const CatalogForm = ({
  setShowForm,
  setCatalogData,
  refresh,
  setRefresh,

}) => {
  const [catalogPrimaryKeys, setCatalogPrimaryKeys] = useState([]);
  
  useEffect(() => {
    const fetchCatalogPrimaryKeys = async () => {
      try{
        const response = await catalog.fetchCatalogPrimaryKeys();
        setCatalogPrimaryKeys(response.data);
      }catch(error){
        console.error("Error fetching catalog primary keys:", error);
      }
    };
    fetchCatalogPrimaryKeys();
  }, []);

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
  };

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
  };

    const [formData, setFormData] = useState(initialCatalog);
  const [formErrors, setFormErrors] = useState(initialCatalogErrors);

  const validateCatalogField = (name, value, catalog) => {
    switch (name) {
      case "brandname":
        if (value ==="" || value === null) return "Bắt buộc";
        break;
      case "steeltype":
        if (value === "" || value === null) return "Bắt buộc";
        if (!/^D\d{1,4}$/.test(value)) return "Không đúng định dạng";
        break;

      case "length":
        if(catalog.type === "Thép Thanh") {
          if (value === "" || value === null) return "Bắt buộc";
          if (isNaN(value) || Number(value) < 0) return "Không được nhập số âm";
        }
        break;

      case "barsperbundle":
        if(catalog.type === "Thép Thanh") {
          if (value === "" || value === null) return "Bắt buộc";
          if (!/^\d+$/.test(value) || Number(value) <= 0)
            return "Phải là số nguyên dương";
        }
        break;

      case "weightpermeter":
        if(catalog.type === "Thép Thanh") {
            if (value === "" || value === null) return "Bắt buộc cho Thép Thanh";
            if (Number(value) <= 0) return "Phải là số thực dương";
        }
        break;

      case "type":
        if (value === "" || value === null || value.trim() === "#") return "Bắt buộc";
        
        break;

      case "weightperbundle":
        // Only required if type is "Thép Thanh"
        if (catalog.type === "Thép Thanh") {
          if (value === "" || value === null) return "Bắt buộc cho Thép Thanh";
          if (isNaN(value) || Number(value) <= 0)
            return "Phải là số thực dương";
        }
        break;
      case "weightperroll":
        // Only required if type is "Thép Cuộn"
        if (catalog.type === "Thép Cuộn") {
          if (value === "" || value === null) return "Bắt buộc cho Thép Cuộn";
          if (isNaN(value) || Number(value) <= 0)
            return "Phải là số thực dương";
        }
        break;
       
    }
  };

  const validate = () => {
    let errors = {};
    let isValid = true;

    Object.keys(initialCatalogErrors).forEach((key) =>{
      const error = validateCatalogField(key,formData[key],formData);
      if(error) isValid = false;
      errors[key] = error;
      console.log("add catalog error: ",error);
      
      });
      if(!isValid)
        toast.error("Vui lòng kiểm tra lại thông tin nhập vào");

    return isValid;

  }

  const handleChange = (e) =>{
    const {name,value} = e.target;
    let updateCatalog = {...formData, [name]: value};

    if((name ==="steeltype" ||name === "brandname")&& updateCatalog.steeltype.toLowerCase().trim() !=="" && updateCatalog.brandname.toLowerCase().trim() !== ""){
      
        const findkey = catalogPrimaryKeys.find((item ) => (
          item.brandname === updateCatalog.brandname &&
          item.steeltype === updateCatalog.steeltype
        ));

        if(findkey){
          toast.error("Đã tồn tại danh mục thép này");
        }
    }

    if(updateCatalog.length && updateCatalog.barsperbundle && updateCatalog.weightperbundle){
      const weightPerMeter = (updateCatalog.weightperbundle / updateCatalog.barsperbundle / updateCatalog.length).toFixed(3);
      updateCatalog.weightpermeter = weightPerMeter;
    }
    setFormData(updateCatalog);

    //***************************VALIDATE ON CHANGE*****************************//
      
    const errorMsg = validateCatalogField(name, value, updateCatalog);
    console.log("error on change: ", errorMsg);
    setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (validate()) {
        const result = await catalog.addCatalog(formData);
        if (result && result.status == 201) {
          toast.success("Thêm thành công");
          
          setShowForm(false);
          setRefresh(!refresh);
        } else {
          console.error("Error adding catalog:", result && result.error);
          toast.error("Thêm thất bại");
        }
      
    }
  }

    const catalogFieldLeft = [
      {
        label: "HÃNG THÉP",
        type: "text",
        name: "brandname",
        options: [],
      },
      {
        label: "KÍCH CỠ",
        type: "text",
        name: "steeltype",
        placeholder: "Nhập D + số (VD: D10, D12, D16)",
      },
      {
        label: "TIÊU CHUẨN",
        type: "text",
        name: "standard",
        placeholder: "Nhập tiêu chuẩn",
      },
      {
        label: "QD CÂY/BÓ",
        type: "text",
        name: "barsperbundle",
        placeholder: "Nhập QD cây/bó",
        disabledWhen: ["Thép Cuộn"], // ✅ Add disable condition
      },
      {
        label: "DÀI (m)",
        type: "text",
        name: "length",
        placeholder: "Nhập chiều dài (m)",
        disabledWhen: ["Thép Cuộn"], // ✅ Add disable condition
      }
    ];
    const catalogFieldRight = [
      {
        label: "KG/M",
        type: "text",
        name: "weightpermeter",
        placeholder: "Nhập KG/M",
        disabledWhen: ["Thép Cuộn"], // ✅ Add disable condition
      },
      {
        label: "KHỐI LƯỢNG CUỘN (kg)",
        type: "text",
        name: "weightperroll",
        disabledWhen: ["Thép Thanh"], // ✅ Add disable condition
      },
      {
        label: "LOẠI THÉP",
        type: "select",
        name: "type",
        options: [
          { value: "#", label: "Chọn loại thép" },
          { value: "Thép Thanh", label: "Thép Thanh" },
          { value: "Thép Cuộn", label: "Thép Cuộn" },
        ],
      },
      {
        label: "KHỐI LƯỢNG BÓ (kg)",
        type: "text",
        name: "weightperbundle",
        disabledWhen: ["Thép Cuộn"], // ✅ Add disable condition
      },
    ];

  const renderField = (field) => {
    const isDisabled = field.disabledWhen?.includes(formData.type) || false;


    switch (field.type) {
      case "text":
        return (

          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={formData && formData[field.name] ? formData[field.name] : ""}
            onChange={(e) => handleChange(e)}
        
            disabled={isDisabled}
            className={`flex h-8 w-full rounded border border-gray-300 px-2 py-1 text-sm ${
            isDisabled 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-white'
          }`} //

          />
        );
        

      case "select":
        return (
          <select
            type={field.type}
            className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
            name={field.name}
            value={formData && formData[field.name] ? formData[field.name] : ""}
            onChange={(e) => {handleChange(e);}}
          >
            {field.options.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
    }
  };

  return (
    <div className="py-10 fixed inset-0 z-50 flex items-center justify-center">
    <div className="fixed inset-0 bg-black/50"></div>
     <div className="relative z-50">
      
      <div className=" max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-lg w-full mx-4 p-4">
         <button className="text-red-600 bg-red-50 hover:text-red-700 hover:bg-red-100 p-1 h-8 w-8 rounded text-center"
              onClick={() => setShowForm(false)}
              >
            <svg className="h-full w-full text-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">

            {catalogFieldLeft.map((field,i) => (
              <div className="space-y-2" key={i}>
                <label className="flex flex-row text-sm font-bold text-gray-800 ">
                  <div className="">
                    {field.label}
                  </div>

                  
                  
                  {formErrors && formErrors[field.name] && (
                  <span className="grow w-auto inline-block font-medium text-right text-red-500 text-xs ml-auto mt-1">
                      {formErrors[field.name]}
                    </span>
                  )}

                  </label>
                  {renderField(field, i)}
                </div>
              )
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
        {catalogFieldRight.map( (field, i) => (
                <div className="space-y-2" key={i}>
                  <label className="flex flex-row text-sm font-bold text-gray-800 ">
                    {field.label}

                    {formErrors && formErrors[field.name] && (
                  <span className="grow text-red-500 text-xs mt-1 text-right">
                      {formErrors[field.name]}
                    </span>
                  )}

                  </label>
                  {renderField(field, i)}
                </div>
              )
            )}
            
          </div>
        </div>
         <div className="mt-5 flex gap-2 justify-end">
              <button
               
                className="inline-flex items-center px-4 py-2 border border-gray-400 rounded bg-white text-sm text-black hover:bg-gray-50 shadow-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                onClick={() => {handleSubmit()}}
                // disabled={
                //   !selectedProducts ||
                //   selectedProducts.length === 0 ||
                //   !checkNumberOfBars()
                // }

              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo đơn bù
              </button>
              
              </div>
      </div>
      </div>
    </div>
  );
};
