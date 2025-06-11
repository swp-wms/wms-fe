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
    <>
      {user && <Header user={user} />}
    </>
  )
}

export default Home