
const DeliveryInfo = ({ currentOrder, currentDelivery, setCurrentDelivery, newDelivery, setNewDelivery, user }) => {

    return (
        <div>
            <div className="mb-3 flex">
                <span className='flex-1'>Mã đơn: {currentOrder.orderid}</span>
                <span className='max-w-[50%]'>Địa chỉ: {currentOrder.address}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <label className="w-[110px] block">Ngày bốc hàng</label>

                    <input
                        onChange={(e) => {
                            setNewDelivery({ ...newDelivery, getdate: e.target.value })
                        }}
                        readOnly={currentDelivery ? true : false}
                        value={currentDelivery ? currentDelivery.getdate : newDelivery.getdate ? newDelivery.getdate : ''}
                        required
                        className='border-[1px] border-[#aaa] rounded py-1 px-2' type="date"
                    />

                </div>
                <div className="flex items-center">
                    <label className="w-[140px] block">Thời gian bốc hàng</label>

                    <input
                        type="time"
                        onChange={(e) => {
                            setCurrentDelivery({ ...currentDelivery, gettime: e.target.value })
                        }}
                        readOnly={(user.roleid === 5 && Math.abs(Number(currentDelivery?.deliverystatus)) === 1) ? false : true}
                        value={currentDelivery ? currentDelivery.gettime ? currentDelivery.gettime :'' : ''}
                        required
                        className='border-[1px] border-[#aaa] rounded py-1 px-2'
                    />
                </div>

            </div>
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                    <label className="w-[110px] block">Ngày giao hàng</label>

                    <input
                        onChange={(e) => {
                            setNewDelivery({ ...newDelivery, deliverydate: e.target.value })
                        }}
                        readOnly={currentDelivery ? true : false}
                        value={currentDelivery ? currentDelivery.deliverydate : newDelivery.deliverydate ? newDelivery.deliverydate : ''}
                        required
                        className='border-[1px] border-[#aaa] rounded py-1 px-2' type="date"
                    />
                </div>
                <div className="flex items-center">
                    <label className="w-[140px] block">Thời gian giao hàng</label>

                    <input
                        type="time"
                        onChange={(e) => {
                            setCurrentDelivery({ ...currentDelivery, deliverytime: e.target.value })

                        }}
                        readOnly={(user.roleid === 5 && Math.abs(Number(currentDelivery?.deliverystatus)) === 1) ? false : true}
                        value={currentDelivery ? currentDelivery.deliverytime ? currentDelivery.deliverytime :'' : ''}
                        required
                        className='border-[1px] border-[#aaa] rounded py-1 px-2'
                    />
                </div>
            </div>
        </div>
    )
}

export default DeliveryInfo