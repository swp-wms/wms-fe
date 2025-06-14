import { faStickyNote } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
const Order = ({order}) => {
    return (
        <li className="flex hover:scale-[1.01] hover:cursor-pointer hover:shadow-[0_0_3px_#aaa] mb-2 relative justify-between px-4 border-[1.5px] rounded border-black items-center">
            <div style={{width: order.complete}} className={`percentage z-[-2] absolute top-0 bottom-0 left-0 bg-[var(--fill-color)]`}></div>
            <div className="">
                <p className="my-3">{order.partnername}</p>
                <p className="my-3">Hoàn thành: {order.complete}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
                <FontAwesomeIcon className="text-lg" icon={faStickyNote} />
                {Number(order.complete.split('%')[0]) >= 90 && 
                    <button className="border-[2px] bg-white hover:opacity-75 hover:cursor-pointer hover:drop-shadow-[0_0_1px_black] px-3 border-black rounded-lg mt-2">Xong</button>
                }
            </div>
        </li>
    )
}

export default Order