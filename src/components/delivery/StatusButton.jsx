import { useEffect, useState } from 'react'
import { deliveryStatus } from '../../data/deliveryStatus'
import axios from 'axios';
import { api } from '../../config/api';
import { handleCancelDelivery } from '../../backendCalls/delivery';
import toast from 'react-hot-toast';
const StatusButton = ({ currentDelivery, user, setCurrentDelivery, act }) => {
    const notify = () => toast("Chuyển trạng thái thành công.");

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
                setCurrentDelivery({...currentDelivery, deliverystatus: '4'});
            }
            if (status === '4') {
                await axios.put(api.COMPLETE(currentDelivery.id), { act }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            notify();
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
            window.location.reload();
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    return (
        <div className='StatusButton mt-3'>
            <p className='text-red-700'>{error}</p>
            {currentDelivery && <div className="button-status flex justify-between items-center">
                {user.roleid === 3 && <button className='btn px-5 py-2'
                    onClick={(e) => handleCancelADelivery(e)}
                >Hủy vận chuyển</button>}
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
            </div>}
        </div>
    )
}

export default StatusButton