import React,{useRef,useState} from "react";

const ProductSearch = ({
  inputProduct, // input valure for search bar
  setInputProduct,
  productList, // list of products to search from
  productFilteredSuggestions, // list of products that match the search input
  setProductFilteredSuggestions,
  selectedProducts, // product list that gonna be added to the order
  setSelectedProducts,
  setActiveTab // để show cái form tạo sản phẩm mới
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


  const handleProductInputChange = (e) => {
    const value = e.target.value;
    setInputProduct(value);
    console.log("productList", productList);
    const filteredSuggestions = productList.filter(
      product =>
        product.namedetail.trim().toLowerCase().includes(value.trim().toLowerCase()) ||
        product.brandname.trim().toLowerCase().includes(value.trim().toLowerCase())
    );
    setProductFilteredSuggestions(filteredSuggestions);
  };

  const handleProductSelect = (product) => {
    setInputProduct(product.name);
    setProductFilteredSuggestions([]);

    const existingIndex = selectedProducts.findIndex(
      (item) => item.name === product.name
    )

    if(existingIndex !== -1) {
      const updatedProductList = selectedProducts.map(
        (item, idx) => existingIndex === idx 
        ? {...item, numberofbars: (item.numberofbars || 0) + 1} 
        : item
      );
      setSelectedProducts(updatedProductList);
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
      }
    }
  };

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
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && productFilteredSuggestions.length > 0 && (
          <ul className="z-50 absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto"
          ref={dropdownRef}
          tabIndex={-1}
          onBlur={handleBlur}>
            {productFilteredSuggestions.map((product, index) => (
              <li key={index}>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-200"
                  onClick={() => {handleProductSelect(product)
                    setShowSuggestions(false);
                  }}
                  onMouseDown={e => e.preventDefault()} // Prevent input blur before click
                >
                  {product.brandname} - {product.namedetail}
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
