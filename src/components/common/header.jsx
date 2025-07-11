import { useCallback, useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faBell, faGear, faL } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Notification from "./notification";
import { useSocket } from "../../hook/socket";
import { getAllNotifcations } from "../../backendCalls/notification";

const Header = ({ user, setUser }) => {
  const [path, setPath] = useState("Trang chủ");

  return (
    <section className="flex flex-row w-full">
      <div className="fixed z-10">
        <Sidebar user={user} setUser={setUser} setPath={setPath} />
      </div>

      <div className="w-full z-[11] fixed ps-[300px]">
        <NavBar user={user} data={path} />
        <hr className="opacity-20" />
      </div>
    </section>
  );
};

const NavBar = ({ user, data }) => {
  const { emit, on, off, isConnect } = useSocket(user.roleid);
  const [notifs, setNotifs] = useState([]);

  const [showNotif, setShowNotif] = useState(false);

  // on socket

  const handleNewNotification = useCallback((data) => {
    setNotifs(prev => [...prev, data]);
  }, []);

  useEffect(() => {
    if (!isConnect) {
      console.log('Socket not connected, delaying listener registration.');
      return;
    }

    console.log('Socket connected!');

    on('delivery:new', handleNewNotification);
    on('delivery:approve', handleNewNotification);
    on('delivery:approved', handleNewNotification);
    on('delivery:not_enough_car', handleNewNotification);
    on('delivery:shipping', handleNewNotification);
    on('delivery:cancel', handleNewNotification);
    on('delivery:done', handleNewNotification);

    return () => {
      console.log('Unregistering socket listeners...');
      off('delivery:new', handleNewNotification);
      off('delivery:approve', handleNewNotification);
      off('delivery:approved', handleNewNotification);
      off('delivery:not_enough_car', handleNewNotification);
      off('delivery:shipping', handleNewNotification);
      off('delivery:cancel', handleNewNotification);
      off('delivery:done', handleNewNotification);
    };
  }, [on, off, isConnect, handleNewNotification]);

  useEffect(() => {
    const getData = async () => {
      const response = await getAllNotifcations();
      console.log(response.data);

      setNotifs(response.data);
    }

    getData();
  }, []);

  useEffect(() => {
    if (!isConnect) {
      console.log('not connected yet');
      return;
    }
    else console.log("connected");
  }, [isConnect, on]);

  return (
    <div className="flex flex-row justify-between py-5.5 px-8 bg-[#fafafa]">
      <div className="flex flex-row gap-4 items-center opacity-50">
        <FontAwesomeIcon icon={faDoorOpen} size="lg" />
        <span className=" text-gray-600 py-2 font-medium">{data}</span>
      </div>
      <div className="flex flex-row gap-8 items-center">
        <div onClick={() => setShowNotif(!showNotif)} className="relative cursor-pointer">
          <FontAwesomeIcon icon={faBell} size="lg" />
          <span className="absolute text-[10px] font-bold border-[1.5px] border-white px-1 right-[-9px] top-[-3px] bg-red-700 text-white text-center rounded-full">
            {notifs.length}
          </span>
          {showNotif &&
            <Notification
              notifs={notifs}
              setNotifs={setNotifs}
            />
          }
        </div>
        <FontAwesomeIcon icon={faGear} size="lg" />
        <Link to={"/thong-tin-ca-nhan"} className="flex flex-row rounded-full bg-white shadow-btn p-1.5 w-fit justify-between items-center gap-2">
          <div className="size-8 rounded-full bg-gray-200"></div>
          <span className="px-3 font-medium">{user.username}</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
