import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DeliveryDetail = ({ status = null }) => {
    return (
        <div className="detail relative aspect-square hover:scale-[1.05] hover:cursor-pointer hover:shadow-[0_0_3px_#aaa] h-full shadow-[0_0_2px_#bbb] flex items-center justify-center">
            <span className="font-medium">10/05/2025</span>
            {status !== null && <FontAwesomeIcon icon={faCircle} className={`absolute top-[-5px] right-[-5px] 
                ${status === '1' ? 'text-red-500' 
                : status === '2' ? "text-green-900" 
                : status === '-2' ? "text-yellow-300" 
                : "text-transparent"}`} />}
        </div>
    )
}

export default DeliveryDetail