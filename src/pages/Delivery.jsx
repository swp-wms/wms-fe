import { useEffect } from "react";
import { getUser } from "../backendCalls/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faFileImport } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


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
    <div className="Delivery text-lg flex gap-4 font-semibold items-center justify-center fixed bottom-0 right-0 top-[80px] left-[20%]">
      <Link to={'/ke-hoach-van-chuyen/nhap'} className="text-center btn px-[40px] py-[60px] rounded">
        <FontAwesomeIcon className="text-3xl mb-4" icon={faFileImport} />
        <p>Kế hoạch nhập kho</p>
      </Link>
      <Link to={'/ke-hoach-van-chuyen/xuat'} className="text-center btn px-[40px] py-[60px] rounded">
        <FontAwesomeIcon className="text-3xl mb-4" icon={faFileExport} />
        <p>Kế hoạch xuất kho</p>
      </Link>
    </div>
  )
}

export default Delivery