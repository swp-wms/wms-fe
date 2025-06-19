import { faCancel, faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { use, useState } from "react"
import { handleAddTruck, handleConfirmNotEnoughTruck } from "../../backendCalls/delivery";

const DriverInfo = ({ currentDelivery, user }) => {
    const [driver, setDriver] = useState({});
    const [error, setError] = useState();
    const [edit, setEdit] = useState(false); //set edit for delivery staff

    const addTruck = async (e) => {
        e.preventDefault();
        try {
            if (!driver.drivername || !driver.drivercode || !driver.licenseplate || !driver.driverphonenumber) {
                setError('Bạn cần điền đầy đủ thông tin tài xế.');
            } else {
                await handleAddTruck(currentDelivery.id, driver);
                setError();
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            
            setError(error);
        }
    }

    const handleNotEnoughTruck = async (e) => {
        e.preventDefault();
        try {
            await handleConfirmNotEnoughTruck(currentDelivery.id);
            setError();
            window.location.reload();

        } catch (error) {
            setError(error);
        }
    }

    return (
        <div className="">
            <div className="flex gap-3">
                <div className="flex-1">
                    <h1 className='font-bold uppercase my-2'>Thông tin tài xế</h1>
                    <div className="flex mb-1 items-center">
                        <label className='flex-1'>Họ tên: {(currentDelivery?.drivername && !edit) && currentDelivery.drivername}</label>
                        {(user.roleid == 5 && ((!currentDelivery.drivername) || (currentDelivery?.deliverystatus === '-2' && edit === true))) &&
                            <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                                onChange={(e) => {
                                    setDriver({ ...driver, drivername: e.target.value });
                                }}
                                value={driver.drivername}
                            />
                        }
                    </div>
                    <div className="flex mb-1 items-center">
                        <label className='flex-1'>CCCD/GPLX: {(currentDelivery?.drivername && !edit) && currentDelivery.drivercode}</label>
                        {(user.roleid == 5 && ((!currentDelivery.drivername) || (currentDelivery?.deliverystatus === '-2' && edit === true))) &&
                            <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                                onChange={(e) => {
                                    setDriver({ ...driver, drivercode: e.target.value });
                                }}
                                value={driver.drivercode}
                            />}
                    </div>
                    <div className="flex mb-1 items-center">
                        <label className='flex-1'>Số điện thoại: {(currentDelivery?.drivername && !edit) && currentDelivery.driverphonenumber}</label>
                        {(user.roleid == 5 && ((!currentDelivery.drivername) || (currentDelivery?.deliverystatus === '-2' && edit === true))) &&
                            <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                                onChange={(e) => {
                                    setDriver({ ...driver, driverphonenumber: e.target.value });
                                }}
                                value={driver.driverphonenumber}
                            />}
                    </div>
                </div>
                <div className="flex-1">
                    <h1 className='font-bold uppercase my-2'>Thông tin xe</h1>
                    <div className="flex mb-1 items-center">
                        <label className='flex-1'>Biển số xe: {(currentDelivery?.drivername && !edit) && currentDelivery.licenseplate}</label>
                        {(user.roleid == 5 && ((!currentDelivery.drivername) || (currentDelivery?.deliverystatus === '-2' && edit === true))) &&
                            <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                                onChange={(e) => {
                                    setDriver({ ...driver, licenseplate: e.target.value });
                                }}
                                value={driver.licenseplate}
                            />}
                    </div>
                    <div className="">
                        <label>Ghi chú:  {(currentDelivery?.drivername && !edit) && currentDelivery.note}</label> <br />
                        {(user.roleid == 5 && ((!currentDelivery.drivername) || (currentDelivery?.deliverystatus === '-2' && edit === true))) 
                            && <textarea 
                                    onChange={(e) => {
                                        setDriver({ ...driver, note: e.target.value });
                                    }}
                                    value={driver.note}
                                    className='mt-2 p-2 border-[1px] border-[#aaa] rounded w-full min-h-[100px]'></textarea>}
                    </div>
                </div>
            </div>
            <p className="text-red-700">{error}</p>
            <div className="flex gap-3 justify-end  mt-4">
                {((currentDelivery.deliverystatus === '1') || (currentDelivery.deliverystatus === '-2' && edit)) && user.roleid === 5 && <button className='btn px-4 py-2 '
                    onClick={(e) => addTruck(e)}
                >
                    <FontAwesomeIcon icon={faPlusCircle} className='mr-2' />
                    Xác nhận
                </button>}
                {currentDelivery.deliverystatus === '1' && user.roleid === 5 &&
                    <button className='btn px-4 py-2 '
                        onClick={(e) => handleNotEnoughTruck(e)}>
                        <FontAwesomeIcon icon={faCancel} className='mr-2' />
                        Không đủ xe
                    </button>
                }
                {currentDelivery?.deliverystatus === '-2' && user.roleid === 5 && <div className="flex gap-3 bottom-[20px] right-[20px]">
                    <button className='btn px-4 py-2'
                        onClick={(e) => {
                            e.preventDefault();
                            setEdit(true);
                            setDriver({
                                drivername: currentDelivery.drivername,
                                drivercode: currentDelivery.drivercode,
                                licenseplate: currentDelivery.licenseplate,
                                driverphonenumber: currentDelivery.driverphonenumber,
                                note: currentDelivery.note
                            })
                        }}
                    >
                        <FontAwesomeIcon icon={faPlusCircle} className='mr-2' />
                        Sửa
                    </button>
                </div>}
            </div>
        </div>
    )
}

export default DriverInfo