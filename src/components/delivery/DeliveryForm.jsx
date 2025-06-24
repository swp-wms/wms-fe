import { faCancel, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProductTable from './ProductTable'
import DriverInfo from './DriverInfo'
import { useState } from 'react'
import { handleApproveTruck, handleCreateDelivery } from '../../backendCalls/delivery'
import StatusButton from './StatusButton'

const DeliveryForm = ({
    currentOrder,
    currentDelivery = null, setCurrentDelivery,
    currentDeliveryDetail = null, setCurrentDeliveryDetail,
    act,
    user }) => {

    const [newDelivery, setNewDelivery] = useState({}); //1 delivery

    const [newDeliveryList, setNewDeliveryList] = useState([]);  //product list of delivery
    const [error, setError] = useState();

    const createDelivery = async (e) => {
        e.preventDefault();
        if (document.querySelector('.DeliveryForm').checkValidity()) {
            setError();
            try {
                const data = { ...newDelivery, listDeliveryDetail: newDeliveryList };
                const response = await handleCreateDelivery(currentOrder.orderid, data);
                window.location.reload();

            } catch (error) {
                setError(error.response.data.message);
            }
        } else {
            setError('Trừ ghi chú, bạn cần điền hết các trường yêu cầu.\n Số lượng và khối lượng phải lớn hơn 0.');
        }

    }

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
            window.location.reload();

        } catch (error) {
            setError(error.response.data.message);
        }
    }
    const handleReject = async (e) => {
        e.preventDefault();
        setError();
        try {
            handleApproveTruck(currentDelivery.id, false);
            window.location.reload();

        } catch (error) {
            setError(error.response.data.message);
        }
    }
    return (
        <form className='DeliveryForm overflow-y-scroll relative font-[500] text-[14px] bg-white h-[90%] shadow-[0_0_2px_#ccc] p-5'>
            <div className="mb-3 flex">
                <span className='flex-1'>Mã đơn: {currentOrder.orderid}</span>
                <span className='flex-1'>Địa chỉ: {currentOrder.address}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="">
                    <label htmlFor="">Ngày bốc hàng: {currentDelivery && currentDelivery.getdate}</label>
                    {!currentDelivery &&
                        <input
                            onChange={(e) => {
                                setNewDelivery({ ...newDelivery, getdate: e.target.value })
                            }}
                            value={newDelivery.getdate}
                            required
                            className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="date"
                        />}
                </div>
                <div className="">
                    <label htmlFor="">Thời gian bốc hàng: {currentDelivery && currentDelivery.gettime}</label>
                    {!currentDelivery &&
                        <input
                            onChange={(e) => {
                                setNewDelivery({ ...newDelivery, gettime: e.target.value })
                            }}
                            value={newDelivery.gettime}
                            required
                            className='border-[1px] w-[100px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                        />}
                </div>

            </div>
            <div className="flex items-center justify-between mt-2">
                <div className="">
                    <label htmlFor="">Ngày giao hàng: {currentDelivery && currentDelivery.deliverydate}</label>
                    {!currentDelivery &&
                        <input
                            onChange={(e) => {
                                setNewDelivery({ ...newDelivery, deliverydate: e.target.value })
                            }}
                            value={newDelivery.deliverydate}
                            required
                            className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="date"
                        />}
                </div>
                <div className="">
                    <label htmlFor="">Thời gian giao hàng: {currentDelivery && currentDelivery.deliverytime}</label>
                    {!currentDelivery &&
                        <input
                            onChange={(e) => {
                                setNewDelivery({ ...newDelivery, deliverytime: e.target.value })
                            }}
                            value={newDelivery.deliverytime}
                            required
                            className='border-[1px] w-[100px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                        />}
                </div>
            </div>
            {currentDelivery && <StatusButton
                setCurrentDelivery={setCurrentDelivery}
                currentDelivery={currentDelivery} user={user}
                act={act}
            />}

            {currentOrder && <ProductTable
                newDeliveryList={newDeliveryList}
                setNewDeliveryList={setNewDeliveryList}
                currentOrder={currentOrder}
                newDelivery={newDelivery}
                setNewDelivery={setNewDelivery}
                currentDelivery={currentDelivery}
                currentDeliveryDetail={currentDeliveryDetail}
                setCurrentDeliveryDetail={setCurrentDeliveryDetail}
                user={user} act={act}
            />}

            {currentDelivery && <DriverInfo
                currentDelivery={currentDelivery}
                user={user}
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