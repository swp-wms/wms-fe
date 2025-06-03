import { useState } from "react"


const Login = () => {
  const [username, setUsername] = useState('');
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handlePasswordChange = (prop) => (event) => {
    setValues({
      ...values,
      [prop]: event.target.value,
    });
  };

  return (
    <div className="Login min-h-screen min-w-screen font-medium"
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
              values.showPassword
                ? "text"
                : "password"
            }
            onChange={handlePasswordChange("password")}
            value={values.password}
          />

          <div className="text-[#e18479] text-xs flex justify-between w-[100%] my-2">
            <div className="flex gap-1 accent-[#e18479]">
              <input type="checkbox"
                onClick={
                  handleClickShowPassword
                }
              />
              <span>Hiện mật khẩu</span>
            </div>
            <a href="/quen-mat-khau" className="hover:underline">Quên mật khẩu</a>
          </div>
          <button className="login-button">ĐĂNG NHẬP</button>
        </form>
      </div>
    </div>
  )
}

export default Login