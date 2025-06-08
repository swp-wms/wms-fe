import React from "react";
import tailwind from "tailwindcss/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Order = () =>{
    return(
        <div className="bg-[#fafafa]">
            <FontAwesomeIcon icon={faFileCirclePlus} size="lg"/>
            <div className="bg-[#f2f2f2]"></div>
        </div>
    )
}

export default Order;