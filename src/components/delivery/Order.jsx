import { faStickyNote } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
const Order = ({order, setOrder, setCurrentOrder, currentOrder}) => {
    const handleComplete = async () => {
        //delete order from orders
        //change status to done
    }
    return (
        <li className="flex hover:scale-[1.01] hover:cursor-pointer hover:shadow-[0_0_3px_#aaa] mb-2 relative justify-between px-4 border-[1.5px] rounded border-black items-center"
            onClick={() => setCurrentOrder(order)}
        >
            <div style={{width: `${order.process}%`}} className={`percentage z-[-2] absolute top-0 bottom-0 left-0 bg-[var(--process-color)]`}></div>
            <div style={{width: `${order.percent}%`}} className={`percentage z-[-2] absolute top-0 bottom-0 left-0 bg-[var(--fill-color)]`}></div>
            <div className="">
                <p className="my-3">{order.partnername}</p>
                <p className="my-3">Hoàn thành: {order.percent}%</p>
                <p className="my-3">Tiến độ: {order.process}%</p>
            </div>
            <div className="flex flex-col items-end justify-between">
                <FontAwesomeIcon className="text-lg" icon={faStickyNote} />
                {Number(order.percent) >= 90 && 
                    <button className="border-[2px] bg-white hover:opacity-75 hover:cursor-pointer hover:drop-shadow-[0_0_1px_black] px-3 border-black rounded-lg mt-2"
                            onClick={() => {handleComplete()}}
                    >Xong</button>
                }
            </div>
        </li>
    )
}

export default Order