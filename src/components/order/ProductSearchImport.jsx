import React,{useRef,useState,useEffect} from "react";
import order from "../../backendCalls/order"
import partner from "../../backendCalls/partner";

const ProductSearch = ({
  selectedPartner,
  inputProduct, // input valure for search bar
  setInputProduct,
  setInputpartner, 
  inputpartner, // input value for partner search bar
  productList, // list of products to search from
  productFilteredSuggestions, // list of products that match the search input
  setProductFilteredSuggestions,
  selectedProducts, // product list that gonna be added to the order
  setSelectedProducts,
  setActiveTab, // để show cái form tạo sản phẩm mới
  refresh, // state to trigger re-rendering of the table
  setRefresh // function to set the refresh state
}) => {
     const [showSuggestions, setShowSuggestions] = useState(false);
     const [productByPartner, setProductByPartner] = useState([]);
     const [generalProductList, setGeneralProductList] = useState([]);
     
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

      useEffect(() =>{
        const getProductGeneral = async () => {
          try {
            const response = await order.getProductGeneral();
            setGeneralProductList(response);
          } catch (error) {
          }
        }
        getProductGeneral();
       
      },[]);

useEffect(() => {
  if (!selectedPartner) return;
  if (selectedPartner.isfactory === true) {
    setSelectedProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product => {
        const matchingProduct = productList.find(item =>
          item.name === product.name && item.partnerid === selectedPartner?.id
        );
        //if found, then join product with the matching product founded
        if (matchingProduct) {
          console.log("matching product, factory:", matchingProduct)
          return {
            ...matchingProduct,
            trueId: product.trueId,
            numberofbars: product.numberofbars,
            note: product.note,
            orderdetailid: product.orderdetailid
          };
        } else {
          const generalProduct = generalProductList.find(item => item.name === product.name);
          console.log("general product factory:", generalProduct);
          return {
            trueId: product.trueId,
            ...generalProduct,
            partnerid: null,
            numberofbars: product.numberofbars,
            note: product.note,
            orderdetailid: product.orderdetailid
          }
        }
      });

      const hasChanges = updatedProducts.some((updatedProduct, index) => {
        const originalProduct = prevProducts[index];
        return (
          updatedProduct.id !== originalProduct.id ||
          updatedProduct.partnerid !== originalProduct.partnerid ||
          updatedProduct.brandname !== originalProduct.brandname ||
          updatedProduct.catalog?.length !== originalProduct.catalog?.length
        );
      });

      return hasChanges ? updatedProducts : prevProducts;
    });
  }
}, [selectedPartner, productList]);

// Handle selectedProducts changes for non-factory
useEffect(() => {
  if (selectedPartner && selectedPartner?.isfactory === true) return; // Skip if is a factory partner
  

  setSelectedProducts(prevProducts => {
    const updatedProducts = prevProducts?.map(product => {
      const matchingProduct = productList.find(item => item.name === product.name && item.partnerid === selectedPartner?.id && item.brandname == product.brandname);
      if(matchingProduct){
        console.log("matching product, not factory: ",matchingProduct);
        // If a matching product is found, return the product with the matching product details
        return {
          trueId: product.trueId,
           ...matchingProduct,
           

        };
      }
      else{
        const general = generalProductList.find(item => item.name === product.name)

        console.log("product not found in productList, using generalProductList: ", general);

         return {
          trueId: product.trueId,
          ...general,
          partnerid: null, // Set partnerid to null if not found
         }
      }
    });

   


    // Only update if there are actual changes
    const hasChanges = updatedProducts.some((product, index) => {
     const originalProduct = prevProducts[index];
      return (
        product.id !== originalProduct.id ||
        product.partnerid !== originalProduct.partnerid ||
        product.brandname !== originalProduct.brandname ||
        product.catalog?.length !== originalProduct.catalog?.length
      );
    });
    
    return hasChanges ? updatedProducts : prevProducts;
    // //return to prev if no changes
  });
}, [selectedPartner, productList, selectedProducts]);

  

  useEffect(() => {
    const handleProductSuggestionOnPartnerChange = () =>{
    const value = inputProduct;
    if(inputProduct.trim() === "" || inputProduct === null) {
      setProductFilteredSuggestions(productByPartner);
      
      return
    }
    
    if(selectedPartner != null) {
      
      const filteredSuggestions = productByPartner.filter(
      product =>
       (product.namedetail.trim().toLowerCase().includes(value.trim().toLowerCase()) ||
        product.name.trim().toLowerCase().includes(value.trim().toLowerCase())) &&
        product.partnerid === selectedPartner?.id
      );
      setProductFilteredSuggestions(filteredSuggestions);  
    }else{
      
      const filteredSuggestions = productByPartner.filter(
        product =>
          product.namedetail.trim().toLowerCase().includes(value.trim().toLowerCase()) ||
          product.name.trim().toLowerCase().includes(value.trim().toLowerCase())
      );  
      setProductFilteredSuggestions(filteredSuggestions);
      }
    };

    const handleProductByPartner = () => {
        console.log("selectedPartner is factory: ",selectedPartner?.isfactory == true);
    
      if(selectedPartner != null ){
        const product = productList.filter(
          product => product.partnerid === selectedPartner?.id
        );
        console.log("Product by partner print within handleProductByPartner: ", product);
        setProductByPartner(product);
        handleProductSuggestionOnPartnerChange();
      }else{
        setProductByPartner(productList);
        handleProductSuggestionOnPartnerChange();
      }


    }
    handleProductByPartner(); 
  },[selectedPartner, refresh, inputProduct, productList, generalProductList])


  
  const handleProductInputChange = (e) => {
    const value = e.target.value;
    setInputProduct(value);

    if(selectedPartner != null) {
      
      const filteredSuggestions = productByPartner.filter(
      product =>
        product.namedetail.trim().toLowerCase().includes(value.trim().toLowerCase()) ||
        product.name.trim().toLowerCase().includes(value.trim().toLowerCase())
      );
      setProductFilteredSuggestions(filteredSuggestions); 
    }
    
  };

  const handleProductSelect = (product) => {
    setInputProduct(product.name);
    setProductFilteredSuggestions([]);

    const existingIndex = selectedProducts.findIndex(
      (item) => item.name === product.name
    )


    //if user select an duplicate product to the list, increate 
    // the numberofbars of that product by 1
    if(existingIndex !== -1) {
      const updatedProductList = selectedProducts.map(
        (item, idx) => {
          if(product.type == "Thép Thanh") {
          return existingIndex === idx
            ? { ...item, numberofbars: (item.numberofbars || 0) + 1 }
            : item;
          }else{
            return existingIndex === idx
              ? { ...item, numberofbars: '' }
              : item;
          }


        }
      );
      setSelectedProducts(updatedProductList);
      findSimilarProduct();
    } else {
      // setSelectedProducts()
      // product.trueId = selectedProducts.length === 0 ? 1 : selectedProducts[selectedProducts.length - 1].trueId + 1;
      // product.weight = '';
      // product.numberofbars = '';
      // const filtered = new Map();

      setSelectedProducts([...selectedProducts, {
        ...product,
        trueId: selectedProducts.length === 0 ? 1 : selectedProducts[selectedProducts.length - 1].trueId + 1,
        
        
      }]);
      // findSimilarProduct();
    }
    
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const trimmedInput = inputProduct.trim().toLowerCase();
      const matched = productList.find((item) =>
        ["namedetail", "brandname"].some((key) => item[key]?.trim().toLowerCase() === trimmedInput)
      );
      if (matched) {
        handleProductSelect(matched);
        setProductFilteredSuggestions([]);
      }
    }
  };
  console.log("Selected Products: ", selectedProducts);
  return (
    <div className="bg-white border-2 border-white rounded-md p-4">
      <div className="relative rounded-md flex flex-row ">
        <div className="relative flex-grow ">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm mã hàng hóa, tên hàng hóa"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputProduct}
          onChange={handleProductInputChange}
          
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={(e) => {setShowSuggestions(true)
                handleProductInputChange(e);
          }}
        />
        {showSuggestions && (
          <ul className="z-50 absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto"
          ref={dropdownRef}
          tabIndex={-1}
          onBlur={handleBlur}>
            {productFilteredSuggestions.length == 0 && (
              <>
              {selectedPartner === null && (
                <div className="px-3 py-2 text-gray-500">Chọn đối tác để tìm kiếm sản phẩm</div>
              )}
              {selectedPartner !== null && (
              <div className="px-3 py-2 text-gray-500">Không tìm thấy sản phẩm nào</div>
              )}
              </>
            )}
            {productFilteredSuggestions.length > 0  && productFilteredSuggestions.map((product, index) => (
              <li key={index}>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-200"
                  onClick={() => {handleProductSelect(product)
                    setShowSuggestions(false);
                  }}
                  onMouseDown={e => e.preventDefault()} // Prevent input blur before click
                >
                  {product.brandname} - {product.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        </div>
        <button className=" size-9.5 py-2 ml-1 justify-center  aspect-square border border-gray-300 rounded text-sm bg-white hover:bg-gray-100 hover:border-gray-400" 
        onClick={() => setActiveTab('product')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 pl-2 text-gray-500 align-middle" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      
    </div>
  );
};

export default ProductSearch;
