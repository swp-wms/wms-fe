import { useEffect } from "react";
import { getUser } from "../backendCalls/user";
import ImportHistory from "../components/history/ImportHistory";

const OrderHistory = ({ user, setUser }) => {
  useEffect(() => {
    if (!user) {
      const getData = async () => {
        const response = await getUser();
        if (response.status !== 200) {
          window.location.href = "/dang-nhap";
        }
        const user = response.data;
        setUser(user);
      };
      getData();
    }
  }, []);
  return (
    <section className="absolute mt-[80px] ms-[300px] px-12 z-[-1] w-[calc(100%-300px)] ">
      <ImportHistory />
    </section>
  );
};

export default OrderHistory;
