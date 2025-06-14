import { faAdd, faCancel, faPlusCircle, faRemove, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const DeliveryForm = () => {
    return (
        <div className='DeliveryForm relative font-[500] text-[14px] bg-white h-[90%] shadow-[0_0_2px_#ccc] p-5'>
            <div className="flex items-center justify-between">
                <div className="">
                    <label htmlFor="">Ngày:</label>
                    <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="date" />
                </div>
                <div className="">
                    <label htmlFor="">Thời gian:</label>
                    <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="text" />
                </div>
                <span>Mã đơn: 123</span>
            </div>
            <div className="mt-2">
                <label htmlFor="">Khối lượng xe:</label>
                <input className='border-[1px] border-[#aaa] rounded py-1 px-2 ml-2' type="number" />
            </div>

            <div className="flex justify-between items-center my-3">
                <h1 className='font-bold'>THÔNG TIN HÀNG HÓA</h1>
                <div className="border-[1px] border-[#aaa]  rounded px-3 py-2 w-[50%] flex items-center">
                    <FontAwesomeIcon icon={faSearch} className='mr-3 cursor-pointer' title='Tìm kiếm'/>
                    <input className='flex-1 outline-0'
                        type="text" placeholder='Tìm kiếm mã hàng hóa, tên hàng hóa' />
                </div>
            </div>

            <table className='products w-full text-[13px]'>
                <tr>
                    <th className='border-[1px] border-black'>STT</th>
                    <th className='border-[1px] border-black'>Mã hàng</th>
                    <th className='border-[1px] border-black'>Đơn trọng</th>
                    <th className='border-[1px] border-black'>Dài</th>
                    <th className='border-[1px] border-black'>Tổng khối lượng</th>
                    <th className='border-[1px] border-black w-[25%]'>Ghi chú</th>
                    <th className='border-[1px] border-black'>Xóa</th>
                </tr>
                <tr>
                    <td className='border-[1px] border-black text-center'>1</td>
                    <td className='border-[1px] border-black text-center'>CD19029H</td>
                    <td className='border-[1px] border-black text-center'>3</td>
                    <td className='border-[1px] border-black text-center'>11.7</td>
                    <td className='border-[1px] border-black text-center'>
                        <input type="number" placeholder='...' className='w-[60px] text-center' /> kg
                    </td>
                    <td className='border-[1px] border-black text-center'>
                        <input type="text" className='w-[100%] text-center' />
                    </td>
                    <td className='border-[1px] border-black text-center'>
                        <FontAwesomeIcon icon={faRemove} className='text-red-600 hover:cursor-pointer' title='Xóa' />
                    </td>
                </tr>
                <tr>
                    <td className='border-[1px] border-black text-center'>1</td>
                    <td className='border-[1px] border-black text-center'>CD19029H</td>
                    <td className='border-[1px] border-black text-center'>3</td>
                    <td className='border-[1px] border-black text-center'>11.7</td>
                    <td className='border-[1px] border-black text-center'>
                        <input type="number" placeholder='...' className='w-[60px] text-center' /> kg
                    </td>
                    <td className='border-[1px] border-black text-center'>
                        <input type="text" className='w-[100%] text-center' />
                    </td>
                    <td className='border-[1px] border-black text-center'>
                        <FontAwesomeIcon icon={faRemove} className='text-red-600 hover:cursor-pointer' title='Xóa' />
                    </td>
                </tr>
                <tr>
                    <td className='border-[1px] border-black text-center'>1</td>
                    <td className='border-[1px] border-black text-center'>CD19029H</td>
                    <td className='border-[1px] border-black text-center'>3</td>
                    <td className='border-[1px] border-black text-center'>11.7</td>
                    <td className='border-[1px] border-black text-center'>
                        <input type="number" placeholder='...' className='w-[60px] text-center' /> kg
                    </td>
                    <td className='border-[1px] border-black text-center'>
                        <input type="text" className='w-[100%] text-center' />
                    </td>
                    <td className='border-[1px] border-black text-center'>
                        <FontAwesomeIcon icon={faRemove} className='text-red-600 hover:cursor-pointer' title='Xóa' />
                    </td>
                </tr>
                <tr>
                    <td className='border-[1px] border-black text-center'>1</td>
                    <td className='border-[1px] border-black text-center'>CD19029H</td>
                    <td className='border-[1px] border-black text-center'>3</td>
                    <td className='border-[1px] border-black text-center'>11.7</td>
                    <td className='border-[1px] border-black text-center'>
                        <input type="number" placeholder='...' className='w-[60px] text-center' /> kg
                    </td>
                    <td className='border-[1px] border-black text-center'>
                        <input type="text" className='w-[100%] text-center' />
                    </td>
                    <td className='border-[1px] border-black text-center'>
                        <FontAwesomeIcon icon={faRemove} className='text-red-600 hover:cursor-pointer' title='Xóa' />
                    </td>
                </tr>

                {/* Tổng */}
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className='text-center'>Tổng: 38kg</td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
            <div className="absolute flex gap-3 bottom-[20px] right-[20px]">
                <button className='btn'>
                    <FontAwesomeIcon icon={faPlusCircle} className='mr-2' />
                    Thêm
                </button>
                <button className='btn'>
                    <FontAwesomeIcon icon={faCancel} className='mr-2' />
                    Hủy
                </button>
            </div>
        </div>
    )
}

export default DeliveryForm