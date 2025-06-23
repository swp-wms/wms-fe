
import { deliveryStatus } from "../../data/deliveryStatus";
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

{/* Chú thích color */}
      <div className="p-2 mr-2 font-semibold text-[12px] h-[100%] shadow-[0_0_2px_#bbb]"
        onClick={() => {
          setCurrentDelivery(null);
          setCurrentDeliveryDetail(null);
        }}
      >
        <p className="underline">Chú thích</p>
        <div className="flex flex-col flex-wrap h-[90%]">
          {deliveryStatus.map(status => {
            if (status.color) {
              return (
                <p key={status.id} className={`${status.color} px-1`}>{status.name}</p>
              )
            }
          })}
        </div>
      </div>

      {user.roleid == 3 && <div className="aspect-square font-semibold hover:scale-[1.05] hover:cursor-pointer hover:shadow-[0_0_3px_#aaa] h-[70%] shadow-[0_0_2px_#bbb] flex items-center justify-center"
        onClick={() => {
          setCurrentDelivery(null);
          setCurrentDeliveryDetail(null);
        }}
      >Thêm</div>}
    </div>
  )
}

export default DeliveryList