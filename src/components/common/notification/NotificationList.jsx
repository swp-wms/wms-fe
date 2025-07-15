import moment from "moment/moment";
import { Link } from "react-router-dom"

const NotificationList = ({ notifs, handleSeen, notifType, getSeenNotifs }) => {
    return (
        <div className="NotificationList">
            <ul className="pb-2 px-2 text-[15px] overflow-y-scroll max-h-[280px]">
                {notifs.length > 0 ? notifs.map((notif, index) => (
                    <div key={index} onClick={(e) => handleSeen(notif.id)} className="flex gap-3 justify-between items-start hover:bg-[#f9f9f9] hover:duration-100 cursor-pointer p-2 rounded-md">
                        <Link to={notif.url} className="block">
                            <p>{notif.message}</p>
                            <p className="text-xs text-[#999]">{moment(notif.created_at).startOf('minute').fromNow()}</p>
                        </Link>
                        {notifType === 1 && <button onClick={(e) => { e.stopPropagation(), handleSeen(notif.id) }} className="text-[10px] font-semibold text-[#666] btn w-fit p-1" title="Đánh dấu đã xem." >Seen</button>}
                    </div>
                )) : (
                    <p className="p-2 text-gray-400">Không có thông báo.</p>
                )}

            </ul>

            {notifType === 2 && notifs.length === 5 &&
                <div className="p-2">
                    <button onClick={getSeenNotifs} className="btn w-full py-1 text-sm font-bold text-[#666]">Xem thêm</button>
                </div>}
        </div>
    )
}

export default NotificationList