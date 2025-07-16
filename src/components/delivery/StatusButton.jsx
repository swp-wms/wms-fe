import { useEffect, useState } from 'react'
import { deliveryStatus } from '../../data/deliveryStatus'
import axios from 'axios';
import { api } from '../../config/api';
import { handleCancelDelivery } from '../../backendCalls/delivery';
import toast from 'react-hot-toast';
const StatusButton = ({ currentDelivery, user, setCurrentDelivery, act, deliverySchedule, setDeliverySchedule }) => {
    const notify = () => toast.success("Chuyển trạng thái thành công.");

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
            if (status === '3') {
                await axios.put(api.IS_DELIVERYING(currentDelivery.id), { act }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCurrentDelivery({ ...currentDelivery, deliverystatus: '4' });
                setDeliverySchedule(deliverySchedule.map((delivery) => delivery.id === currentDelivery.id ? { ...delivery, deliverystatus: '4' } : delivery));
                notify();
            }
            if (status === '4') {
                await axios.put(api.COMPLETE(currentDelivery.id), { act }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCurrentDelivery({ ...currentDelivery, deliverystatus: '5' });
                setDeliverySchedule(deliverySchedule.map((delivery) => delivery.id === currentDelivery.id ? { ...delivery, deliverystatus: '5' } : delivery));
                notify();
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    const handleCancelADelivery = async (e) => {
        e.preventDefault();
        try {
            if (user.roleid !== 3) {
                setError('Bạn không có quyền chuyển trạng thái.');
                return;
            }

            await handleCancelDelivery(currentDelivery.id);
            setCurrentDelivery({ ...currentDelivery, deliverystatus: '0' });
            setDeliverySchedule(deliverySchedule.map((delivery) => delivery.id === currentDelivery.id ? { ...delivery, deliverystatus: '0' } : delivery));
            toast.success('Hủy vận chuyển thành công.');
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    return (
        <div className='StatusButton mt-3'>
            <p className='text-red-700'>{error}</p>
            {currentDelivery && <div className="button-status flex justify-between items-center">
                {status &&
                    <div>
                        <span>Trạng thái:</span>
                        <button
                            title='Trạng thái vận chuyển'
                            onClick={(e) => handleChangeStatus(e)}
                            style={{
                                background: `${(deliveryStatus.find(d => Number(d.id) === Number(status))).color}`,
                                color: `${(deliveryStatus.find(d => Number(d.id) === Number(status))).text}`
                            }}
                            className={`w-fit text-white cursor-pointer hover:scale-[1.02] ml-2 hover:shadow-[1px_1px_3px_#aaa] hover:duration-200 rounded-full py-2 px-4 shadow-[0_0_2px_#aaa]`}
                        >{(deliveryStatus.find(d => d.id === status)).name}</button>
                    </div>}
                {user.roleid === 3 && Number(currentDelivery.deliverystatus) < 4 && Number(currentDelivery.deliverystatus) !== 0 &&
                    <button className={`text-red-600 cursor-pointer hover:bg-red-600 hover:text-white hover:duration-200 rounded-full py-2 px-4 shadow-[0_0_4px_#a00000]`}
                        onClick={(e) => handleCancelADelivery(e)}
                    >Hủy vận chuyển</button>
                }
            </div>}
        </div>
    )
}

export default StatusButton