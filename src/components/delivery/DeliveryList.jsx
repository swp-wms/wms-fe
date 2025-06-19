
import DeliveryDetail from "./DeliveryDetail"

const DeliveryList = ({ deliverySchedule, currentOrder, currentDelivery, setCurrentDelivery, setCurrentDeliveryDetail, user }) => {
  return (
    <div className="DeliveryList h-full flex items-center border-t-[1px] border-[#cccccc] px-[20px]">
      {/* Company info */}
      <div className="text-[14px] mr-4">
        <p className="font-medium mb-2 max-w-[150px]">{currentOrder.partnername}</p>
        <p>Mã đơn: {currentOrder.orderid}</p>
      </div>
      {/* Delivery list */}
      <div className="detail-list flex-1 h-full text-[13px] flex gap-3 overflow-x-scroll p-1 items-center overflow-y-hidden">
        {deliverySchedule.map((delivery) => {
          return (
            <DeliveryDetail key={delivery.id}
              delivery={delivery}
              currentDelivery={currentDelivery}
              setCurrentDelivery={setCurrentDelivery}
            />
          )
        })}
      </div>

      <div className="p-2 mr-2 flex flex-col justify-center font-semibold text-[12px] h-[70%] shadow-[0_0_2px_#bbb]"
        onClick={() => {
          setCurrentDelivery(null);
          setCurrentDeliveryDetail(null);
        }}
      >
        <p className="text-blue-400">Lam: Chờ thêm xe</p>
        <p className="text-red-700">Đỏ: Hết xe</p>
        <p className="text-green-800">Lục: Chờ duyệt xe</p>
        <p className="text-yellow-400">Vàng: Bị từ chối xe</p>
      </div>

      {user.roleid == 3 && <div className="aspect-square font-semibold hover:scale-[1.05] hover:cursor-pointer hover:shadow-[0_0_3px_#aaa] h-[70%] shadow-[0_0_2px_#bbb] flex items-center justify-center"
        onClick={() => {
          setCurrentDelivery(null);
          setCurrentDeliveryDetail(null);
        }}
      >Add</div>}
    </div>
  )
}

export default DeliveryList