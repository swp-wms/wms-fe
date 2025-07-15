import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deliveryStatus } from '../../data/deliveryStatus'
import { Link } from 'react-router-dom'

const DeliveryDetail = ({ delivery, setCurrentDelivery, currentDelivery }) => {
    return (
        <Link to={`/ke-hoach-van-chuyen/${window.location.pathname.split('/')[2]}/${delivery.orderid}/${delivery.id}`} className={`${currentDelivery && currentDelivery.id === delivery.id ? 'bg-[var(--fill-color)]' : ''} detail relative aspect-square hover:scale-[1.05] hover:cursor-pointer hover:shadow-[0_0_3px_#aaa] h-[90%] shadow-[0_0_2px_#bbb] flex items-center justify-center`}
            onClick={() => {setCurrentDelivery(delivery)}}
        >
            <div className="text-center">
                <p className="font-medium">{delivery.deliverydate}</p>
                <p className='text-[10px]'>Code:{delivery.id}</p>
            </div>
            {delivery.deliverystatus !== null && <FontAwesomeIcon color={`${(deliveryStatus.find(d => d.id === delivery.deliverystatus)).color}`} icon={faCircle} className={`absolute top-[-5px] right-[-5px]`} />}
        </Link>
    )
}

export default DeliveryDetail