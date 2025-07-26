import { faCancel, faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { handleAddTruck, handleConfirmNotEnoughTruck } from "../../backendCalls/delivery";
import toast from "react-hot-toast";

const DriverInfo = ({ setIsChangePercent, currentDelivery, setCurrentDelivery, user, deliverySchedule, setDeliverySchedule }) => {
    const [driver, setDriver] = useState({});
    const [edit, setEdit] = useState(false); //set edit for delivery staff

    const addTruck = async (e) => {
        e.preventDefault();

        const gett = new Date(`${currentDelivery.getdate}T${currentDelivery.gettime}`);
        const deliveryt = new Date(`${currentDelivery.deliverydate}T${currentDelivery.deliverytime}`);

        console.log('Pickup Date/Time:', gett);
        console.log('Delivery Date/Time:', deliveryt);
        console.log('Is Pickup < Delivery (full comparison)?', gett < deliveryt);

        try {
            if (!driver.drivername || !driver.drivercode || !driver.licenseplate || !driver.driverphonenumber) {
                toast.error('Bạn cần điền đầy đủ thông tin tài xế.');
            } else if (driver.drivername.trim().length <= 0 || driver.drivercode.trim().length <= 0 || driver.driverphonenumber.trim().length <= 0 || driver.licenseplate.trim().length <= 0) {
                toast.error('Bạn cần điền đầy đủ thông tin tài xế.');
            } else if (!/^[\p{L} ]+$/u.test(driver.drivername)) {
                toast.error('Tên tài xế không được chứa số hay kí tự đặc biệt.');
            } else if (driver.drivercode.length !== 12 || !(/^\d+$/.test(driver.drivercode))) {
                toast.error('CCCD/GPLX bao gồm 12 chữ số.');
            } else if (!(/^0\d{9,10}$/.test(driver.driverphonenumber))) {
                toast.error('Số điện thoại gồm 10 hoặc 11 chữ số, bắt đầu bằng số 0.');
            } else if (!currentDelivery.deliverytime || !currentDelivery.gettime) {
                toast.error('Thời gian bốc hàng và giao hàng cần được điền.');
            }
            // --- START OF FIX ---
            else if (gett.getTime() >= deliveryt.getTime()) { // This checks if pickup is *after* delivery
                toast.error('Thời gian giao hàng không thể sớm hơn thời gian bốc hàng.');
            }
            // --- END OF FIX ---
            else {
                // await handleAddTruck(currentDelivery.id, { ...driver, deliverytime: currentDelivery.deliverytime, gettime: currentDelivery.gettime });
                
                setCurrentDelivery({
                    ...currentDelivery,
                    drivername: driver.drivername,
                    drivercode: driver.drivercode,
                    licenseplate: driver.licenseplate,
                    driverphonenumber: driver.driverphonenumber,
                    deliverystatus: '2'
                });

                setDeliverySchedule(deliverySchedule.map((delivery) => delivery.id === currentDelivery.id ? { ...delivery, deliverystatus: '2' } : delivery));

                toast.success('Thêm tài xế thành công.');
                setDriver({});
            }
        } catch (error) {
            console.error("Error in addTruck:", error); // Use console.error for errors
            toast.error('Có lỗi xảy ra khi thêm tài xế.'); // Generic error message for the user
        }
    }

    const handleNotEnoughTruck = async (e) => {
        e.preventDefault();
        try {
            await handleConfirmNotEnoughTruck(currentDelivery.id);
            toast.error();
            // window.location.reload();
            setDeliverySchedule(deliverySchedule.map((delivery) => delivery.id === currentDelivery.id ? { ...delivery, deliverystatus: '-1' } : delivery));

            toast.success('Cập nhật trạng thái thành công.');
            setIsChangePercent(prev => !prev);
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <div className="">
            <div className="flex gap-3">
                <div className="flex-1">
                    <h1 className='font-bold uppercase my-2'>Thông tin tài xế</h1>
                    <div className="flex mb-1 items-center">
                        <label className='flex-1'>Họ tên: {(currentDelivery?.drivername && !edit) && currentDelivery.drivername}</label>
                        {(user.roleid == 5 && ((!currentDelivery.drivername) || (Math.abs(Number(currentDelivery?.deliverystatus)) === 2 && edit === true))) &&
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
                        {(user.roleid == 5 && ((!currentDelivery.drivername) || (Math.abs(Number(currentDelivery?.deliverystatus)) === 2 && edit === true))) &&
                            <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                                onChange={(e) => {
                                    setDriver({ ...driver, drivercode: e.target.value });
                                }}
                                value={driver.drivercode}
                            />}
                    </div>
                    <div className="flex mb-1 items-center">
                        <label className='flex-1'>Số điện thoại: {(currentDelivery?.drivername && !edit) && currentDelivery.driverphonenumber}</label>
                        {(user.roleid == 5 && ((!currentDelivery.drivername) || (Math.abs(Number(currentDelivery?.deliverystatus)) === 2 && edit === true))) &&
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
                        {(user.roleid == 5 && ((!currentDelivery.drivername) || (Math.abs(Number(currentDelivery?.deliverystatus)) === 2 && edit === true))) &&
                            <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text"
                                onChange={(e) => {
                                    setDriver({ ...driver, licenseplate: e.target.value });
                                }}
                                value={driver.licenseplate}
                            />}
                    </div>
                    <div className="">
                        <label>Ghi chú:  {(currentDelivery?.drivername && !edit) && currentDelivery.note}</label> <br />
                        {(user.roleid == 5 && ((!currentDelivery.drivername)
                            || (Math.abs(Number(currentDelivery?.deliverystatus)) === 2 && edit === true)))
                            && <textarea
                                onChange={(e) => {
                                    setDriver({ ...driver, note: e.target.value });
                                }}
                                value={driver.note}
                                className='mt-2 p-2 border-[1px] border-[#aaa] rounded w-full min-h-[100px]'></textarea>}
                    </div>
                </div>
            </div>
            <div className="flex gap-3 justify-end  mt-4">
                {((currentDelivery.deliverystatus === '1') || (Math.abs(Number(currentDelivery?.deliverystatus)) === 2 && edit)) && user.roleid === 5 && <button className='btn px-4 py-2 '
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
                {(Math.abs(Number(currentDelivery?.deliverystatus)) === 2) && user.roleid === 5 && <div className="flex gap-3 bottom-[20px] right-[20px]">
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