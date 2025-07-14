import { faCancel, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProductTable from './ProductTable'
import DriverInfo from './DriverInfo'
import { useState } from 'react'
import { getDeliveriesForOrder, handleApproveTruck, handleCreateDelivery } from '../../backendCalls/delivery'
import StatusButton from './StatusButton'
import DeliveryInfo from './DeliveryInfo'
import toast from 'react-hot-toast'

const DeliveryForm = ({
    setIsChangePercent,
    currentOrder,
    currentDelivery = null, setCurrentDelivery,
    currentDeliveryDetail = null, setCurrentDeliveryDetail,
    deliverySchedule, setDeliverySchedule,
    act,
    user }) => {

    const [newDelivery, setNewDelivery] = useState({}); //1 delivery

    const [newDeliveryList, setNewDeliveryList] = useState([]);  //product list of delivery
    const [error, setError] = useState();

    const handleEmptyForm = (e) => {
        e.preventDefault();
        setNewDelivery({
            gettime: '',
            getdate: '',
            deliverytime: '',
            deliverydate: ''
        });
        setNewDeliveryList([]);
    }

    const handleApprove = async (e) => {
        e.preventDefault();
        setError();
        try {
            handleApproveTruck(currentDelivery.id, true);
            // window.location.reload();
            toast.success('Phê duyệt vận chuyển thành công.');
            setCurrentDelivery({ ...currentDelivery, deliverystatus: '3' });
            setDeliverySchedule(deliverySchedule.map((delivery) => delivery.id === currentDelivery.id ? { ...delivery, deliverystatus: '3' } : delivery));
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    const handleReject = async (e) => {
        e.preventDefault();
        setError();
        try {
            handleApproveTruck(currentDelivery.id, false);
            // window.location.reload();
            toast.success('Đã từ chối vận chuyển.');
            setCurrentDelivery({ ...currentDelivery, deliverystatus: '-2' });
            setDeliverySchedule(deliverySchedule.map((delivery) => delivery.id === currentDelivery.id ? { ...delivery, deliverystatus: '-2' } : delivery));
            setIsChangePercent(prev => !prev);
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    const createDelivery = async (e) => {
        e.preventDefault();
        if (document.querySelector('.DeliveryForm').checkValidity()) {
            setError();
            if (newDelivery.getdate > newDelivery.deliverydate) {
                setError('Ngày vận chuyển không thể sớm hơn ngày bốc hàng.');
                return;
            }
            if (newDeliveryList.length === 0) {
                setError('Một đơn vận chuyển không thể để trống.');
                return;
            }

            try {
                const data = { ...newDelivery, listDeliveryDetail: newDeliveryList, deliverystatus: '1' };
                await handleCreateDelivery(currentOrder.orderid, data);

                // fetch delivery list after add new delivery
                const response = (await getDeliveriesForOrder(currentOrder.orderid)).data;
                setDeliverySchedule(response.length > 0 ? response.sort((a, b) => new Date(b.deliverydate) - new Date(a.deliverydate)) : []);

                toast.success('Tạo đơn vận chuyển thành công.');
                setIsChangePercent(prev => !prev);
                handleEmptyForm(e);
            } catch (error) {
                setError('Xảy ra lỗi. Vui lòng thử lại sau.');
                console.log(error);

            }
        } else {
            setError('Trừ ghi chú, bạn cần điền hết các trường yêu cầu.\n Số lượng và khối lượng phải lớn hơn 0.');
        }
    }

    return (
        <form className='DeliveryForm overflow-y-scroll relative font-[500] text-[14px] bg-white h-[90%] shadow-[0_0_2px_#ccc] p-5'>
            <DeliveryInfo
                user={user}
                currentOrder={currentOrder}
                currentDelivery={currentDelivery}
                setCurrentDelivery={setCurrentDelivery}
                newDelivery={newDelivery}
                setNewDelivery={setNewDelivery}
            />
            {currentDelivery && <StatusButton
                setIsChangePercent={setIsChangePercent}
                setCurrentDelivery={setCurrentDelivery}
                currentDelivery={currentDelivery} user={user}
                act={act}
                deliverySchedule={deliverySchedule}
                setDeliverySchedule={setDeliverySchedule}
            />}

            {currentOrder && <ProductTable
                setIsChangePercent={setIsChangePercent}
                newDeliveryList={newDeliveryList}
                setNewDeliveryList={setNewDeliveryList}
                currentOrder={currentOrder}
                currentDelivery={currentDelivery}
                setCurrentDelivery={setCurrentDelivery}
                currentDeliveryDetail={currentDeliveryDetail}
                setCurrentDeliveryDetail={setCurrentDeliveryDetail}
                deliverySchedule={deliverySchedule}
                setDeliverySchedule={setDeliverySchedule}
                user={user} act={act}
            />}

            {currentDelivery && <DriverInfo
                setIsChangePercent={setIsChangePercent}
                currentDelivery={currentDelivery}
                setCurrentDelivery={setCurrentDelivery}
                user={user}
                deliverySchedule={deliverySchedule}
                setDeliverySchedule={setDeliverySchedule}
            />}

            <p className="text-red-700 font-medium text-center my-2">{error}</p>

            {!currentDelivery && user.roleid === 3 && <div className="flex justify-end gap-3">
                <button className='btn px-4 py-2' onClick={(e) => createDelivery(e)}>
                    <FontAwesomeIcon icon={faPlusCircle} className='mr-2' />
                    Thêm
                </button>
                <button type='button' className='btn px-4 py-2 '>
                    <FontAwesomeIcon icon={faCancel} className='mr-2'
                        onClick={(e) => handleEmptyForm(e)} />
                    Hủy
                </button>
            </div>}
            {currentDelivery && currentDelivery.deliverystatus === '2' && user.roleid === 3 && <div className="flex justify-end gap-3">
                <button className='btn px-4 py-2 '
                    onClick={(e) => { handleApprove(e) }}>
                    <FontAwesomeIcon icon={faPlusCircle} className='mr-2' />
                    Duyệt
                </button>
                <button className='btn px-4 py-2 '
                    onClick={(e) => { handleReject(e) }}
                >
                    <FontAwesomeIcon icon={faCancel} className='mr-2' />
                    Từ chối
                </button>
            </div>}
        </form>
    )
}

export default DeliveryForm