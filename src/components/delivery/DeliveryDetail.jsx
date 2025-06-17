import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DeliveryDetail = ({ delivery, setCurrentDelivery }) => {
    return (
        <div className="detail relative aspect-square hover:scale-[1.05] hover:cursor-pointer hover:shadow-[0_0_3px_#aaa] h-[90%] shadow-[0_0_2px_#bbb] flex items-center justify-center"
            onClick={() => setCurrentDelivery(delivery)}
        >
            <span className="font-medium">{delivery.deliverydate}</span>
            {delivery.deliverystatus !== null && <FontAwesomeIcon icon={faCircle} className={`absolute top-[-5px] right-[-5px] 
                ${delivery.deliverystatus === '1' ? 'text-red-500' 
                : delivery.deliverystatus === '2' ? "text-green-900" 
                : delivery.deliverystatus === '-2' ? "text-yellow-300" 
                : "text-transparent"}`} />}
        </div>
    )
}

export default DeliveryDetail