import React from "react";

import {useState} from "react";
import order from '../backendCalls/order';
import { useParams,Link } from "react-router-dom";
const OrderForm = () =>{
const [orderDetail, setOrderDetail] = useState({});

const { id } = useParams();

  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await order.getOrderDetail(id);
        console.log("Order Detail:", response);
        setOrderDetail(response);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();
  }, [id]);

  
  const total = (array,criteria) =>{
    let sum = 0;
    array.forEach(item => {
      if (item[criteria]) sum += item[criteria];
      
    });
    return sum;
  }
    return(
      <>
      {/* <Header /> */}
      <div className="min-h-screen bg-[#fafafa] pt-22 pl-70 pr-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            
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
            <div className="col-span-6">
            <div className="h-full bg-white border-2 border-gray-800 rounded-lg overflow-hidden">
              
              {/* Table */}
              <div className=" m-5 h-full flex flex-col">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">STT</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Mã hàng</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black">Tên hàng hóa</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-16">Dài</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Đơn trọng</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Số lượng</th>
                      <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-20">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetail?.detail?.map((item, index) => (
                      <tr className="hover:bg-gray-50" key={index}>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">{index + 1}</td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.name}</td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.namedetail}</td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.length}</td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.weight}</td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.numberofbars}</td>
                        <td className="border border-gray-800 px-2 py-2 text-xs text-black">{item.note}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="border border-gray-800 px-2 py-2 pl-15 text-xs font-bold text-black w-12" colSpan={4}>Tổng cộng</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">{(e) => sum(orderDetail?.detail, 'weight')}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12">{(e) => sum(orderDetail?.detail, 'numberofbars')}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs font-bold text-black w-12"></td>

                    </tr>
                  </tbody>
                </table>
                
                {/* Empty table body area */}
                <div className="flex-1 bg-white border-b-2 border-gray-800">
                  <div className="h-80"></div>
                </div>
              </div>
            </div>
              {/* Bottom Buttons */}
            
                <div className="flex gap-3 justify-end mt-5 pb-5">
                  <Link to="/nhap-hang" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                   <svg className="mr-1 w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" >
                      <path fillRule="evenodd" d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z" clipRule="evenodd" />
                    </svg>


                   
                    Quay lại
                  </Link>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                    <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path d="M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z"/>
                    </svg>
                    Hủy đơn hàng
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Chỉnh sửa
                  </button>
                </div>
 
            </div>
          </div>
        </div>
      </div>
    </>
    );
}

export default OrderForm;