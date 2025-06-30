import { useState,useEffect } from "react"
import {toast} from "react-hot-toast"
import ProductSearch from "./ProductSearch"
import OrderTable from "./OrderTable"
import product from "../../backendCalls/product"
import order from "../../backendCalls/order"
import supplement from "../../backendCalls/supplement"
const SupplementForm = ({ user, orderDetail,setOrderDetail,activeSupplementForm,setActiveSupplementForm,setUser }) => {
    const [selectedProducts, setSelectedProducts] = useState([]); // store products that are added to the order
    const [productList, setProductList] = useState([]);
    const [productFilteredSuggestions, setProductFilteredSuggestions] = useState([]);
    const [inputProduct, setInputProduct] = useState("");
    const [activeTab, setActiveTab] = useState('partner')
    
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await product.fetchProducts();
            setProductList(response);
            console.log("Product List:", response);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
        
        fetchProducts();
      },[]);


        const totalBars = selectedProducts.reduce((sum, item) => {
            const value = Number(item.numberofbars);
            return !isNaN(value) ? sum + value : sum;
        }, 0);

        const totalWeight = selectedProducts.reduce((sum, item) => {
            const value = Number(item.weight);
            return !isNaN(value) ? sum + value : sum;
        }, 0);
         let checkNumberOfBars = () => {
            const invalidProducts = selectedProducts.filter(product => product.numberofbars <= 0 || product.numberofbars == null);
            if(invalidProducts.length > 0) {
              return false;
            }
            return true;
            
          };
        
        const handleSubmitSupplement = async () => {
          const supplementOrder = {
            type: orderDetail.type,
            warehousekeeperid: user.id,
            orderid:orderDetail.id,
            note:"",
            status: "pending",
            iscarneeded:false,
            detail: selectedProducts.map(product =>({
              orderid: orderDetail.id,
              productid: product?.id,
              numberofbars: product?.numberofbars,
              weight: product?.weight
            }))
          }
          
          const response = await supplement.addSupplementOrder(supplementOrder);
          console.log("Response from supplement order:", response);
          if(response.success) {
            toast.success("Tạo đơn bù thành công");
            setSelectedProducts([]);
            
          }
        }
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50"></div>
            <div className="relative z-50">
            <div className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white border border-gray-200 shadow-lg rounded-lg w-full mx-4">
            <h2 className="font-bold text-2xl pt-2 pl-4">Tạo đơn bù</h2>
                <ProductSearch
                inputProduct={inputProduct}
                setInputProduct={setInputProduct}
                productList={productList}
                productFilteredSuggestions={productFilteredSuggestions}
                setProductFilteredSuggestions={setProductFilteredSuggestions}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                setActiveTab={tab => {setActiveTab(tab); setShowForm(true);}}
              />
              <OrderTable
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                productList={productList}
                setActiveTab={setActiveTab}
                totalBars={totalBars}
                totalWeight={totalWeight}
              />
            </div>
             {/* Bottom Buttons */}
            <div className="mt-5 flex gap-2 justify-end">
              <button onClick={() => setActiveSupplementForm(false)} className="inline-flex items-center px-4 py-2 border border-gray-400 rounded bg-white text-sm text-black hover:bg-gray-50 shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-400 rounded bg-white text-sm text-black hover:bg-gray-50 shadow-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                onClick={handleSubmitSupplement}
                disabled={
                  !selectedProducts ||
                  selectedProducts.length === 0 ||
                  !checkNumberOfBars()
                }

              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo đơn bù
              </button>
              </div>
            </div>
        </div>
    )
}

export default SupplementForm