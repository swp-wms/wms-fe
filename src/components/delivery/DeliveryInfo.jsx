
const DeliveryInfo = ({currentOrder, currentDelivery, newDelivery, setNewDelivery}) => {
    return (
        <div>
            <div className="mb-3 flex">
                <span className='flex-1'>Mã đơn: {currentOrder.orderid}</span>
                <span className='flex-1'>Địa chỉ: {currentOrder.address}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="">
                    <label htmlFor="">Ngày bốc hàng: {currentDelivery && currentDelivery.getdate}</label>
                    {!currentDelivery &&
                        <input
                            onChange={(e) => {
                                setNewDelivery({ ...newDelivery, getdate: e.target.value })
                            }}
                            value={newDelivery.getdate}
                            required
                            className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="date"
                        />}
                </div>
                <div className="">
                    <label htmlFor="">Thời gian bốc hàng: {currentDelivery && currentDelivery.gettime}</label>
                    {!currentDelivery &&
                        <input
                            onChange={(e) => {
                                setNewDelivery({ ...newDelivery, gettime: e.target.value })
                            }}
                            value={newDelivery.gettime}
                            required
                            className='border-[1px] w-[100px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                        />}
                </div>

            </div>
            <div className="flex items-center justify-between mt-2">
                <div className="">
                    <label htmlFor="">Ngày giao hàng: {currentDelivery && currentDelivery.deliverydate}</label>
                    {!currentDelivery &&
                        <input
                            onChange={(e) => {
                                setNewDelivery({ ...newDelivery, deliverydate: e.target.value })
                            }}
                            value={newDelivery.deliverydate}
                            required
                            className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="date"
                        />}
                </div>
                <div className="">
                    <label htmlFor="">Thời gian giao hàng: {currentDelivery && currentDelivery.deliverytime}</label>
                    {!currentDelivery &&
                        <input
                            onChange={(e) => {
                                setNewDelivery({ ...newDelivery, deliverytime: e.target.value })
                            }}
                            value={newDelivery.deliverytime}
                            required
                            className='border-[1px] w-[100px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                        />}
                </div>
            </div>
        </div>
    )
}

export default DeliveryInfo