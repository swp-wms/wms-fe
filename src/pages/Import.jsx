import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFileCirclePlus,
    faArrowUpRightFromSquare,
    faWeightScale
 } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/common/header";
import { Link } from "react-router-dom";
import { useState } from "react";
import order from "../backendCalls/order";


const ImportOrder = () => {
    const [orders, setOrders] = useState([]);

    React.useEffect(() => {
        const fetchImportOrders = async () => {
            try {
                const response = await order.getImportOrder();
                setOrders(response);
            } catch (error) {
                console.error("Error fetching import orders:", error);
            }
        };
        fetchImportOrders();
    }, []);

    return(
        
          
            <div className="bg-[#fafafa]  z-index-100">

                <div className="m-5 flex flex-wrap gap-7 ml-65 mt-24">
                    
                    <Link to="./tao-don-nhap-hang" className=" group bg-gray-100 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 h-[40vh] flex border-2 border-gray-200 rounded-md hover:bg-gray-300 hover:border-gray-400 items-center justify-center">
                        <FontAwesomeIcon className="w-full text-gray-400 transition-colors duration-200 group-hover:text-gray-600" icon={faFileCirclePlus} size="3x"/>
                    </Link>

                    {orders.map((order) => (
                    <div key={order.id} className=" space-y-2 bg-white w-full pb-4 sm:w-1/2 md:w-1/3 lg:w-1/5 h-[40vh] flex flex-col border-2 border-[#1e1e1e] justify-evenly rounded-md p-4 ">
                          <div className="flex flex-col gap-1">
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


                                        <span className="text-[12px] font-medium text-gray-500">Số lượng</span>
                                    </div>
                                    <p className="text-xs text-gray-800 font-medium pl-6">{order.totalbars}</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1">
                                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-gray-500">
                                        <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v.258a33.186 33.186 0 0 1 6.668.83.75.75 0 0 1-.336 1.461 31.28 31.28 0 0 0-1.103-.232l1.702 7.545a.75.75 0 0 1-.387.832A4.981 4.981 0 0 1 15 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 0 1-.387-.832l1.77-7.849a31.743 31.743 0 0 0-3.339-.254v11.505a20.01 20.01 0 0 1 3.78.501.75.75 0 1 1-.339 1.462A18.558 18.558 0 0 0 10 17.5c-1.442 0-2.845.165-4.191.477a.75.75 0 0 1-.338-1.462 20.01 20.01 0 0 1 3.779-.501V4.509c-1.129.026-2.243.112-3.34.254l1.771 7.85a.75.75 0 0 1-.387.83A4.98 4.98 0 0 1 5 14a4.98 4.98 0 0 1-2.294-.556.75.75 0 0 1-.387-.832L4.02 5.067c-.37.07-.738.148-1.103.232a.75.75 0 0 1-.336-1.462 32.845 32.845 0 0 1 6.668-.829V2.75A.75.75 0 0 1 10 2ZM5 7.543 3.92 12.33a3.499 3.499 0 0 0 2.16 0L5 7.543Zm10 0-1.08 4.787a3.498 3.498 0 0 0 2.16 0L15 7.543Z" clipRule="evenodd" />
                                        </svg>

                                        <span className="text-[12px] font-medium text-gray-500">Trọng lượng</span>
                                    </div>
                                    <p className="text-xs text-gray-800 font-medium pl-6">{order.totalweight} kg</p>
                                </div>
                        <Link to={`/nhap-hang/${order.id}`} className="w-[80%] h-12 bg-white hover:bg-gray-100 border-2  border-gray-100 hover:border-gray-400  rounded-md flex gap-2 self-center justify-self-center  place-content-center justify-evenly content-around shadow-lg">
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