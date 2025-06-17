import React from "react";
import { useEffect } from "react";
import { getUser } from "../backendCalls/user";

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
    return <div></div>
};

export default AdminPage;