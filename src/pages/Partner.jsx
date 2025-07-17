import React from "react";
import { useEffect } from "react";
import { getUser } from "../backendCalls/user";
import PartnerManagement from "../components/partner/PartnerManagement";

const Partner = ({user, setUser}) => {
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
        // <h1>Hello</h1>
        <PartnerManagement/>
    )
};

export default Partner;