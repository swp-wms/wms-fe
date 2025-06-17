import React from "react";
import { useEffect } from "react";
import { getUser } from "../backendCalls/user";
import AccountManage from "../components/admin/AccountManage";

const AdminPage = ({user, setUser}) => {
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
    return(
        <AccountManage/>
    )
};

export default AdminPage;