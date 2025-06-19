import { useEffect, useState } from 'react'
import { deliveryStatus } from '../../data/deliveryStatus'
import { handleIsDeliverying } from '../../backendCalls/delivery';
import axios from 'axios';
import { api } from '../../config/api';
const StatusButton = ({ currentDelivery, user, setCurrentDelivery }) => {
    const [status, setStatus] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        setStatus(currentDelivery.deliverystatus);
        setError();
    }, [currentDelivery]);

    const handleChangeStatus = async (e) => {
        e.preventDefault();
        if (user.roleid !== 5) {
            setError('Bạn không có quyền chuyển trạng thái.');
            return;
        }
        try {
            await axios.put(api.IS_DELIVERYING(currentDelivery.id), {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            window.location.reload();
        } catch (error) {
            setError("Có lỗi xảy ra. Vui lòng thử lại sau");
        }
    }

    return (
        <div className='StatusButton'>
            <p className='text-red-700'>{error}</p>
            {currentDelivery && <div className="button-status flex justify-end">
                {status && <button
                    onClick={(e) => handleChangeStatus(e)}
                    className={`w-fit border-[1px] cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_2px_#aaa] hover:duration-200 rounded-full py-2 mt-2 px-4 bg-[var(--fill-color)] border-black`}
                >{(deliveryStatus.find(d => d.id === status)).name}</button>}
            </div>}
        </div>
    )
}

export default StatusButton