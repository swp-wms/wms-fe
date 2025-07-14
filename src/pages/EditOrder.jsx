import React, { useState, useRef } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import PartnerSearch from "../components/order/PartnerSearch";
import ProductSearch from "../components/order/ProductSearch";
import EditTable from "../components/order/EditTable";
import partner from "../backendCalls/partner";
import product from "../backendCalls/product";
import { getUser } from "../backendCalls/user";
import CompleteForm from "../components/order/partnerForm";
import orderCalls from "../backendCalls/order";
import toast from "react-hot-toast";

const EditOrder = ({user, setUser}) => {
  

  //------------------ USE STATE ------------------
 
  //--USER
  const [orders, setOrders] = useState([]);
  
  //--ORDER UTILITIES
  const [selectedProducts, setSelectedProducts] = useState([]); // store products that are added to the order
  const [selectedPartner, setSelectedPartner] = useState(null); // store selected partner details
  const [delivery, setDelivery] = useState(null); // store delivery details if needed

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

  

//---------------References---------------
const location = useLocation();
const navigate = useNavigate();
const allowedRoles = ["Salesman"];
const orderDetail = location.state?.orderDetail || null; // Get order details from the state if available
const orderId = location.state?.id || null; // Get order ID from the state if available
  React.useEffect(() => {
     if(!user){
      const getData = async () => {
              const response = await getUser();
              if (response.status!==200) {
                window.location.href = '/dang-nhap';
              }
              const user = response.data;
              setUser(user);
            }
            getData();
     }

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

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const fetchDeliveryDetails = async () => {
      try{
        const response = await orderCalls.fetchDeliveryDetails(orderId);
        setDelivery(response);
        
      }catch(error){
        console.error("Error fetching delivery details:", error);
      }
    }

   
     const checkSalesmanId = () => {
      if(orderDetail && user){
        const userRole = user.role.rolename;
        console.log("user id: ", user.id);
        console.log("orderDetail.salesmanid: ", orderDetail.salesmanid);
        if((allowedRoles.find(role => role ===userRole) 
          &&user.id !== orderDetail.salesmanid) || !allowedRoles.find(role => role === userRole)){
            navigate(`/error403`);
        }
      }
    }

    checkSalesmanId();

    fetchPartners();
    fetchProducts();
    fetchDeliveryDetails();
    setSelectedPartner(orderDetail.partner || null);
    setSelectedProducts(orderDetail.orderdetail.map((item,index) => {
        console.log ("Item id: " ,item.id )
        let obj = {
          ...item,
          orderdetailid:item.id,
          ...item.product,
          trueId : index+1}
        return obj;
    }));


  
  },[]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPartner || !selectedProducts || selectedProducts.length === 0) {
      alert("Please select a partner and at least one product.");
      return;
    }
    // Here you would typically send the order data to your backend
    const data = {
      id: orderId,
      partnerid: selectedPartner?.id,
      address: selectedPartner?.address,
      note:"",

      orderdetail: selectedProducts.map(product => ({
        id: product?.orderdetailid,
        productid: product?.id,
        numberofbars: product?.numberofbars,
        weight: product?.weight,
        note: product?.note || "",
        
        }))
    };
    
    const msg = await orderCalls.updateOrder(orderId, data);
    toast.success(msg.message);

    setSelectedProducts([]);
    setSelectedPartner(null);
    navigate(-1);
   
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

    const handleSetActiveTab = (tab, data = null) => {
    setActiveTab(tab);
    if (data) {
      setFormInitialData(data);
    } else {
      setFormInitialData(null); // Reset when no data
    }
    setShowForm(true); // Show the form when tab is set
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-25 pl-77 pr-5 ">
      <div className="max-w-9xl mx-auto relative">
        {showForm && (
          <CompleteForm 
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
            setShowForm={setShowForm}
            partnerList={partnerList}
            setPartnerList={setPartnerList}
            selectedProducts={selectedProducts}
            selectedPartner={selectedPartner}
            setSelectedPartner={setSelectedPartner}
            setSelectedProducts={setSelectedProducts}
            initialData={formInitialData}
            
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
                selectedPartner={selectedPartner}
                productList={productList}
                productFilteredSuggestions={productFilteredSuggestions}
                setProductFilteredSuggestions={setProductFilteredSuggestions}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                setActiveTab={tab => {setActiveTab(tab); setShowForm(true);}}
              />
              <EditTable
                // selectedProducts={selectedProducts}
                // setSelectedProducts={setSelectedProducts}
                // productList={productList}
                // setActiveTab={setActiveTab}
                // totalBars={totalBars}
                // totalWeight={totalWeight}
                // delivery={delivery}
                // setDelivery={setDelivery}

                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                selectedPartner={selectedPartner}
                productList={productList}
                delivery={delivery}
                setDelivery={setDelivery}
                totalBars={totalBars}
                totalWeight={totalWeight}
                setActiveTab={handleSetActiveTab}
              />
            </div>
            {/* Bottom Buttons */}
            <div className="mt-5 flex gap-2 justify-end">
              <button onClick={() => navigate(-1) } className="inline-flex items-center px-4 py-2 border border-gray-400 rounded bg-white text-sm text-black hover:bg-gray-50 shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-400 rounded bg-white text-sm text-black hover:bg-gray-50 shadow-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={
                  !selectedPartner ||
                  !selectedProducts ||
                  selectedProducts.length === 0
                }

              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                </svg>

                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditOrder;