import { useEffect, useState } from 'react'
import { deliveryStatus } from '../../data/deliveryStatus'
import { handleIsDeliverying } from '../../backendCalls/delivery';
const StatusButton = ({ currentDelivery, user }) => {
    const [status, setStatus] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        setStatus(currentDelivery.deliverystatus);
    }, [currentDelivery]);

    const handleChangeStatus = async (e) => {
        e.preventDefault();
        if (user.roleid !== 5) {
            setError('Bạn không có quyền chuyển trạng thái.');
            return;
        }
        try {
            console.log(currentDelivery.id);

            await handleIsDeliverying(currentDelivery.id);
            console.log("run");
            setError();
            setStatus('4');
        } catch (error) {
            setError("Có lỗi xảy ra. Vui lòng thử lại sau");
        }
    }

    return (
        <div className='StatusButton'>
            <p className='text-red-700'>{error}</p>
            {currentDelivery && <div className="button-status flex justify-end">
                {status && <p
                    onClick={(e) => handleChangeStatus(e)}
                    className={`w-fit border-[1px] cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_2px_#aaa] hover:duration-200 rounded-full py-2 mt-2 px-4 bg-[var(--fill-color)] border-black`}
                >{(deliveryStatus.find(d => d.id === status)).name}</p>}
            </div>}
        </div>
    )
}

export default StatusButton