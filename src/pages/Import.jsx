import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFileCirclePlus,
    faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/common/header";
const ImportOrder = () =>{
    return(
        <>
            <Header/>
            <div className="bg-[#fafafa] pt-20 pl-65">

                <div className="m-5 flex flex-wrap gap-7">
                    <div className="bg-[#f2f2f2] w-full sm:w-1/2 md:w-1/3 lg:w-1/5 h-[45vh] flex border-2 border-[#b5b5b5] rounded-md ">
                        <FontAwesomeIcon className="place-self-center w-full text-gray-400 hover:text-[#919191]" icon={faFileCirclePlus} size="3x"/>
                    </div>
                    <div className="bg-white w-full pb-4 sm:w-1/2 md:w-1/3 lg:w-1/5 h-[45vh] flex border-2 border-[#1e1e1e] justify-evenly content-around rounded-md ">
                        <button className="w-[80%] h-12 bg-white border-2 border-gray-100 rounded-md flex gap-2 p-5 self-end justify-self-center  place-content-center justify-evenly content-around shadow-lg"   >
                            <FontAwesomeIcon className="h-full place-self-center text-[#1e1e1e]" icon={faArrowUpRightFromSquare} />
                            <p className="place-self-center ">Xem chi tiết</p>
                        </button>
                       
                    </div>
                    
                      
                </div>
            </div>
        </>
    )
}

export default ImportOrder;