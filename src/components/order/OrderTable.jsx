import React, {useState, useEffect} from "react";

const OrderTable = ({ selectedProducts, setSelectedProducts, productList, totalBars, totalWeight }) => {
  // Handler for changing product fields (e.g. quantity)
  
  // useEffect(() => {

  //   const filtered = new Map();
  //   if(selectedProducts.length > 1) {
  //     selectedProducts.forEach((item,index) => {
  //       const key =`${item.name}-${item.brandname}`;
  //       if(filtered.has(key)){
  //         filtered.set(key,{...selectedProducts[index],numberofbars: item.numberofbars + 1}); 
  //       } else {
  //         filtered.set(key,{...selectedProducts[index]}); 
  //       }
  //     })

  //     setSelectedProducts(Array.from(filtered.values()).sort((a,b) => a.trueId - b.trueId));
  //   } 
  // }, [selectedProducts, setSelectedProducts]);
  const handleProductFieldChange = (id, field, value) => {
    if (
      (field === "numberofbars" || field === "weight") &&
      (isNaN(value) || value === '' || Number(value) < 0)
    ) {
      return; // Do not update if invalid
    }
    let updateProduct = selectedProducts.find(product => product.trueId === id);
    
    if(updateProduct)  {
      updateProduct[field] = value;
      

      if(field === "numberofbars") {
        let w = (updateProduct.catalog?.weightperbundle / updateProduct.catalog?.barsperbundle) * value; // Assuming weight is calculated based on catalog length and number of bars
        updateProduct.weight = w.toFixed(2); // Update weight based on number of bars 
      }

      if(field === "name"){
        // let steelType = value.match("/(?<=CB)(D\d+)/");

        let brand = updateProduct.brandname || '';
        if(brand.trim() !== ''){
          const foundProduct = productList.find(product => product.brandname === brand && product.name === value)
          if(foundProduct){
            updateProduct = foundProduct; // Update the product with the found one
            updateProduct.trueId = id; // Re attach trueId to the updated product
            console.log(updateProduct);
          }
        }

      }

      if(field === "brandname"){
        // let steelType = value.match("/(?<=CB)(D\d+)/");

        let name = updateProduct.name || '';
        if(name.trim() !== ''){
          const foundProduct = productList.find(product => product.brandname === value && product.name === name)
          if(foundProduct){
            updateProduct = foundProduct; // Update the product with the found one
            updateProduct.trueId = id; // Re attach trueId to the updated product
            console.log(updateProduct);
          }
        }

      }

      setSelectedProducts((selectedProducts.filter(
        product => product.trueId !== id).concat(updateProduct)).sort((a, b) =>{
          if(a.trueId < b.trueId) return -1;
          if(a.trueId > b.trueId) return 1;
          return 0;
        } ));
    }
   
  };

  const deleteProduct = (id) =>{
    const updatedProducts = selectedProducts.filter(product => product.trueId !== id).sort ((a,b) => {
      if(a.trueId < b.trueId) return -1;
      if(a.trueId > b.trueId) return 1;
      return 0;
    });

    selectedProducts.forEach((product, index) =>{
      if(product.trueId > id) 
        product.trueId = product.trueId - 1; // Decrement trueId for products after the deleted one
    });

    setSelectedProducts(updatedProducts);
  }

  const addBlankProduct = () => {
    const newProduct = {
      trueId : selectedProducts.length === 0 ? 1 : selectedProducts[selectedProducts.length - 1].trueId + 1,
      name: '',
      namedetail: '',
      brandname: '',
      numberofbars: '',
      weight: '',
      note: '',
      catalog: [
        {
          length: 0,
        },
      ],

    }

    const products = [...selectedProducts, newProduct];
    setSelectedProducts(products.sort((a,b) => a.trueId - b.trueId));
  }
 
  return (
    <div className="m-4 bg-white border-1 border-gray-600 overflow-hidden">
      <div className="h-full flex flex-col">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-5">STT</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-16">Mã hàng</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-20">Tên hãng</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-20">Tên hàng hóa</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-9">Dài</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-9">Số lượng</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-9">Khối lượng</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-20">Ghi chú</th>
              <th className=" px-2 py-2 text-xs font-bold text-black w-5"></th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product, index) => (
              <tr key={product.trueId || index}>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-5">{product.trueId}</td>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-16">
                    {/* <input
                      type="text"
                      className="w-full h-full focus:outline-none"
                      value={product.name || ''}
                      onChange={e => handleProductFieldChange(product.trueId, "name", e.target.value)}
                    /> */}
                    {product.name}
                </td>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-20">
                    {/* <input
                      type="text"
                      className="w-full h-full focus:outline-none"
                      value={product.brandname || ''}
                      onChange={e => handleProductFieldChange(product.trueId, "brandname", e.target.value)}
                    /> */}
                    {product.brandname}
                </td>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-20">
                  {/* <input
                    type="text"
                    className="w-full h-full focus:outline-none"
                    value={product.namedetail || ''}
                    onChange={e => handleProductFieldChange(product.trueId, "namedetail", e.target.value)}
                  /> */}
                  {product.namedetail}
                </td>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-9">
                  {/* <input
                    type="text"
                    className="w-full h-full focus:outline-none"
                    value={product.catalog?.length || ''}
                    onChange={e => handleProductFieldChange(product.trueId, "catalog.length", e.target.value)}
                  /> */}
                  {product.catalog?.length}
                </td>
                <td className="border border-gray-800  py-2 text-xs text-black w-9">
                  <input
                    type="number"
                    className="w-full h-full focus:outline-none"
                    value={product.numberofbars || ''}
                    onChange={e => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) { // Only allow non-negative integers
                          handleProductFieldChange(product.trueId, "numberofbars", val === '' ? '' : Number(val));
                        }
                      }}
                  />
                </td>
                <td className="border border-gray-800  py-2 text-xs text-black w-9">
                  <input
                    type="number"
                    className="w-full h-full focus:outline-none"
                    value={product.weight || ''}
                    onChange={e => {
                      const val = e.target.value;
                      if (/^\d*\.?\d*$/.test(val)) { // Only allow non-negative numbers
                        handleProductFieldChange(product.trueId, "weight", val === '' ? '' : Number(val));
                      }
                    }}
                  />
                </td>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-20">
                  <input
                    type="text"
                    className="w-full h-full focus:outline-none"
                    value={product.note || ""}
                    onChange={e => handleProductFieldChange(product.trueId, "note", e.target.value)}
                  />
                </td>
                <td className="py-1 text-xs text-black">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" fill="currentColor" 
                    className="size-6"
                    onClick={() => deleteProduct(product.trueId)}>
                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                  </svg>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-gray-800 px-2 py-2 pl-15 text-xs font-bold text-black w-12" colSpan={5}>Tổng cộng</td>
              <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">{totalBars}</td>
              <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">{Number(totalWeight).toFixed(2)}</td>
              <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12"></td>
            </tr>
            <tr>
              <td 
                className="py-2 border border-gray-800 p-0 text-xs font-bold text-black w-12"
                colSpan={8}
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {/* <div className="flex items-center justify-center h-full w-full">
                  <button onClick={addBlankProduct} className=" border rounded-md border-gray-100 shadow-lg flex px-2 py-[2px]  text-center items-center justify-center bg-white hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 pr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p>Thêm thông tin</p>
                  </button>
                </div> */}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex-1 bg-white">
          <div className="h-64"></div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
