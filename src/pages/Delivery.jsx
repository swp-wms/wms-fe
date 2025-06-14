import { useEffect } from "react";
import OrderList from "../components/delivery/OrderList"
import DeliveryList from "../components/delivery/DeliveryList"
import { getUser } from "../backendCalls/user";
import DeliveryForm from "../components/delivery/DeliveryForm";


const Delivery = ({ user, setUser }) => {
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
    <div className="Delivery fixed bottom-0 right-0 top-[80px] left-[20%]">
      <div className="w-full h-5/6 p-[20px] flex">
        <div className="flex-1 h-full">
          <h1 className="font-medium mb-2">Đơn nhập hàng</h1>
          <OrderList />
        </div>
        {/* table */}
        <div className="flex-2 h-full ml-4">
          <div className="flex justify-between">
            <h1 className="font-medium mb-2">Thêm xe</h1>
            <h1 className="font-medium mb-2">ABC Company</h1>
          </div>
          <DeliveryForm />
        </div>
      </div>

      <div className="w-full h-1/6">
        <DeliveryList />
      </div>
    </div>
  )
}

export default Delivery