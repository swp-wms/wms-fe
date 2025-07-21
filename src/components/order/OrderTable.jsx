import React, {useState, useEffect} from "react";
import { toast } from "react-hot-toast";
import Popup from 'reactjs-popup';
import order from "../../backendCalls/order";
import '../../index.css';

const OrderTable = ({ selectedProducts, setSelectedProducts, selectedPartner, productList, totalBars, totalWeight, setActiveTab,TYPE }) => {
  // Handler for changing product fields (e.g. quantity)
     const [exportOrders, setExportOrders] = useState(null); // store export order details

      useEffect(() => {
         const fetchExportOrders = async () => {
           try {
             const response = await orderCalls.fetchExportOrders();
             setExportOrders(response.filter((order => 
                                                      order.date.split("T")[0] === new Date().toISOString().split("T")[0]
                                                    && order.status !== "XONG" 
                                                    && order.status !=="HỦY" ))); // filter orders by today's date and not completed
           } catch (error) {
             console.error("Error fetching export orders:", error);
           }
         };
         fetchExportOrders();
       }, []);
  useEffect(() => {

    // const filtered = new Map();
    // if(selectedProducts.length > 1) {
    //   selectedProducts.forEach((item,index) => {
    //     const key =`${item.name}-${item.brandname}`;
    //     if(filtered.has(key)){
    //       filtered.set(key,{...selectedProducts[index],numberofbars: item.numberofbars + 1}); 
    //     } else {
    //       filtered.set(key,{...selectedProducts[index]}); 
    //     }
    //   })

    //   setSelectedProducts(Array.from(filtered.values()).sort((a,b) => a.trueId - b.trueId));
    // } 

  const checkNumberOfBars = () => {
    
    const invalidProducts = selectedProducts.filter(product => product.numberofbars <= 0 && product.type === 'Thép Thanh');
    
    if(invalidProducts.length > 0) {
      toast.error("Số lượng hàng hóa mỗi loại phải lớn hơn 0");
      return false;
    }
    return true;
  }
  checkNumberOfBars();

  

  }, [selectedProducts, setSelectedProducts]);

  


  const handleProductFieldChange = (id, field, value) => {
    if (
      (field === "numberofbars" || field === "weight") 
      && value === '' 
      && (isNaN(value) ||  Number(value) < 0)
    ) {
      return; // Do not update if invalid
    }
    let updateProduct = selectedProducts.find(product => product.trueId === id);
    
    if(updateProduct) {
    
    updateProduct = {
      ...updateProduct,
      [field]: value
      };
      
      if(field === "numberofbars") {
        if(updateProduct.catalog?.type === "Thép Thanh") {
          let w = (updateProduct.catalog?.weightperbundle / updateProduct.catalog?.barsperbundle) * value; // Assuming weight is calculated based on catalog length and number of bars
          updateProduct.weight = w.toFixed(2); // Update weight based on number of bars
        } else if (value === '') {
          // ✅ Clear weight when number of bars is cleared
          updateProduct.weight = '';

        }

        //if creating an Export Order, we need to check if the product quantity is available for export or not
        if(TYPE === "E"){
          const selectedProduct = productList.find(product => product.trueId === id);
          const totalBarAvailable = selectedProduct?.totalbar || 0 // the total bars available in the inventory
          const totalWeightAvailable = selectedProduct?.totalweight || 0 // the total weight available in the inventory
          
          // gathering unfinished export orders in the same day
          // to get the total number of bars and weight that gonna be exported
          if(exportOrders){
            const similarProducts = exportOrders.map(order =>{
              const similarProductInAnotherOrder = order.orderdetail.find(detail => detail.productid === id);
              
              return similarProductInAnotherOrder;
            })
            .filter(product => product !== undefined);
            console.log("similarProducts: ", similarProducts);
            
            
            const totalExportBars = similarProducts.reduce((sum, product) => (sum += product.numberofbars || sum),0)
            const totalExportWeight = similarProducts.reduce((sum, product) => (sum += product.weight || sum),0)
            totalBarAvailable -= totalExportBars  ;
            totalWeightAvailable -= totalExportWeight;
          }
          totalBarAvailable < 0? 0: totalBarAvailable;
          totalWeightAvailable < 0? 0: totalWeightAvailable;
          if(value > totalBarAvailable){
            toast.error(`Số lượng hàng hóa không đủ để xuất, chỉ còn ${totalBarAvailable} cây`);
            updateProduct.numberofbars = totalBarAvailable;
            updateProduct.weight = (totalWeightAvailable / totalBarAvailable * totalBarAvailable).toFixed(2);
          } 
          
          else if(value * updateProduct.catalog?.weightperbundle / updateProduct.catalog?.barsperbundle > totalWeightAvailable){
            toast.error(`Khối lượng hàng hóa không đủ để xuất, chỉ còn ${totalWeightAvailable} KG`);
            updateProduct.weight = totalWeightAvailable;
          }
        }
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
 
  const handleBrandNameSelect = (e,product) =>{
    const selectedid= e.target.value;
    const selected = product.matchingProduct.find(p => p.id == selectedid);
    console.log("selected: ", selected);
    
  
  // Update the product's brandname using your existing function
  console.log("Selected brand name: ", selected.catalog.brandname);
  handleProductFieldChange(product.trueId, "brandname", selected.catalog.brandname);
  

  console.log("Selected partner: ", selected.partner);
  handleProductFieldChange(product.trueId, "partner", selected.partner);
  
  console.log("Selected catalog: ", selected.catalog);
  handleProductFieldChange(product.trueId, "catalog", selected.catalog);

  }

  const popupTableRow = (product, index) =>{
    const extractSteelType = (productName) => {
    if (!productName) return '';
    const match = productName.match(/D\d+/);
    return match ? match[0] : '';
  };
  
  const handleAddProductToForm = () => {
    const initialData = {
      product: {
        trueId: product.trueId,
        name: product.name || '',
        namedetail: product.namedetail || '',
        brandname: product.brandname || '',
        steeltype: extractSteelType(product.name),
        type: product.catalog?.type || '',
        partnerid: selectedPartner?.id || ''
      },
      catalog: {
        brandname: product.brandname || '',
        steeltype: extractSteelType(product.name),
        type: product.catalog?.type || '',
        length: product.catalog?.length || 0,
        barsperbundle: product.catalog?.barsperbundle || 0,
        weightpermeter: product.catalog?.weightpermeter || null,
        weightperbundle: product.catalog?.weightperbundle || null,
        weightperroll: product.catalog?.weightperroll || null,
        standard: product.catalog?.standard || ''
      }
    };

    // Call setActiveTab with data
    setActiveTab('product', initialData);
  };

    return (
     <Popup
        key={product.trueId || index}
        trigger={
              <tr >
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-2">{product.trueId}</td>
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
                   {TYPE == "I" ? (
                      <>
                        {/* Show brandname for factory partners */}
                        {selectedPartner && selectedPartner.isfactory && (
                          <span>{product.brandname}</span>
                        )}
                        
                        {/* Show select for non-factory partners or when no partner selected */}
                        {(!selectedPartner || !selectedPartner.isfactory) && (
                          <select onChange={(e) => handleBrandNameSelect(e, product)}>
                            <option value="">Chọn hãng</option>
                            {product.matchingProduct?.map((p, index) => (
                              <option key={index} value={p.id}>{p.brandname}</option>
                            ))}
                          </select>
                        )}
                      </>
                    ) : (
                      <span>{product.brandname}</span>
                    )}

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
                <td className="border border-gray-800  py-2 text-xs text-black w-9 disabled:bg-gray-100">
                  <input
                    type="number"
                    className="w-full h-full py-5 focus:outline-none disabled:bg-gray-100"
                    value={product.numberofbars || ''}
                    disabled = {product.catalog?.type === "Thép Cuộn"}
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
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-20" >
                  <div className="flex flex-row gap-1 justify-around justify-items-center align-items-center">
                   
                  <button className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-200 rounded transition-colors" 
                     onClick={() => deleteProduct(product.trueId)} title="Xóa">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                  </button>

                  </div>
                </td>
              </tr>
        }
        on="hover"
        position="top center"
        arrow={true}
        arrowStyle={{ 
                    
                    color: 'white',           // White arrow to match background
                          // Solid border style
      
                    }}
        contentStyle={{ 
                        background: 'white',      // White background
                        color: 'black',           // Black text
                        border: '1px solid black', // Black border around popup
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        fontSize: '12px',
                        maxWidth: '300px',
                        zIndex: 1000
                      }}
        >
            Mặt hàng này chưa tồn tại, bạn có muốn thêm thông tin?
            <button className="mx-2 p-1.5 flex text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-200 rounded transition-colors" 
                        title="Chỉnh sửa"
                        onClick={() => handleAddProductToForm()}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        <div className="mx-1">
                        Thêm hàng hóa
                        </div>
                  </button>
              </Popup>
              );
  }

  const normalTableRow = (product, index) => {
    return(
    <tr key={product.trueId || index}>
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-2">{product.trueId}</td>
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
                    {TYPE == "I" ? (
                      <>
                        {/* Show brandname for factory partners */}
                        {selectedPartner && selectedPartner.isfactory && (
                          <span>{product.brandname}</span>
                        )}
                        
                        {/* Show select for non-factory partners or when no partner selected */}
                        {(!selectedPartner || !selectedPartner.isfactory) && (
                          <select onChange={(e) => handleBrandNameSelect(e, product)}>
                            <option value="">Chọn hãng</option>
                            {product.matchingProduct?.map((p, index) => (
                              <option key={index} value={p.id}>{p.brandname}</option>
                            ))}
                          </select>
                        )}
                      </>
                    ) : (
                      <span>{product.brandname}</span>
                    )}

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
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-9 disabled:bg-gray-100">
                  {/* <input
                    type="text"
                    className="w-full h-full focus:outline-none"
                    value={product.catalog?.length || ''}
                    onChange={e => handleProductFieldChange(product.trueId, "catalog.length", e.target.value)}
                  /> */}
                  {product.catalog?.length || ''}
                  
                </td>
                <td className="border border-gray-800  py-2 text-xs text-black w-9 disabled:bg-gray-100">
                  <input
                    type="number"
                    className="w-full h-full py-5 focus:outline-none disabled:bg-gray-100"
                    value={product.numberofbars || ''}
                    disabled = {product.catalog?.type === "Thép Cuộn"}
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
                <td className="border border-gray-800 px-2 py-2 text-xs text-black w-20" >
                  <div className="flex flex-row gap-1 justify-around justify-items-center align-items-center">
                   
                  <button className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-200 rounded transition-colors" 
                     onClick={() => deleteProduct(product.trueId)} title="Xóa">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                  </button>

                  </div>
                </td>
              </tr>
    );
  }

  /*  [
      {
        
        trueId: 1,
        name: "Thép D10",
        namedetail: "Thép tròn D10",
        brandname: "Hòa Phát",
        numberofbars: 10,
        weight: 100,
        note: "Ghi chú về thép D10",
        
      }
    ]*/
  return (
    <div className="m-4 bg-white border-1 border-gray-600 overflow-hidden">
      <div className="h-full flex flex-col">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-2">STT</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-16">Mã hàng</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-20">Tên hãng</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-20">Tên hàng hóa</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-9">Dài (m)</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-9">Số lượng (cây)</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-9">Khối lượng (KG)</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-20">Ghi chú</th>
              <th className="border border-gray-800 px-2 py-1 text-xs font-bold text-black w-5">Thao tác</th>
            </tr> 
          </thead>
          <tbody>
            {selectedProducts.map((product, index) =>
              (selectedPartner && product.partnerid == null && TYPE === "I")
                ? popupTableRow(product, index)
                : normalTableRow(product, index)
            )}
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
          
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
