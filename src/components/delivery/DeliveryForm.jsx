import { faCancel, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProductTable from './ProductTable'
import DriverInfo from './DriverInfo'
import { useState } from 'react'
import { handleApproveTruck, handleCreateDelivery } from '../../backendCalls/delivery'
import { deliveryStatus } from '../../data/deliveryStatus'

const DeliveryForm = ({ currentOrder, currentDelivery = null, currentDeliveryDetail = null, user }) => {
    // const { deliverydate, deliverytime, gettime, getdate, note, listDeliveryDetail } = req.body;

    const [newDelivery, setNewDelivery] = useState({});

    const [newDeliveryList, setNewDeliveryList] = useState([]);
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
            <div className="mb-3 flex justify-between">
                <span>Mã đơn: {currentOrder.orderid}</span>
                <span>Địa chỉ: {currentOrder.address}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="">
                    <label htmlFor="">Ngày bốc hàng: {currentDelivery && currentDelivery.getdate}</label>
                    {!currentDelivery &&
                        <input
                            onChange={(e) => {
                                setNewDelivery({ ...newDelivery, getdate: e.target.value })
                            }}
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
                            required
                            className='border-[1px] w-[100px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                        />}
                </div>
            </div>
            {currentDelivery && <div className="flex justify-end">
                <p
                    className={`w-fit border-[1px] rounded-full py-2 mt-2 px-4 bg-[var(--fill-color)] border-black`}
                >{(deliveryStatus.find(d => d.id === currentDelivery.deliverystatus)).name}</p>
            </div>}

            {currentOrder && <ProductTable
                newDeliveryList={newDeliveryList}
                setNewDeliveryList={setNewDeliveryList}
                currentOrder={currentOrder}
                newDelivery={newDelivery}
                setNewDelivery={setNewDelivery}
                currentDelivery={currentDelivery}
                currentDeliveryDetail={currentDeliveryDetail}
                user={user}
            />}

            {currentDelivery && <DriverInfo
                currentDelivery={currentDelivery}
                user={user}
            />}

            <p className="text-red-700 font-medium text-center my-2">{error}</p>

            {!currentDelivery && user.roleid === 3 && <div className="absolute flex gap-3 bottom-[20px] right-[20px]">
                <button className='btn px-4 py-2' onClick={(e) => createDelivery(e)}>
                    <FontAwesomeIcon icon={faPlusCircle} className='mr-2' />
                    Thêm
                </button>
                <button className='btn px-4 py-2 '>
                    <FontAwesomeIcon icon={faCancel} className='mr-2' />
                    Hủy
                </button>
            </div>}
            {currentDelivery && currentDelivery.deliverystatus === '2' && user.roleid === 3 && <div className="absolute flex gap-3 bottom-[20px] right-[20px]">
                <button className='btn px-4 py-2 '
                    onClick={(e) => {handleApprove(e)}}>
                    <FontAwesomeIcon icon={faPlusCircle} className='mr-2' />
                    Duyệt
                </button>
                <button className='btn px-4 py-2 '
                    onClick={(e) => {handleReject(e)}}
                >
                    <FontAwesomeIcon icon={faCancel} className='mr-2' />
                    Từ chối
                </button>
            </div>}
        </form>
    )
}

export default DeliveryForm