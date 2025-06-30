import Order from "./Order"


const OrderList = ({ orders, setCurrentOrder, user, setDeliverySchedule, setCurrentDelivery, setCurrentDeliveryDetail }) => {
    return (
        <ul className="text-[15px] h-[90%] overflow-y-scroll p-[4px]">
            {orders.map((order) => (
                <Order key={order.orderid}
                    setCurrentDelivery={setCurrentDelivery}
                    setCurrentDeliveryDetail={setCurrentDeliveryDetail}
                    setDeliverySchedule={setDeliverySchedule}
                    order={order}
                    setCurrentOrder={setCurrentOrder}
                    user={user}
                />
            ))}
        </ul>
    )
}

export default OrderList