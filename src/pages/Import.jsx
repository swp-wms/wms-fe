import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFileCirclePlus,
    faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
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
        <>
          
            <div className="bg-[#fafafa] pt-20 pl-65">

                <div className="m-5 flex flex-wrap gap-7">
                    <Link to="./tao-don-nhap-hang" className="group bg-gray-100 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 h-[40vh] flex border-2 border-gray-300 rounded-md hover:bg-gray-700 hover:border-gray-500 items-center justify-center">
                        <FontAwesomeIcon className="w-full text-gray-400 transition-colors duration-200 group-hover:text-gray-600" icon={faFileCirclePlus} size="3x"/>
                    </Link>

                    {orders.map((order) => (
                    <div className="bg-white w-full pb-4 sm:w-1/2 md:w-1/3 lg:w-1/5 h-[40vh] flex flex-col border-2 border-[#1e1e1e] justify-evenly rounded-md ">
                            <p className="m-1 text-[#1e1e1e]">Ngày tạo: {order.createdate}</p>
                            <p className="m-1 text-[#1e1e1e]">Đối tác: {order.partner.name}</p>
                            <p className="m-1 text-[#1e1e1e]">Số lượng: {order.totalbar} cây</p>
                            <p className="m-1 text-[#1e1e1e]">Trọng lượng: {order.totalweight} kg</p>
                        <Link to={`./id:${order.id}`} className="w-[80%] h-12 bg-white border-2 border-gray-100 rounded-md flex gap-2 self-center justify-self-center  place-content-center justify-evenly content-around shadow-lg">
                            <FontAwesomeIcon className="h-full place-self-center text-[#1e1e1e]" icon={faArrowUpRightFromSquare} />
                            <p className="place-self-center ">Xem chi tiết</p>
                        </Link>
                       
                    </div>
                    ))}

                </div>
            </div>
        </>
    )
}

export default ImportOrder;