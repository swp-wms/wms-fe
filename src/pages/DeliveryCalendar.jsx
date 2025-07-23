import { useState, useEffect } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getUser } from '../backendCalls/user';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/vi';
import { getAllDelivery } from '../backendCalls/delivery';
import { deliveryStatus } from '../data/deliveryStatus';
import { useNavigate } from 'react-router-dom';

moment.locale('vi');
const localizer = momentLocalizer(moment);

const messages = {
    today: 'Hôm nay',
    previous: 'Trước',
    next: 'Sau',
    month: 'Tháng',
    week: 'Tuần',
    day: 'Ngày',
    agenda: 'Lịch trình',
    date: 'Ngày',
    time: 'Giờ',
    event: 'Sự kiện',
    noEventsInRange: 'Không có sự kiện',
};

const eventStyleGetter = (event) => {
    let backgroundColor = event.order.type === "I" ? '#28a745' : '#ffc107';
    return {
        style: {
            backgroundColor,
            color: 'white',
            borderRadius: '4px',
            padding: '4px',
            border: 'none'
        }
    };
};

const CustomEvent = ({ event }) => {
    const statusColor = deliveryStatus

    const dotColor = (statusColor.find(c => c.id === event.deliverystatus)).color;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: dotColor === 'transparent' ? "white" : dotColor,
                    display: 'inline-block',
                    boxShadow: '0 0 2px black'
                }}
            />
            <span>{`Đơn ${event.order.id} - ${event.order.partnerid}`}</span>
        </div>
    );
};


const DeliveryCalendar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');
    const [deliverySchedule, setDeliverySchedule] = useState([]);

    const handleGetDeliverySchedule = async () => {
        const response = await getAllDelivery();
        const schedule = (response.data).map((item) => {

            const start = moment(`${item.getdate}T${item.gettime || "00:00:00"}`, "YYYY-MM-DDTHH:mm:ss");
            const end = moment(`${item.deliverydate}T${item.deliverytime || "00:00:00"}`, "YYYY-MM-DDTHH:mm:ss");

            return {
                ...item, start: new Date(start), end: new Date(end)
            }
        });
        console.log(schedule);


        setDeliverySchedule(schedule);
    }

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
        handleGetDeliverySchedule();
    }, []);

    return (
        <div className="fixed bottom-0 right-0 top-[90px] left-[300px] p-8 z-50 bg-white overflow-scroll">
            <Calendar
                events={deliverySchedule}
                localizer={localizer}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                view={currentView}
                onView={(view) => setCurrentView(view)}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 550 }}
                timeslots={4}
                selectable
                step={15}
                // titleAccessor={(event) => `${event.order.id} - ${event.order.partnerid}`}
                messages={messages}
                eventPropGetter={eventStyleGetter}
                tooltipAccessor={(event) =>
                    `\nLoại đơn: ${event.order.type === 'I' ? "Nhập" : "Xuất"}\n` +
                    `Trạng thái: ${(deliveryStatus.find(s => s.id === event.deliverystatus)).name}\n` +
                    `Lái xe: ${event.drivername || 'Chưa gán'} - ${event.driverphonenumber || 'Chưa gán'}\n`
                }
                components={{event: CustomEvent}}
                onSelectEvent={(event) => navigate(`/ke-hoach-van-chuyen/${event.order.type === 'I' ? 'nhap' : 'xuat'}/${event.orderid}/${event.id}`)}
            />
        </div>
    );
}

export default DeliveryCalendar;
