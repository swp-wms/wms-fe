import { useEffect } from 'react'
import Header from '../components/common/header'
import { getUser } from '../backendCalls/user';
import { api } from '../config/api';
const Home = ({ user, setUser }) => {
  useEffect(() => {
    const getData = async () => {
      const response = await getUser();
      const user = response.data;
      console.log(user);
      if(user.username) {
        setUser(user);
      } 
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