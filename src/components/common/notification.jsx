import moment from "moment/moment";
import { Link } from "react-router-dom"
import { handleSeenNotifcation } from "../../backendCalls/notification";

const Notification = ({ notifs, setNotifs }) => {

  const handleSeen = async (id) => {
    // delete notif in database
    await handleSeenNotifcation(id);
    console.log('delete');

    setNotifs(prev => [...prev].filter(n => n.id != id));
  }

  return (
    <div className="Notification animation-grow-down absolute z-[10] left-[-20px] top-[160%] bg-white shadow-[2px_2px_4px_#ddd] rounded-md w-[350px] max-h-[320px] overflow-hidden">
      <p className="font-semibold px-4 py-2">Thông báo</p>

      <ul className="pb-2 px-2 text-[15px] overflow-y-scroll max-h-[280px]">
        {notifs.length > 0 ? notifs.map((notif, index) => (
          <div key={index} onClick={(e) => handleSeen(notif.id)} className="flex gap-3 justify-between items-start hover:bg-[#f9f9f9] hover:duration-100 cursor-pointer p-2 rounded-md">
            <Link to={'/ke-hoach-van-chuyen'} className="block">
              <p>{notif.message}</p>
              <p className="text-xs text-[#999]">{moment(notif.created_at).startOf('minute').fromNow()}</p>
            </Link>
            <button onClick={(e) => { e.stopPropagation(), handleSeen(notif.id) }} className="text-[10px] font-semibold text-[#666] btn w-fit p-1" title="Đánh dấu đã xem." >Seen</button>
          </div>
        )) : (
          <p className="p-2 text-gray-400">Không có thông báo mới.</p>
        )}

      </ul>
    </div>
  )
}

export default Notification