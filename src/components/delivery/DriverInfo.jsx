import { faCancel, faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { handleAddTruck } from "../../backendCalls/delivery";

const DriverInfo = ({ currentDelivery, user }) => {
    const [driver, setDriver] = useState({});
    const [error, setError] = useState();
    const addTruck = async (e) => {
        e.preventDefault();
        try {
            if(!driver.drivername || !driver.drivercode || !driver.licenseplate || !driver.driverphonenumber) {
                setError('Bạn cần điền đầy đủ thông tin tài xế.');
            } else {
                await handleAddTruck(currentDelivery.id, driver);
                setError();
                window.location.reload();
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    return (
        <div className="">
            <div className="flex gap-3">
                <div className="flex-1">
                    <h1 className='font-bold uppercase my-2'>Thông tin tài xế</h1>
                    <div className="flex mb-1 items-center">
                        <label className='flex-1'>Họ tên: {currentDelivery?.drivername && currentDelivery.drivername}</label>
                        {!currentDelivery.drivername && user.roleid == 5 &&
                            <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                                onChange={(e) => {
                                    // const { drivername, drivercode, driverphonenumber, licenseplate }
                                    setDriver({ ...driver, drivername: e.target.value });
                                }}
                                value={driver.drivername}
                            />
                        }
                    </div>
                    <div className="flex mb-1 items-center">
                        <label className='flex-1'>CCCD/GPLX: {currentDelivery?.drivercode && currentDelivery.drivercode}</label>
                        {!currentDelivery.drivername && user.roleid == 5 &&
                            <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                                onChange={(e) => {
                                    // const { drivername, drivercode, driverphonenumber, licenseplate }
                                    setDriver({ ...driver, drivercode: e.target.value });
                                }}
                                value={driver.drivercode}
                            />}
                    </div>
                    <div className="flex mb-1 items-center">
                        <label className='flex-1'>Số điện thoại: {currentDelivery?.driverphonenumber && currentDelivery.driverphonenumber}</label>
                        {!currentDelivery.drivername && user.roleid == 5 &&
                            <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                                onChange={(e) => {
                                    // const { drivername, drivercode, driverphonenumber, licenseplate }
                                    setDriver({ ...driver, driverphonenumber: e.target.value });
                                }}
                                value={driver.driverphonenumber}
                            />}
                    </div>
                </div>
                <div className="flex-1">
                    <h1 className='font-bold uppercase my-2'>Thông tin xe</h1>
                    <div className="flex mb-1 items-center">
                        <label className='flex-1'>Biển số xe: {currentDelivery?.licenseplate && currentDelivery.licenseplate}</label>
                        {!currentDelivery.drivername && user.roleid == 5 && 
                            <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text" 
                                onChange={(e) => {
                                    // const { drivername, drivercode, driverphonenumber, licenseplate }
                                    setDriver({...driver, licenseplate: e.target.value});
                                }}
                                value={driver.licenseplate}
                            />}
                    </div>
                    <div className="">
                        <label>Ghi chú:  {currentDelivery?.note && currentDelivery.note}</label> <br />
                        {!currentDelivery.drivername && user.roleid == 5 && <textarea className='mt-2 p-2 border-[1px] border-[#aaa] rounded w-full min-h-[100px]'></textarea>}
                    </div>
                </div>
            </div>
            <p className="text-red-700">{error}</p>
            <div className="flex gap-3 justify-end  mt-4">
                {currentDelivery.deliverystatus === '1' && <button className='btn px-4 py-2 '
                    onClick={(e) => addTruck(e)}
                >
                    <FontAwesomeIcon icon={faPlusCircle} className='mr-2' />
                    Xác nhận
                </button>}
                {currentDelivery.deliverystatus === '1' && <button className='btn px-4 py-2 '>
                    <FontAwesomeIcon icon={faCancel} className='mr-2' />
                    Không đủ xe
                </button>}
            </div>
        </div>
    )
}

export default DriverInfo