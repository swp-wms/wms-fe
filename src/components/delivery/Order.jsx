import { faStickyNote } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { checkCompleteOrder } from "../../backendCalls/orderDetail"
import { getDeliveriesForOrder } from "../../backendCalls/delivery"
const Order = ({ order, setCurrentOrder, user, setDeliverySchedule, setCurrentDelivery, setCurrentDeliveryDetail }) => {
    const fetchDeliveryList = async () => {
        try {
            setCurrentDelivery();
            setCurrentDeliveryDetail();
            setCurrentOrder(order);
            const response = (await getDeliveriesForOrder(order.orderid)).data;

            setDeliverySchedule(response.length > 0 ? response.sort((a, b) => new Date(b.deliverydate) - new Date(a.deliverydate)) : []);
        } catch (error) {
            console.log(error);
        }
    }

    const handleComplete = async () => {
        try {
            await checkCompleteOrder(order.orderid);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <li className="flex hover:scale-[1.01] hover:cursor-pointer hover:shadow-[0_0_3px_#aaa] mb-2 relative justify-between px-4 border-[1.5px] rounded border-black items-center"
            onClick={fetchDeliveryList}
        >
            <span className="absolute top-0 right-[10px] rounded-b-md text-sm font-semibold bg-[#ccc] p-2 shadow-[0_0_3px_#aaa]">{order.orderid}</span>
            <div style={{ width: `${Number(order.process).toFixed(2)}%` }} className={`percentage z-[-2] absolute top-0 bottom-0 left-0 bg-[var(--process-color)] transition-transform duration-300`}></div>
            <div style={{ width: `${Number(order.percent).toFixed(2)}%` }} className={`percentage z-[-2] absolute top-0 bottom-0 left-0 bg-[var(--fill-color)] transition-transform duration-300`}></div>
            <div className="">
                <p className="my-3">{order.partnername}</p>
                <p className="my-3">Hoàn thành: {Number(order.percent).toFixed(2)}%</p>
                <p className="my-3">Tiến độ: {Number(order.process).toFixed(2)}%</p>
            </div>
            <div className="flex flex-col items-end justify-between">
                <FontAwesomeIcon className="text-lg" icon={faStickyNote} />
                {Number(order.percent) >= 90 && user.roleid === 3 &&
                    <button className="border-[2px] bg-white hover:opacity-75 hover:cursor-pointer hover:drop-shadow-[0_0_1px_black] px-3 border-black rounded-lg mt-2"
                        onClick={() => { handleComplete() }}
                    >Xong</button>
                }
            </div>
        </li>
    )
}

export default Order