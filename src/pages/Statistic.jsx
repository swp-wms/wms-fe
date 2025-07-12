import React from "react";
import { useEffect } from "react";
import { getUser } from "../backendCalls/user";
import SummaryBoard from "../components/statistic/SummaryBoard";

const Statistic = ({ user, setUser }) => {
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
    <section className="absolute mt-[140px] ms-[20%] px-14 z-[-1] w-[80%]"><SummaryBoard /></section>
  );
};

export default Statistic;
