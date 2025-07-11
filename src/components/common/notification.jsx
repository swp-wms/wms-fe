import moment from "moment/moment";
import { useEffect } from "react"
import { Link } from "react-router-dom"

const Notification = ({ notifs, setNotifs }) => {

  return (
    <div className="Notification animation-grow-down absolute z-[10] left-[-20px] top-[160%] bg-white shadow-[2px_2px_4px_#ddd] rounded-md w-[350px] max-h-[320px] overflow-hidden">
      <p className="font-semibold px-4 py-2">Thông báo</p>

      <ul className="pb-2 px-2 text-[15px] overflow-y-scroll max-h-[280px]">
        {notifs.length > 0 ? notifs.map((notif, index) => (
          <Link key={index} to={'/ke-hoach-van-chuyen'} className="block p-2 hover:bg-[#f9f9f9] hover:duration-100 cursor-pointer rounded-md">
            <p>{notif.message}</p>
            <p className="text-xs text-[#999]">{moment(notif.created_at).startOf('minute').fromNow()}</p>
          </Link>
        )) : (
          <p className="p-2 text-gray-400">Không có thông báo mới.</p>
        )}

      </ul>
    </div>
  )
}

export default Notification