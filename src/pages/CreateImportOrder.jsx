import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import PartnerSearch from "../components/order/PartnerSearch";
import ProductSearch from "../components/order/ProductSearch";
import OrderTable from "../components/order/OrderTable";
import partner from "../backendCalls/partner";
import product from "../backendCalls/product";
import { getUser } from "../backendCalls/user";
import CompleteForm from "../components/order/partnerForm";
import orderCalls from "../backendCalls/order";
const CreateOrder = ({user, setUser}) => {
  

  //------------------ USE STATE ------------------
 
  //--USER
  const [orders, setOrders] = useState([]);
  
  //--ORDER UTILITIES
  const [selectedProducts, setSelectedProducts] = useState([]); // store products that are added to the order
  const [selectedPartner, setSelectedPartner] = useState(null); // store selected partner details

  const [partnerList, setPartnerList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [focused, setFocused] = useState('');
  const [partnerFilteredSuggestions, setpartnerFilteredSuggestions] = useState([]);
  const [productFilteredSuggestions, setProductFilteredSuggestions] = useState([]);
  const [inputpartner, setInputpartner] = useState("");
  const [inputProduct, setInputProduct] = useState("");

  //-- ACTIVE TAB
  const [activeTab, setActiveTab] = useState('partner'); // state to manage active tab
  const [showForm, setShowForm] = useState(false)

  //------------------ USE REF --------------------
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  React.useEffect(() => {
     if(!user){const getData = async () => {
              const response = await getUser();
              if (response.status!==200) {
                window.location.href = '/dang-nhap';
              }
              const user = response.data;
              setUser(user);
            }
            getData();}

    const fetchPartners = async () => {
      try {
        const response = await partner.fetchPartners();
        setPartnerList(response);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await product.fetchProducts();
        setProductList(response);
        console.log("Product List:", response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchPartners();
    fetchProducts();
  },[]);
  let checkNumberOfBars = () => {
            const invalidProducts = selectedProducts.filter(product => product.numberofbars <= 0 || product.numberofbars == null);
            if(invalidProducts.length > 0) {
              return false;
            }
            return true;
            
          };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPartner || !selectedProducts || selectedProducts.length === 0) {
      alert("Please select a partner and at least one product.");
      return;
    }
    // Here you would typically send the order data to your backend
    const orderData = {
      type: "I",
      partnerid: selectedPartner?.id,
      address: selectedPartner?.address,
      totalbars: totalBars,
      totalweight: totalWeight,
      date: new Date().toISOString(),
      salesmanid: user.id,
      note:"",

      orderdetail: selectedProducts.map(product => ({
        productid: product?.id,
        numberofbars: product?.numberofbars,
        weight: product?.weight
        
        }))
    };
    console.log("Order Data:", orderData);
    orderCalls.createImportOrder(orderData);
    setSelectedProducts([]);
    setSelectedPartner(null);
  };

  // Calculate totals for selectedProducts
  const totalBars = selectedProducts.reduce((sum, item) => {
    const value = Number(item.numberofbars);
    return !isNaN(value) ? sum + value : sum;
  }, 0);

  const totalWeight = selectedProducts.reduce((sum, item) => {
    const value = Number(item.weight);
    return !isNaN(value) ? sum + value : sum;
  }, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] pt-25 pl-77 pr-5 ">
      <div className="max-X`w-9xl mx-auto relative">
        {showForm && (
          <CompleteForm 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            setShowForm={setShowForm}
            partnerList={partnerList}
            setPartnerList={setPartnerList}
            selectedProducts={selectedProducts}
            selectedPartner={selectedPartner}
            setSelectedPartner={setSelectedPartner}
            setSelectedProducts={setSelectedProducts}
            
          />
        )}
        <div className="grid grid-cols-5 :grid-cols-5 gap-4">
          {/* Left Column */}
          <div className="space-y-4 col-span-2">
            <PartnerSearch
              inputpartner={inputpartner}
              setInputpartner={setInputpartner}
              partnerList={partnerList}
              partnerFilteredSuggestions={partnerFilteredSuggestions}
              setpartnerFilteredSuggestions={setpartnerFilteredSuggestions}
              selectedPartner={selectedPartner}
              setSelectedPartner={setSelectedPartner}
              focused={focused}
              setFocused={setFocused}
              setActiveTab={tab => {setActiveTab(tab); setShowForm(true);}}
            />
          </div>
          {/* Right Column */}
          <div className="col-span-3 space-y-4">
            <div className="h-full space-y-4 border-2 border-gray-800 rounded-md">
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
              <Link to="/nhap-hang" className="inline-flex items-center px-4 py-2 border border-gray-400 rounded bg-white text-sm text-black hover:bg-gray-50 shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </Link>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-400 rounded bg-white text-sm text-black hover:bg-gray-50 shadow-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={
                  !selectedPartner ||
                  !selectedProducts ||
                  selectedProducts.length === 0 ||
                  !checkNumberOfBars()
                }

              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo kế hoạch nhập hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOrder;