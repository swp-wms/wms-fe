import { useEffect, useState } from "react"
import { getRemainQuantityOfOrder } from "../../backendCalls/orderDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove, faSearch } from "@fortawesome/free-solid-svg-icons";

const ProductTable = ({
    currentOrder,
    currentDelivery, currentDeliveryDetail,
    user,
    newDeliveryList, setNewDeliveryList
}) => {
    const [show, setShow] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const [search, setSearch] = useState([]);
    const [totalWeight, setTotalWeight] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [error, setError] = useState();
    const [realBar, setRealBar] = useState();
    const [realWeight, setRealWeight] = useState();

    useEffect(() => {
        const getData = async () => {
            const response = await getRemainQuantityOfOrder(currentOrder.orderid);
            setSearchList(response.data);
            setSearch(response.data);
        }
        getData();
    }, []);

    useEffect(() => {
        let ttw = 0;
        let ttq = 0;
        for (let index = 0; index < newDeliveryList.length; index++) {
            if (newDeliveryList[index].totalweight) {
                ttw += Number(newDeliveryList[index].totalweight);
            }
            if (newDeliveryList[index].numberofbars) {
                ttq += Number(newDeliveryList[index].numberofbars);
            }
        }
        setTotalWeight(ttw);
        setTotalQuantity(ttq);

    }, [newDeliveryList, setNewDeliveryList])

    return (
        <div className="">
            <div className="flex justify-between items-center my-3">
                <h1 className='font-bold'>THÔNG TIN HÀNG HÓA</h1>
                {!currentDelivery && user.roleid === 3 &&
                    <div className="relative border-[1px] border-[#aaa]  rounded px-3 py-2 w-[50%] flex items-center">
                        <FontAwesomeIcon icon={faSearch} className='mr-3 cursor-pointer' title='Tìm kiếm' />
                        <input className='search-bar flex-1 outline-0'
                            onChange={(e) => {
                                setSearch([...searchList].filter(si => si.name.includes((e.target.value).toUpperCase())));
                            }}
                            onFocus={() => setShow(true)}
                            onBlur={() => setShow(false)}
                            type="text" placeholder='Tìm kiếm mã hàng hóa, tên hàng hóa' />
                        <ul className={`${show ? 'block' : 'hidden'} search-list absolute bg-white top-[100%] left-0 right-0 shadow-[0_0_2px_#aaa] rounded`}>
                            {search.map((s) => (
                                <li key={s.orderdetailid}
                                    onMouseDown={() => {
                                        if (!newDeliveryList.includes(s)) {
                                            setNewDeliveryList([...newDeliveryList, s])
                                        }
                                    }}
                                    className='flex justify-between p-2 hover:bg-[#eee] cursor-pointer'
                                >
                                    <span>{s.name}</span>
                                    <span>{s.remain} kg</span>
                                </li>
                            ))}
                        </ul>
                    </div>}
            </div>
            <table className='products w-full text-[13px]'>
                <thead>
                    <tr>
                        <th className='border-[1px] border-black'>STT</th>
                        <th className='border-[1px] border-black'>Mã hàng</th>
                        <th className='border-[1px] border-black'>Đơn trọng</th>
                        <th className='border-[1px] border-black'>Dài</th>
                        <th className='border-[1px] border-black'>Tổng số lượng</th>
                        {(user.roleid == 4 || currentDeliveryDetail !== null) &&
                            <th className='border-[1px] border-black'>Tổng số lượng thực tế</th>
                        }
                        <th className='border-[1px] border-black'>Tổng khối lượng (kg)</th>
                        {(user.roleid == 4 || currentDeliveryDetail !== null) &&
                            <th className='border-[1px] border-black'>Tổng khối lượng thực tế (kg)</th>
                        }
                        <th className='border-[1px] border-black w-[10%]'>Ghi chú</th>
                        {!currentDelivery && <th className='border-[1px] border-black'>Xóa</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentDeliveryDetail ? currentDeliveryDetail.deliveryDetail.map((d, index) => (
                        <tr key={index}>
                            <td className='border-[1px] border-black text-center'>{index + 1}</td>
                            <td className='border-[1px] border-black text-center'>{d.name}</td>
                            <td className='border-[1px] border-black text-center'>{d.weightperbar.toFixed(2)}</td>
                            <td className='border-[1px] border-black text-center'>{d.length}</td>

                            <td className='border-[1px] border-black text-center'>
                                {d.numberofbars}
                            </td>
                            <td className='border-[1px] border-black text-center'>
                                {(user.roleid === 4 && currentDelivery.deliverystatus === '4') ? (
                                    <input
                                        onChange={(e) => { setRealBar(e.target.value) }}
                                        min={1}
                                        required
                                        value={realBar}
                                        type="number" placeholder='...'
                                        className='w-[60px] text-center'
                                    />
                                ) : d.realnumberofbars}
                            </td>
                            <td className='border-[1px] border-black text-center'>
                                {d.totalweight.toFixed(2)}
                            </td>
                            <td className='border-[1px] border-black text-center'>
                                {d.realtotalweight && d.realtotalweight.toFixed(2)}
                            </td>
                            <td className='border-[1px] border-black text-center'>
                                {d.note}
                            </td>
                        </tr>
                    )) : (
                        newDeliveryList.map((d, index) =>
                            <tr key={index}>
                                <td className='border-[1px] border-black text-center'>{index + 1}</td>
                                <td className='border-[1px] border-black text-center'>{d.name}</td>
                                <td className='border-[1px] border-black text-center'>{d.weightperbar.toFixed(2)}</td>
                                <td className='border-[1px] border-black text-center'>{d.length}</td>

                                <td className='total-bar border-[1px] border-black text-center'>
                                    <input
                                        onChange={(e) => {
                                            setNewDeliveryList([...newDeliveryList].map((d, i) => i === index ?
                                                { ...d, numberofbars: e.target.value, totalweight: (e.target.value * d.weightperbar).toFixed(2) } : d));
                                            if ((e.target.value * d.weightperbar) > d.remain) {
                                                setError('Khối lượng vượt quá khối lượng trong đơn.');
                                            } else {
                                                setError();
                                            }
                                        }}
                                        min={1}
                                        required
                                        value={newDeliveryList[index].numberofbars}
                                        type="number" placeholder='...'
                                        className='w-[60px] text-center'
                                    />
                                </td>
                                {user.roleid == 4 &&
                                    <td className='real-total-bar border-[1px] border-black text-center'>
                                        <input
                                            onChange={(e) => {
                                                setNewDeliveryList([...newDeliveryList].map((d, i) => i === index ? { ...d, realnumberofbars: e.target.value } : d));
                                            }}
                                            required
                                            min={1}
                                            value={newDeliveryList[index].realnumberofbars}
                                            type="number" className='w-[100%] text-center' placeholder="..."
                                        />
                                    </td>
                                }

                                <td className='total-weight border-[1px] border-black text-center'>
                                    <input
                                        onChange={(e) => {
                                            setNewDeliveryList([...newDeliveryList].map((d, i) => i === index ? { ...d, totalweight: e.target.value } : d));
                                            if (e.target.value > d.remain) {
                                                setError('Khối lượng vượt quá khối lượng trong đơn.');
                                            } else {
                                                setError();
                                            }
                                        }}
                                        required
                                        min={0.01} step={"any"}
                                        value={newDeliveryList[index].totalweight}
                                        type="number" placeholder='...'
                                        className='w-[60px] text-center'
                                    />
                                </td>
                                {user.roleid === 4 &&
                                    <td className='real-total-weight border-[1px] border-black text-center'>
                                        <input
                                            onChange={(e) => {
                                                setNewDeliveryList([...newDeliveryList].map((d, i) => i === index ? { ...d, realtotalweight: e.target.value } : d));
                                            }}
                                            min={0.01} step={"any"}
                                            required
                                            value={newDeliveryList[index].realtotalweight}
                                            type="number" placeholder='...'
                                            className='w-[60px] text-center'
                                        />
                                    </td>
                                }
                                <td className='border-[1px] border-black text-center'>
                                    <input type="text" className='w-[60px] text-center' />
                                </td>
                                <td className='border-[1px] border-black text-center'>
                                    <FontAwesomeIcon
                                        onClick={() => {
                                            const afterdelete = [...newDeliveryList];
                                            afterdelete.splice(index, 1);
                                            setNewDeliveryList(afterdelete);
                                        }}
                                        icon={faRemove} className='text-red-600 hover:cursor-pointer' title='Xóa'
                                    />
                                </td>
                            </tr>
                        )
                    )}

                    {/* Tổng */}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {currentDeliveryDetail &&
                            <>
                                <td></td>
                                <td></td>
                                <td className='text-center'>Tổng: {currentDeliveryDetail && currentDeliveryDetail.sum.toFixed(2)}kg</td>
                                <td className='text-center'>Tổng: {currentDeliveryDetail && currentDeliveryDetail.realsum}kg</td>
                            </>
                        }
                        {!currentDelivery > 0 &&
                            <>
                                <td className='text-center'>Tổng: {totalQuantity}kg</td>
                                <td className='text-center'>Tổng: {totalWeight.toFixed(2)}kg</td>
                            </>
                        }
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <p className="text-red-700 font-medium text-center my-2">{error}</p>
        </div>
    )
}

export default ProductTable