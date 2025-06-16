import React from "react";

const ProductSearch = ({
  inputProduct,
  setInputProduct,
  productList,
  productFilteredSuggestions,
  setProductFilteredSuggestions,
  selectedProducts,
  setSelectedProducts,
}) => {
  const handleProductInputChange = (e) => {
    const value = e.target.value;
    setInputProduct(value);
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
    product.trueId = selectedProducts.length === 0 ? 1 : selectedProducts[selectedProducts.length - 1].trueId + 1;
    product.weight = '';
    product.numberofbars = '';
    setSelectedProducts([...selectedProducts, product]);
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
      <div className="relative rounded-md">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm mã hàng hóa, tên hàng hóa"
          className="w-[94%] pl-10 pr-4 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputProduct}
          onChange={handleProductInputChange}
          onKeyDown={handleKeyDown}
        />
        {productFilteredSuggestions.length > 0 && (
          <ul className="z-50 absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
            {productFilteredSuggestions.map((product, index) => (
              <li key={index}>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-200"
                  onClick={() => handleProductSelect(product)}
                >
                  {product.brandname} - {product.namedetail}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button className=" ml-1 pb-2 py-2 pt-1 w-[5%] aspect-square justify-center border border-gray-300 rounded text-sm bg-white align-bottom hover:bg-gray-100 hover:border-gray-400" verticalAlign="bottom" align>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 pl-2 text-gray-500" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      
    </div>
  );
};

export default ProductSearch;
