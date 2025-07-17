import { useEffect, useState } from "react"
import orderBeCall from '../../backendCalls/order.js'

const OrderPopUp = ({ setShowOrderPopup, currentOrder }) => {
    const [orderDetail, setOrderDetail] = useState();
    const [totalWeight, setTotalWeight] = useState();

    useEffect(() => {
        const getData = async () => {
            const response = await orderBeCall.getOrderDetail(currentOrder.orderid);
            const productList = response[0].orderdetail;
            setOrderDetail(productList);
            let sum = 0;
            for (let index = 0; index < productList.length; index++) {
                sum += productList[index].weight;
            }
            setTotalWeight(sum);
        }
        getData();
    }, []);

    return (
        <div className="fixed ml-[18%] z-10 bg-[#0f0b0b78] bottom-0 right-0 left-0 top-0 flex items-center justify-center"
            onClick={() => { setShowOrderPopup(false) }}
        >
            <div className="bg-white p-5 rounded">
                <h1 className="font-bold uppercase text-center mb-3 text-lg">{window.location.pathname.split('/')[2] === 'nhap' ? 'Đơn nhập hàng':'Đơn xuất hàng'}</h1>
                <div className="font-semibold flex justify-between mb-3">
                    <h1 className="max-w-[75%]">Công ty: {currentOrder.partnername}</h1>
                    <h1>Mã đơn: {currentOrder.orderid}</h1>
                </div>
                <table className="bg-white" onClick={(e) => e.stopPropagation()}>
                    <thead>
                        <tr>
                            <th className="border-[1px] border-black p-2">STT</th>
                            <th className="border-[1px] border-black p-2">Mã hàng</th>
                            <th className="border-[1px] border-black p-2">Tên hàng hóa</th>
                            <th className="border-[1px] border-black p-2">Dài</th>
                            <th className="border-[1px] border-black p-2">Số lượng</th>
                            <th className="border-[1px] border-black p-2">Khối lượng</th>
                            <th className="border-[1px] border-black p-2">Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetail && orderDetail.map((od, index) => (
                            <tr key={index}>
                                <td className="border-[1px] border-black p-2">{index + 1}</td>
                                <td className="border-[1px] border-black p-2">{od.product.name}</td>
                                <td className="border-[1px] border-black p-2">{od.product.namedetail}</td>
                                <td className="border-[1px] border-black p-2">{od.product.catalog.length}</td>
                                <td className="border-[1px] border-black p-2">{od.numberofbars}</td>
                                <td className="border-[1px] border-black p-2">{od.weight}</td>
                                <td className="border-[1px] border-black p-2">{od.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="font-bold text-sm float-end mt-2">Tổng khối lượng: {totalWeight && totalWeight.toFixed(2)} kg</p>
            </div>
        </div>
    )
}

export default OrderPopUp