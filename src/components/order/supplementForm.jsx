import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ProductSearch from "./ProductSearchOld";
import OrderTable from "./OrderTable";
import product from "../../backendCalls/product";
import order from "../../backendCalls/order";
import supplement from "../../backendCalls/supplement";
import supplementType from "../../data/supplementType";
const SupplementForm = ({
  user,
  orderDetail,
  setOrderDetail,
  activeSupplementForm,
  setActiveSupplementForm,
  setUser,
  orderTotalWeight,
  orderTotalBars,
  supplementOrder,
  setSupplementOrder
  
}) => {
  const [selectedProducts, setSelectedProducts] = useState([]); // store products that are added to the order
  const [productList, setProductList] = useState([]);
  const [productFilteredSuggestions, setProductFilteredSuggestions] = useState([]);
  const [inputProduct, setInputProduct] = useState("");
  const [activeTab, setActiveTab] = useState("partner");
  const [type, setType] = useState(); // default type is "I" for nhập bù
  const [orderNote, setOrderNote] = useState("");
  const orderType = "supplement"; // type of order, can be "supplement" or "order"

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
  }, []);

  const totalBars = selectedProducts.reduce((sum, item) => {
    const value = Number(item.numberofbars);
    return !isNaN(value) ? sum + value : sum;
  }, 0);

  const totalWeight = selectedProducts.reduce((sum, item) => {
    const value = Number(item.weight);
    return !isNaN(value) ? sum + value : sum;
  }, 0);


  const total = (array, criteria) => {
    let sum = 0;
    array.forEach(item => {
      if (item[criteria]) sum += item[criteria];

    });
    return sum;
  }

  let checkNumberOfBars = () => {
    const invalidProducts = selectedProducts.filter(
      (product) => product.numberofbars <= 0 || product.numberofbars == null
    );
    if (invalidProducts.length > 0) {
      return false;
    }
    return true;
  };

  const handleSubmitSupplement = async () => {
    const supplement = {
      type: type,
      warehousekeeperid: user.id,
      orderid: orderDetail.id,
      note: orderNote,
      status: "pending",
      iscarneeded: false,
      detail: selectedProducts.map((product) => ({
        orderid: orderDetail.id,
        productid: product?.id,
        numberofbars: product?.numberofbars,
        weight: product?.weight,
      })),
      totalWeight: totalWeight,
      totalBars: totalBars,
    };
    console.log("order weight", orderTotalWeight);
    if(totalWeight < orderTotalWeight/100*90 && totalWeight > orderTotalWeight/100*110){
      toast.error(`Tổng trọng lượng đơn bù: ${totalWeight} kg không được chênh lệch quá 10% tổng trọng lượng đơn hàng ${orderTotalWeight} kg`);
      return;
    }else{
      const response = await supplement.addSupplementOrder(supplement);
      console.log("Response from supplement order:", response);
      if (response.success) {
        toast.success("Tạo đơn bù thành công");
        setSelectedProducts([]);
        setSupplementOrder(prev =>[ ...prev, supplement]);
      }
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50"></div>
      <div className="relative z-50">
        <div className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white border border-gray-200 shadow-lg rounded-lg w-full mx-4">
          <button
            className="text-red-600 aspect-square bg-red-100 border-1 border-red-100 shadow-sm hover:text-red-700 hover:bg-gray-100 m-2 ml-4 p-1 h-8 w-8 mb-2 rounded"
            onClick={() => setActiveSupplementForm(false)}
          >
            <svg
              className="h-4 w-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <h2 className="font-bold text-2xl pt-2 pl-4">Tạo đơn bù</h2>
          <h3 className="font-bold text-l pl-4 pt-3">Chọn loại đơn bù: </h3>
          <div className="flex items-center gap-4 pl-4 pt-2">
            {supplementType.map((type) => (
              <span key={type.code}>
                <input
                  type="radio"
                  onClick={(e) => setType(e.target.value)}
                  id={type.code}
                  name="type"
                  value={type.code}
                />
                <label htmlFor={type.code} className="ml-1">
                  {type.name}
                </label>
              </span>
            ))}
          </div>
          <ProductSearch
            inputProduct={inputProduct}
            setInputProduct={setInputProduct}
            productList={productList}
            productFilteredSuggestions={productFilteredSuggestions}
            setProductFilteredSuggestions={setProductFilteredSuggestions}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setShowForm(true);
            }}
          />

          <OrderTable
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            productList={productList}
            setActiveTab={setActiveTab}
            totalBars={totalBars}
            totalWeight={totalWeight}
            orderType={orderType}
          />
          <div className="flex gap-4">
            <h4 className="font-bold text-l pl-4">Lý do:</h4>
            <textarea
              rows={6}
              className="flex-1 border border-gray-400 rounded mx-4 ml-0 mb-3 px-2 py-2 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Lý do ..."
              onChange={(e) => setOrderNote(e.target.value)}
            />
          </div>
        </div>
        {/* Bottom Buttons */}
        <div className="mt-5 flex gap-2 justify-end">
          <button
            onClick={() => setActiveSupplementForm(false)}
            className="inline-flex items-center px-4 py-2 border border-gray-400 rounded bg-white text-sm text-black hover:bg-gray-50 shadow-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
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
              !checkNumberOfBars() ||
              !type
            }
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tạo đơn bù
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplementForm;
