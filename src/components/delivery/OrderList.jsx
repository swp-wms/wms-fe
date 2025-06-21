import Order from "./Order"


const OrderList = ({ orders, setOrders, currentOrder, setCurrentOrder, user }) => {
    return (
        <ul className="text-[15px] h-[90%] overflow-y-scroll p-[4px]">
            {orders.map((order) => (
                <Order key={order.orderid} 
                    order={order} setOrders={setOrders} 
                    currentOrder={currentOrder}
                    setCurrentOrder={setCurrentOrder}
                    user={user}
                />
            ))}
        </ul>
    )
}

export default OrderList