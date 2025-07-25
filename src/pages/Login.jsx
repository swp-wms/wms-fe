import { useState } from "react"
import { handleLogin } from "../backendCalls/user";
import toast from "react-hot-toast";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    const id = toast.loading('Đang đăng nhập... Vui lòng chỉ bấm 1 lần!');
    const response = await handleLogin(username, password);
    if (response.status !== 200) {
      toast.dismiss(id);
      toast.error(response.response.data.message);
    } else {
      toast.dismiss(id);
      window.location.href = '/';
    }
  }

  return (
    <div className="Login fixed top-0 bottom-0 left-0 right-0 font-medium"
      style={{ backgroundImage: 'linear-gradient(to bottom, #b5070e, black)' }} >
      <div className="min-h-screen min-w-screen bg-[url('./image-removebg-preview.png')] bg-cover bg-no-repeat bg-center opacity-40"></div>

      <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
        <form className="bg-white p-8 rounded-md w-[360px] flex flex-col items-center">
          <img className="mb-4" src="/logo.png" width={'160px'} alt="logo" />

          <input className="login-input bg-[#fae5e2] placeholder:text-[#e18479]"
            type="text"
            placeholder="Tên đăng nhập"
            onChange={(e) => {
              setUsername(e.target.value)
            }}
            value={username}
          />
          <input className="login-input bg-[#fae5e2] placeholder:text-[#e18479]"
            type={
              show
                ? "text"
                : "password"
            }
            placeholder="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <div className="text-[#e18479] text-xs flex justify-between w-[100%] my-2">
            <div className="flex gap-1 accent-[#e18479]">
              <input type="checkbox"
                onClick={() => setShow(!show)}
              />
              <span>Hiện mật khẩu</span>
            </div>
            <a href="/quen-mat-khau" className="hover:underline">Quên mật khẩu</a>
          </div>
          <button onClick={login} className="login-button">ĐĂNG NHẬP</button>
        </form>
      </div>
    </div>
  )
}

export default Login