import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileCirclePlus,
    faArrowUpRightFromSquare,
    faWeightScale
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/common/header";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import order from "../backendCalls/order";
import { getUser } from "../backendCalls/user";


const ImportOrder = ({ user, setUser }) => {
    const [currentUser,setCurrentUser] = useState(user);
    const [orders, setOrders] = useState([]);
    const cancelledStatus = "Hủy";
    const finishedStatus = "XONG";

    useEffect(() => {
         const getData = async () => {
                const response = await getUser();
                if (response.status !== 200) {
                    window.location.href = '/dang-nhap';
                }
                const user = response.data;
                setUser(user);
            }
      
           
            if(!user || user === null || user === undefined) {
                getData();
            }

        const fetchImportOrders = async () => {
            try {
                const response = await order.getImportOrder();
                setOrders(response);
            } catch (error) {
                console.error("Error fetching import orders:", error);
            }
        };        
        fetchImportOrders();
    },[user,order]);


    const total = (array, criteria) => {
        let sum = 0;
        array.forEach(item => {
            if (item[criteria]) sum += item[criteria];

        });
        return sum;
    }



    return (
        <div className="relative ml-75 pt-24">

            <div className="m-5 flex flex-wrap gap-7  ">
                
                {user?.roleid == 3 && (
                    <Link to="./tao-don-nhap-hang" className=" group bg-gray-100 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 h-[40vh] flex border-2 border-gray-200 rounded-md hover:bg-gray-300 hover:border-gray-400 items-center justify-center">
                        <FontAwesomeIcon className="w-full text-gray-400 transition-colors duration-200 group-hover:text-gray-600" icon={faFileCirclePlus} size="3x" />
                    </Link>
                )}
                {orders.map((order) => (
                    <div key={order.id} className={` space-y-2 ${order.status === cancelledStatus ? 'bg-gray-50 border-2 border-gray-200 opacity-70' : 'bg-white border-2 border-[#1e1e1e]'} w-full pb-4 sm:w-1/2 md:w-1/3 lg:w-1/5 h-[40vh] flex flex-col shadow-sm justify-evenly rounded-md p-4`}>
                        <div className="flex flex-col gap-1">
                            <div className="text-gray-700 text-sm font-medium relative">
                                <div className="absolute top-0 right-0 bg-red-200 px-2 mt-1 border border-red-200 rounded-2xl">
                                    Mã đơn:  <span className="font-bold">{order.id}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-gray-500">
                                    <path d="M5.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V12ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM7.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V12ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V10ZM10 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H10ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H12ZM11.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V10ZM14 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H14Z" />
                                    <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
                                </svg>


                                <span className="text-[12px] text-gray-500">Ngày tạo</span>
                            </div>
                            <p className="text-xs text-gray-800 font-medium pl-6">{order.createdate}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-gray-500">
                                    <path d="M14.916 2.404a.75.75 0 0 1-.32 1.011l-.596.31V17a1 1 0 0 1-1 1h-2.26a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1 0-1.5H2V9.957a.75.75 0 0 1-.596-1.372L2 8.275V5.75a.75.75 0 0 1 1.5 0v1.745l10.404-5.41a.75.75 0 0 1 1.012.319ZM15.861 8.57a.75.75 0 0 1 .736-.025l1.999 1.04A.75.75 0 0 1 18 10.957V16.5h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75V9.21a.75.75 0 0 1 .361-.64Z" />
                                </svg>
                                {/*PARTNER INFO */}

                                <span className="text-[12px] font-medium text-gray-500">Đối tác</span>
                            </div>
                            <p className="text-xs text-gray-800 font-medium pl-6">
                                {order.partner.name}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-gray-500">
                                    <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" />
                                    <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM7 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                                </svg>

                                {/**Quantity */}
                                <span className="text-[12px] font-medium text-gray-500">Số cây - Khối lượng</span>
                            </div>
                            <p className="text-xs text-gray-800 font-medium pl-6">{total(order.orderdetail, "numberofbars")} cây - {Number(total(order.orderdetail, "weight")).toFixed(1)} kg</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                {/* If cancelled, show cancelled icon */}
                                {order.status === cancelledStatus &&(
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                )}
                                {order.status !== cancelledStatus && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-gray-500">
                                    <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
                                </svg>
                                )}

                                {/* Order Status */}
                                <span className="text-[12px] font-medium text-gray-500">Trạng thái</span>
                            </div>

                                {order.status === cancelledStatus && (
                                 <div className="bg-red-100 text-red-600  px-3 py-1 rounded-full text-sm font-bold inline-block">
                                    Đơn hàng đã bị hủy
                                </div>
                                )}
                                {order.status == finishedStatus && (
                                 <div className="text-center font-bold bg-green-300 text-green-600  px-3 py-1 rounded-full text-sm  inline-block">
                                   Hoàn thành
                                </div>
                                )}
                                {order.status !== cancelledStatus && order.status !== finishedStatus && (
                                <div className="flex h-4 ml-[10%] w-[90%] bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700" role="progressbar" aria-valuenow="{order.status.match(/(\d+(\.\d+)?)(?=%)/)[0]}" aria-valuemin="0" aria-valuemax="100">
                                    <div className="flex flex-col justify-center rounded-full overflow-hidden bg-red-600 text-xs text-white text-center whitespace-nowrap transition duration-500" 
                                        style={{ 
                                                width: order.status == null || order.status === '' ? "15%" : 
                                                    parseFloat(order.status) <= 18 ? "18%" : 
                                                    `${Math.min(parseFloat(order.status) || 0, 100).toFixed(0)}%`
                                            }}
                                        >{order.status == null || order.status === '' ? "0%" : 
                                        `${(parseFloat(order.status) || 0).toFixed(1)}%`}
                                    </div>
                                </div>
                                )}
                        </div>
                        <Link to={`/nhap-hang/${order.id}`} className={`w-[80%] h-12 ${order.status === cancelledStatus? 'bg-gray-200 hover:bg-gray-300 text-gray-500 ': 'bg-white hover:bg-gray-100 border-gray-100 hover:border-gray-400 border-2 '}  rounded-md flex gap-2 self-center justify-self-center  place-content-center justify-evenly content-around shadow-lg`}>
                            <FontAwesomeIcon className="h-full place-self-center text-[#1e1e1e]" icon={faArrowUpRightFromSquare} />
                            <p className="place-self-center ">Xem chi tiết</p>
                        </Link>
                    </div>

                ))}

            </div>
        </div>

    )
}

export default ImportOrder;