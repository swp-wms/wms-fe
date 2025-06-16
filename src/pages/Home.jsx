import { useEffect } from 'react'
import Header from '../components/common/header'
import { getUser } from '../backendCalls/user';
const Home = ({ user, setUser }) => {
  useEffect(() => {
    const getData = async () => {
      const response = await getUser();
      if (response.status!==200) {
        window.location.href = '/dang-nhap';
      }
      const user = response.data;
      setUser(user);
    }
    getData();
  }, []);

  return (
    <div className='fixed left-[25%] text-center flex flex-col items-center justify-center scale-60'>
      <img src="/home.png"/>
      <span className='text-4xl font-bold opacity-50 mt-16'>Chào mừng đến với Hệ thống Quản lý Kho hàng Thép Đất Việt</span>
    </div>
  )
}

export default Home