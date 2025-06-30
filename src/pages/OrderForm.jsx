import React from "react";

import { useState,useEffect} from "react";
import order from '../backendCalls/order';
import { useParams, Link, useNavigate } from "react-router-dom";
import { getUser } from "../backendCalls/user";
import SupplementOrderList from "../components/order/SupplementOrderList";
import supplement from "../backendCalls/supplement.js"
import supplementForm from "../components/order/supplementForm.jsx";
import SupplementForm from "../components/order/supplementForm.jsx";

const OrderForm = ({ user, setUser }) => {
  const [orderDetail, setOrderDetail] = useState({});
  const [supplementOrder, setSupplementOrder] = useState([]);
  const navigate = useNavigate();
  const [orderActiveTab, setOrderActiveTab] = useState('order');

  //control supplementForm
  const [activeSupplementForm, setActiveSupplementForm] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    console.log("Current user:", user);
    if (user == null) {
      const getData = async () => {
        const response = await getUser();
        if (response.status !== 200) {
          window.location.href = '/dang-nhap';
          }
      const user = response.data  ;
      setUser(user);
      }
      getData();
    }
    const fetchOrderDetails = async () => {
      try {
        const response = await order.getOrderDetail(id);

        setOrderDetail(response[0]);

      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();

  //   if(user){
  //   const checkSalesmanId = () => {
  //     if(orderDetail && user){
  //       if(
  //         user.role == 3 &&
  //         user.id !== orderDetail.salesmanid
  //       ){
  //         navigate(`/error403`)
  //       }
  //     }
  //   }
  //   checkSalesmanId();
  // }
    const getSupplementOrder = async () =>{
      try{
        const response = await supplement.getSupplementByOrderId(id);
        setSupplementOrder(response ||[]);
      }catch(error){
        console.error("Error fetching supplementOrder: ", error);
      }
    }
    getSupplementOrder();
  },[user]);

  const total = (array, criteria) => {
    let sum = 0;
    array.forEach(item => {
      if (item[criteria]) sum += item[criteria];

    });
    return sum;
  }

  const handleEdit = () => {
    navigate(`${window.location.pathname}/cap-nhat`, { state: { orderDetail, id } });
  }

  

  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen bg-[#fafafa] pt-25 pl-77 pr-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {activeSupplementForm && (
            <SupplementForm
              user={user}
              orderDetail={orderDetail}
              setOrderDetail={setOrderDetail}
              activeSupplementForm={activeSupplementForm} 
              setActiveSupplementForm={setActiveSupplementForm}
              setUser={setUser}
            />
          )}
          
            {/* Left Column */}
            <div className="space-y-4 w-full col-span-4">

              {/* Company Information Section */}
              <div className="bg-white border-2 border-gray-800 rounded-md">
                <div className="border-b-2 border-gray-800 px-4 py-2 rounded-t-md bg-white">
                  <h2 className="text-sm font-bold text-black">
                    {orderDetail?.partnerid} - {orderDetail?.partner?.name}
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Địa chỉ: <span>{orderDetail?.partner?.address}</span></label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Mã số thuế: <span>{orderDetail?.partner?.taxcode}</span></label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Số điện thoại: <span>{orderDetail?.partner?.phonenumber}</span></label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Email: <span>{orderDetail?.partner?.email}</span></label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Số tài khoản:</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Tên ngân hàng:</label>
                  </div>
                </div>
              </div>

              {/* Transport Section */}
              <div className="bg-white border-2 border-gray-800 rounded-md">
                <div className="border-b-2 border-gray-800 px-4 py-2 rounded-t-md bg-white">
                  <h2 className="text-sm font-bold text-black">
                    PHỤ TRÁCH VẬN CHUYỂN:
                  </h2>
                </div>
                <div className="p-4">
                  <label className="block text-sm font-medium text-black mb-2">GHI CHÚ:</label>
                  <div className="h-32 border border-gray-300 rounded"></div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-6 space-y-4">
              <div className="h-full  bg-white border-2 border-gray-800 rounded-lg overflow-hidden">
                <div className="w-[50%] h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600 grid grid-cols-2">
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
                      orderActiveTab === 'order' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'hover:bg-white/50'
                    }`}
                    onClick={() => setOrderActiveTab('order')}
                  >
                    Đơn chính
                  </button>
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
                      orderActiveTab === 'supplementorder' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'hover:bg-white/50'
                    }`}
                    onClick={() => setOrderActiveTab('supplementorder')}
                  >
                      Danh sách đơn bù
                  </button>
                </div>

                
                {/* Table */}
                <div className=" m-5 h-full flex flex-col"  >
                  
                  {orderActiveTab === "order" && (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">STT</th>
                        <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Mã hàng</th>
                        <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black">Tên hàng hóa</th>
                        <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-16">Dài</th>
                        <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Số lượng</th>
                        <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Khối lượng</th>
                        <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetail?.orderdetail?.map((item, index) => (
                        <tr className="hover:bg-gray-50" key={index}>
                          <td className="border border-gray-800 px-2 py-2 text-xs text-black">{index + 1}</td>
                          <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.product.name}</td>
                          <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.product.namedetail}</td>
                          <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.product.catalog.length}</td>
                          <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.numberofbars}</td>
                          <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.weight}</td>
                          <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.note}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="border border-gray-800 px-2 py-2 pl-15 text-xs font-bold text-black w-12" colSpan={4}>Tổng cộng</td>
                        <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">{total(orderDetail?.orderdetail || [], 'numberofbars')}</td>
                        <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">{Number(total(orderDetail?.orderdetail || [], 'weight')).toFixed(2)}</td>
                        <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12"></td>

                      </tr>
                    </tbody>
                  </table>
                  )}

                  {orderActiveTab ==="supplementorder" && (
                    <SupplementOrderList className=" h-[90%] w-full bg-[#f3eaea] border-t-1 border-gray-400 " supplementList={supplementOrder || []} />
                  )}

                  {/* Empty table body area */}
                  <div className="flex-1 bg-white border-b-2 border-gray-800">
                      
                  </div>
                  
                </div>
                
              </div>
              
              </div>
              {/* Bottom Buttons */}
            
          </div>
        </div>
        <div className="flex flex-row gap-2 w-full mt-5 pb-30 mb-20">
              <div className="basis-2/3  w-[60%]">              
                {/* <SupplementOrderList className=" basis-2/3 w-[40%] bg-[#f3eaea] border-t-1 border-gray-400 fixed" supplementList={supplementOrder || []} /> */}
              </div>

              <div className="basis-1/3 flex gap-3 justify-end h-10">
                <Link to="/nhap-hang" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                  <svg className="mr-1 w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" >
                    <path fillRule="evenodd" d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z" clipRule="evenodd" />
                  </svg>



                  Quay lại
                </Link>
                {user.roleid === 3 && (
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                  <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z" />
                  </svg>
                  Hủy đơn hàng
                </button>
                )}
                
              { user && user.roleid == 4 &&  (
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg"
                          onClick={() => setActiveSupplementForm(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Thêm đơn bù
                  </button>
                )}
                {user.roleid === 3 &&(
                <button onClick={handleEdit} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa
                </button>
                )}
              </div>
               {/* <SupplementOrderList className=" basis-2/3 w-[60%] bg-white border-t-1 border-gray-400 fixed" supplementList={supplementOrder || []} /> */}
            </div>
        
      </div>
      
    </>
  );
}

export default OrderForm;