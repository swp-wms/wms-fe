import React, {useState,useEffect, use} from "react";
import toast, { Toaster } from 'react-hot-toast';

const EditTable = ({ selectedProducts, setSelectedProducts, productList, totalBars, totalWeight, delivery, setDelivery }) => {
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
  

  const isAddedToDelivery = (id) => {
    const orderDetailIds = delivery.flatMap(
      order => order.deliverydetail.map(detail => detail.orderdetailid)
    );

    return orderDetailIds.some(item => parseInt(item) === parseInt(id));
  };


  const handleProductFieldChange = (product, field, value) => {
    const id = product.trueId;
    if (
      (field === "numberofbars" || field === "weight") &&
      (isNaN(value) || value === '' || Number(value) < 0)
    ) {
      return; // Do not update if invalid
    }
    let updateProduct = selectedProducts.find(product => product.trueId === id);
    
    if(updateProduct)  {
      updateProduct = {...updateProduct}; // Remember the lost attribute bug? this preserves the original object 's attributes
      
//-----------------HANDLE NUMBER OF BARS AND WEIGHT-----------------
      if(field === "numberofbars") {
        if(!updateProduct.hasOwnProperty('oldNumberOfBars')){
          updateProduct.oldNumberOfBars = updateProduct.numberofbars;
        }
        
        
        if (parseInt(value) < parseInt(updateProduct.oldNumberOfBars) && isAddedToDelivery(product.orderdetailid)) {
          
          toast.error("Không thể giảm số lượng sản phẩm đã được thêm vào đơn giao hàng")
          return;
        }else{

          
          if(updateProduct.catalog?.type === "Thép Thanh") {
            let w = (updateProduct.catalog?.weightperbundle / updateProduct.catalog?.barsperbundle) * value; // Assuming weight is calculated based on catalog length and number of bars
            updateProduct.weight = w.toFixed(2); // Update weight based on number of bars
          }
          if(updateProduct.catalog?.type === "Thép Cuộn") {
            let w = (updateProduct.catalog?.weightperroll * value);
            updateProduct.weight = w.toFixed(2);
          }
        }
      }
      if(field === "name"){
        // let steelType = value.match("/(?<=CB)(D\d+)/");

        let brand = updateProduct.brandname || '';
        if(brand.trim() !== ''){
          const foundProduct = productList.find(product => product.brandname === brand && product.name === value)
          if(foundProduct){
            updateProduct = { ...updateProduct, ...foundProduct, trueId: id };
            
          }
        }

      }

      if(field === "brandname"){
        // let steelType = value.match("/(?<=CB)(D\d+)/");

        let name = updateProduct.name || '';
        if(name.trim() !== ''){
          const foundProduct = productList.find(product => product.brandname === value && product.name === name)
          if(foundProduct){
            updateProduct = { ...updateProduct, ...foundProduct, trueId: id };
          }
        }

      }
      updateProduct[field] = value;

      setSelectedProducts((selectedProducts.filter(
        product => product.trueId !== id).concat(updateProduct)).sort((a, b) =>{
          if(a.trueId < b.trueId) return -1;
          if(a.trueId > b.trueId) return 1;
          return 0;
        } ));
    }
   
  };

  const deleteProduct = (item) =>{
    if(isAddedToDelivery(item.orderdetailid) ) {
      toast.error("Không thể xóa sản phẩm đã được thêm vào đơn giao hàng");
      return;
    } else {
      const updatedProducts = selectedProducts.filter(product => product.trueId !== item.trueId).sort ((a,b) => {
        if(a.trueId < b.trueId) return -1;
        if(a.trueId > b.trueId) return 1;
        return 0;
      });
      

      selectedProducts.forEach((product, index) =>{
        if(product.trueId > item.trueId) 
          product.trueId = product.trueId - 1; // Decrement trueId for products after the deleted one
      });

      setSelectedProducts(updatedProducts);
    }
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
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-4">STT</th>
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
            {selectedProducts.map((orderDetail, index) => (
              <tr key={orderDetail.trueId || index}>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-4">{orderDetail.trueId}</td>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-16">
                    
                    {orderDetail.name}
                </td>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-20">
                    
                    {orderDetail.brandname}
                </td>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-20">
           
                  {orderDetail.namedetail}
                </td>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-9">
                 
                  {orderDetail.catalog?.length}
                </td>
                <td className="border border-gray-800  py-2 text-xs text-black w-9">
                  <input
                    type="number"
                    className="w-full h-full focus:outline-none px-2 py-2"
                    value={orderDetail.numberofbars || ''}
                    onChange={e => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) { // Only allow non-negative integers
                          handleProductFieldChange(orderDetail, "numberofbars", val === '' ? '' : Number(val));
                        }
                      }}
                  />
                </td>
                <td className="border border-gray-800  py-2 text-xs text-black w-9">
                  <input
                    type="number"
                    className="w-full h-full focus:outline-none px-2 py-2"
                    value={orderDetail.weight || ''}
                    onChange={e => {
                      const val = e.target.value;
                      if (/^\d*\.?\d*$/.test(val)) { // Only allow non-negative numbers
                        handleProductFieldChange(orderDetail, "weight", val === '' ? '' : Number(val));
                      }
                    }}
                  />
                </td>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-20">
                  <input
                    type="text"
                    className="w-full h-full focus:outline-none "
                    value={orderDetail.note || ""}
                    onChange={e => handleProductFieldChange(orderDetail, "note", e.target.value)}
                  />
                </td>
                <td className="py-1 text-xs text-black flex flex-col gap-1 justify-items-center align-items-center" >
           <svg xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="size-4">
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>


                  <svg xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" fill="currentColor" 
                  className="size-4 hover:cursor-pointer text-red-700"
                  onClick={() => deleteProduct(orderDetail)}>
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
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

export default EditTable;
