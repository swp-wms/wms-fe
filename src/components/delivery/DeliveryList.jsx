
import { faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DeliveryDetail from "./DeliveryDetail"

const DeliveryList = () => {
  return (
    <div className="DeliveryList h-full flex items-center border-t-[1px] border-[#cccccc] py-3 px-[20px]">
        {/* Company info */}
        <div className="text-[14px] mr-4">
          <p className="font-medium mb-2">ABC Company</p>
          <p>Mã đơn: 123</p>
        </div>
        {/* Delivery list */}
        <div className="detail-list h-full text-[13px] flex gap-3">
          <DeliveryDetail status={'1'}/>
          <DeliveryDetail status={'2'} />
          <DeliveryDetail status={'-2'} />
          <DeliveryDetail status={'3'} />
                    
        </div>
    </div>
  )
}

export default DeliveryList