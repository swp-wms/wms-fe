import { getSeenNotifcations, handleSeenNotifcation } from "../../backendCalls/notification";
import { useEffect, useState } from "react";
import NotificationList from "./notification/NotificationList";

const Notification = ({ notifs, setNotifs }) => {
  const [notifType, setNotifType] = useState(1);
  const [seenNotif, setSeenNotif] = useState([]);
  const [index, setIndex] = useState(0);

  const getSeenNotifs = async () => {
      const response = await getSeenNotifcations(index);
      setSeenNotif(response.data);
      setIndex(prev => prev + 5);
    }

  useEffect(() => {
    getSeenNotifs();
  }, []);

  const handleSeen = async (id) => {
    if(notifType === 1) {
      await handleSeenNotifcation(id);
    }

    setNotifs(prev => [...prev].filter(n => n.id != id));
  }

  return (
    <div className="Notification animation-grow-down absolute z-[10] left-[-20px] top-[160%] bg-white shadow-[2px_2px_4px_#ddd] rounded-md w-[350px] max-h-[320px] overflow-hidden">
      <p className="font-semibold px-4 py-2">Thông báo</p>

      <div className="mx-4 mb-2" onClick={(e) => e.stopPropagation()}>
        <span onClick={() => setNotifType(1)}
          className={`text-xs hover:bg-[#eee] font-bold p-2 rounded-2xl ${notifType === 1 ? 'text-red-600 bg-red-100' : 'text-[#666]'}`}>
          Chưa đọc
        </span>
        <span onClick={() => setNotifType(2)}
          className={`text-xs hover:bg-[#eee] ml-2 font-bold p-2 rounded-2xl ${notifType === 2 ? 'text-red-600 bg-red-100' : 'text-[#666]'}`}>
          Đã đọc
        </span>
      </div>

      {notifType === 1 && <NotificationList
        notifs={notifs}
        handleSeen={handleSeen}
        notifType={notifType}
      />}

      {notifType === 2 && <NotificationList
        notifs={seenNotif}
        handleSeen={handleSeen}
        notifType={notifType}
        getSeenNotifs={getSeenNotifs}
      />}
    </div>
  )
}

export default Notification