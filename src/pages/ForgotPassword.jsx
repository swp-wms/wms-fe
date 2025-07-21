import axios from "axios";
import { useState } from "react";
import { api } from "../config/api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);

    const [password, setPassword] = useState('');
    const [show1, setShow1] = useState(false);

    const [retype, setRetype] = useState('');
    const [show2, setShow2] = useState(false);

    const [otp, setOtp] = useState({
        first: '',
        second: '',
        third: '',
        forth: '',
        fifth: '',
        sixth: ''
    });

    const handleCheckEmail = async (e) => {
        e.preventDefault();
        if (document.querySelector('.email-field').checkValidity()) {
            
            try {
                await axios.post(api.GET_OTP, {
                    email: email
                });
                setStep(2);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            toast.error('Email không đúng định dạng!');
        }
    }

    const handleCheckOtp = async (e) => {
        e.preventDefault();

        const otpString = otp.first + otp.second + otp.third + otp.forth + otp.fifth + otp.sixth;

        if (!/^\d{6}$/.test(otpString)) {
            toast.error('OTP không chính xác.');
            return;
        }

        try {
            await axios.post(api.VERIFY_OTP, {
                otp: otpString,
                email: email
            });
            setStep(3);
            toast.success('OTP chính xác')
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const handleCheckNewPass = async (e) => {
        e.preventDefault();
        if (password.length < 8 || password.length > 30) {
            toast.error('Mật khẩu tối thiểu 8 ký tự. Tối đa 30 ký tự.')
        } else if (!/^[a-zA-Z0-9]{8,30}$/.test(password)) {
            toast.error('Mật khẩu chứa chữ và số.')
        } else if (password !== retype) {
            toast.error('Nhập lại mật khẩu chưa chính xác.')
        } else {
            await axios.post(api.RESET_PASSWORD, {
                password: password,
                email: email
            });
            toast.success('Đổi mật khẩu thành công.');
            window.location.href = '/dang-nhap';
        }
    }

    return (
        <div className='ForgotPassword min-h-screen flex items-center'>
            <div className="bg-white h-[80vh] w-screen flex items-center justify-center"
                style={{ boxShadow: '0 0 10px #c1bfbf' }}
            >
                <form className="bg-white p-8 rounded-md w-[360px] flex flex-col items-center"
                    style={{ boxShadow: '0 0 5px #c1bfbf' }}>
                    <img className="mb-4" src="/logo.png" width={'160px'} alt="logo" />

                    {step === 1 &&
                        <>
                            <input className="email-field login-input"
                                type="email" required
                                placeholder="Email"
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                value={email}
                            />

                            <ul className="text-[#00000080] text-xs w-[100%] my-2">
                                <li>Email phải là email đã đăng ký với công ty</li>
                                <li>Mã OTP để reset mật khẩu sẽ được gửi vào email này</li>
                            </ul>
                            <button onClick={(e) => handleCheckEmail(e)} className="login-button">
                                XÁC NHẬN
                            </button>
                        </>
                    }
                    {step === 2 &&
                        <>
                            <div className="flex justify-between">
                                <input className="login-input text-center text-xl font-bold" autoFocus={true} style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, first: e.target.value })} value={otp.first} />
                                <input className="login-input text-center text-xl font-bold" style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, second: e.target.value })} value={otp.second} />
                                <input className="login-input text-center text-xl font-bold" style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, third: e.target.value })} value={otp.third} />
                                <input className="login-input text-center text-xl font-bold" style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, forth: e.target.value })} value={otp.forth} />
                                <input className="login-input text-center text-xl font-bold" style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, fifth: e.target.value })} value={otp.fifth} />
                                <input className="login-input text-center text-xl font-bold" style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, sixth: e.target.value })} value={otp.sixth} />
                            </div>
                            <p className="text-xs py-2">Kiểm tra hòm thư của bạn để lấy mã OTP</p>
                            <button type="submit" className="login-button" onClick={(e) => { handleCheckOtp(e) }}>
                                XÁC NHẬN
                            </button>
                            <p className="text-xs pt-4">Nếu chưa nhận được email hoặc mã đã hết hạn</p>
                            <button type="button" className="login-button" onClick={(e) => {
                                handleCheckEmail(e);
                                setOtp({
                                    first: '',
                                    second: '',
                                    third: '',
                                    forth: '',
                                    fifth: '',
                                    sixth: ''
                                });
                            }} style={{ backgroundColor: 'black' }}>
                                GỬI LẠI OTP
                            </button>
                        </>
                    }

                    {step === 3 &&
                        <>
                            <input type={show1 ? "text" : "password"}
                                className="login-input"
                                placeholder="Mật khẩu mới"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <div className="flex gap-1 text-xs w-full opacity-50 accent-[#e18479]">
                                <input type="checkbox"
                                    onClick={() => setShow1(!show1)}
                                />
                                <span>Hiện mật khẩu</span>
                            </div>
                            <p className="text-xs py-2">Mật khẩu phải bao gồm cả chữ và số. Tối thiểu 8 ký tự. Tối đa 30 ký tự.</p>

                            <input type={show2 ? "text" : "password"}
                                className="login-input"
                                placeholder="Nhập lại mật khẩu mới"
                                onChange={(e) => setRetype(e.target.value)}
                                value={retype}
                            />
                            <div className="flex gap-1 text-xs w-full opacity-50 accent-[#e18479]">
                                <input type="checkbox"
                                    onClick={() => setShow2(!show2)}
                                />
                                <span>Hiện mật khẩu</span>
                            </div>
                            <button onClick={(e) => handleCheckNewPass(e)} className="login-button" style={{ marginTop: '20px' }}>
                                XÁC NHẬN
                            </button>
                        </>
                    }
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword