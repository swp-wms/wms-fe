import { useEffect, useState } from "react";
import OrderList from "../components/delivery/OrderList"
import DeliveryList from "../components/delivery/DeliveryList"
import { getUser } from "../backendCalls/user";
import DeliveryForm from "../components/delivery/DeliveryForm";
import { useParams } from "react-router-dom";
import { getAllExportDelivery, getAllImportDelivery, getDeliveriesForOrder, getDeliveryDetail } from "../backendCalls/delivery";


const DeliverySchedule = ({ user, setUser }) => {
  const { act, orderId, deliveryId } = useParams();

  const [orders, setOrders] = useState(); //list big order. load 1 time
  const [currentOrder, setCurrentOrder] = useState(); //hit 1 order, then load
  const [deliverySchedule, setDeliverySchedule] = useState([]);
  const [currentDelivery, setCurrentDelivery] = useState();
  const [currentDeliveryDetail, setCurrentDeliveryDetail] = useState();
  const [isChangePercent, setIsChangePercent] = useState(false);

  // const [isCreate, setIsCreate]

  useEffect(() => {
    const getData = async () => {
      if (currentDelivery) {
        const response = await getDeliveryDetail(currentDelivery.id);
        setCurrentDeliveryDetail(response.data);
      }
    }

    getData();
  }, [currentDelivery, setCurrentDelivery])

  const getOrderList = async () => {
    console.log('run');

    if (act === 'nhap') {
      const response = await getAllImportDelivery();
      const orderList = response.data;
      setOrders(orderList);

      if (orderId) {
        setCurrentOrder(orderList.find((a) => a.orderid == orderId));
      }
    } else if (act === 'xuat') {
      const response = await getAllExportDelivery();
      const orderList = response.data;
      setOrders(orderList);

      if (orderId) {
        setCurrentOrder(orderList.find((a) => a.orderid == orderId));
      }
    }
    getDeliveryList();
  }

  const getDeliveryList = async () => { //if the url have orderId and deliveryId
    if (orderId && deliveryId) {
      // load delivery schedule for order
      const response = (await getDeliveriesForOrder(orderId)).data;
      console.log(response);

      setDeliverySchedule(response.length > 0 ? response.sort((a, b) => new Date(b.deliverydate) - new Date(a.deliverydate)) : []);
      setCurrentDelivery(response.find((a) => a.id == deliveryId));
    }
  }

  useEffect(() => {
    getOrderList();
  }, [isChangePercent, setIsChangePercent, orderId, deliveryId]);

  useEffect(() => {
    if (!user || !user.roleid) {
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
    <>
      {user && <div className="DeliverySchedule fixed bottom-0 right-0 top-[80px] left-[23%]">
        <div className="w-full h-5/6 p-[20px] flex">
          <div className="flex-1 h-full">
            <h1 className="font-medium mb-2">Đơn {act === 'nhap' ? 'nhập' : 'xuất'} hàng</h1>
            {orders && <OrderList
              setDeliverySchedule={setDeliverySchedule}
              orders={orders}
              setCurrentDelivery={setCurrentDelivery}
              setCurrentDeliveryDetail={setCurrentDeliveryDetail}
              setCurrentOrder={setCurrentOrder}

              user={user}
            />}
          </div>
          {/* table */}
          <div className="flex-2 h-full ml-4">
            <div className="flex justify-between">
              {!currentDelivery && <h1 className="font-medium mb-2">Thêm xe</h1>}
              {currentOrder && <h1 className="font-medium mb-2">{currentOrder.partnername}</h1>}
            </div>

            {currentOrder ? <DeliveryForm
              setIsChangePercent={setIsChangePercent}
              currentOrder={currentOrder}
              currentDelivery={currentDelivery}
              setCurrentDelivery={setCurrentDelivery}
              currentDeliveryDetail={currentDeliveryDetail}
              setCurrentDeliveryDetail={setCurrentDeliveryDetail}
              setDeliverySchedule={setDeliverySchedule}
              deliverySchedule={deliverySchedule}
              user={user}
              setUser={setUser}
              act={act}
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
      </div>}
    </>
  )
}

export default DeliverySchedule