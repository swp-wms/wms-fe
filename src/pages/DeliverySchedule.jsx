import { useEffect, useState } from "react";
import OrderList from "../components/delivery/OrderList"
import DeliveryList from "../components/delivery/DeliveryList"
import { getUser } from "../backendCalls/user";
import DeliveryForm from "../components/delivery/DeliveryForm";
import { useParams } from "react-router-dom";
import { getAllImportDelivery, getDeliveriesForOrder, getDeliveryDetail } from "../backendCalls/delivery";


const DeliverySchedule = ({ user, setUser }) => {
  const { act } = useParams();

  const [orders, setOrders] = useState();
  const [currentOrder, setCurrentOrder] = useState();
  const [deliverySchedule, setDeliverySchedule] = useState([]);
  const [currentDelivery, setCurrentDelivery] = useState();
  const [currentDeliveryDetail, setCurrentDeliveryDetail] = useState();

  useEffect(() => {
    const getData = async () => {
      if (currentOrder) {
        const response = (await getDeliveriesForOrder(currentOrder.orderid)).data;
        setDeliverySchedule(response.sort((a, b) => new Date(a.deliverydate) - new Date(b.deliverydate)));        
      }
    }

    getData();
  }, [currentOrder, setCurrentOrder])

  useEffect(() => {
    const getData = async () => {
      if (currentDelivery) {        
        const response = await getDeliveryDetail(currentDelivery.id);
        setCurrentDeliveryDetail(response.data);      
      }
    }

    getData();
  }, [currentDelivery, setCurrentDelivery])

  useEffect(() => {
    const getData = async () => {
      if (act === 'nhap') {
        const response = await getAllImportDelivery();
        setOrders(response.data);
      } else if (act === 'xuat') {
        const response = await getAllExportDelivery();
        setOrders(response.data);
      }
    }

    getData();
  }, []);

  useEffect(() => {
    if (!user) {
      const getData = async () => {
        const response = await getUser();
        if (response.status !== 200) {
          window.location.href = '/dang-nhap';
        }
        const user = response.data;
        setUser(user);
      }
      getData();
    }
  }, []);

  return (
    <div className="DeliverySchedule fixed bottom-0 right-0 top-[80px] left-[23%]">
      <div className="w-full h-5/6 p-[20px] flex">
        <div className="flex-1 h-full">
          <h1 className="font-medium mb-2">Đơn hàng</h1>
          {orders && <OrderList
            orders={orders} setOrders={setOrders}
            currentOrder={currentOrder}
            setCurrentOrder={setCurrentOrder}
          />}
        </div>
        {/* table */}
        <div className="flex-2 h-full ml-4">
          <div className="flex justify-between">
            {!currentDelivery && <h1 className="font-medium mb-2">Thêm xe</h1>}
            {currentOrder && <h1 className="font-medium mb-2">{currentOrder.partnername}</h1>}
          </div>

          {currentOrder ? <DeliveryForm
            currentOrder={currentOrder}
            currentDelivery={currentDelivery}
            currentDeliveryDetail={currentDeliveryDetail}
            setCurrentDeliveryDetail={setCurrentDeliveryDetail}
            user={user}
          /> : (
            <div className="h-[90%] bg-white flex items-center justify-center text-[#999] rounded">
              <h1 className="font-medium">Chưa đơn hàng nào được chọn.</h1>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-1/6">
        {currentOrder && <DeliveryList
          user={user}
          currentOrder={currentOrder}
          deliverySchedule={deliverySchedule}
          setDeliverySchedule={setDeliverySchedule}
          currentDelivery={currentDelivery}
          setCurrentDelivery={setCurrentDelivery}
          setCurrentDeliveryDetail={setCurrentDeliveryDetail}
        />}
      </div>
    </div>
  )
}

export default DeliverySchedule