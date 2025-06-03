import { createRef, use, useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const [password, setPassword] = useState('');
    const [show1, setShow1] = useState(false);

    const [retype, setRetype] = useState('');
    const [show2, setShow2] = useState(false);

    const [otp, setOtp] = useState({
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: ''
    });

    const handleCheckEmail = (e) => {
        e.preventDefault();
        if (email.endsWith('@gmail.com')) {
            //send request to server: send email to user
            setStep(2);
            setError('');
        } else {
            setError('Email không đúng định dạng!');
        }
    }

    const handleCheckNewPass = (e) => {
        e.preventDefault();
        if(password.length < 8 || password.length > 30) {
            setError('Mật khẩu tối thiểu 8 ký tự. Tối đa 30 ký tự.')
        } else if (!/^(?=.*\d)(?=.*[a-zA-Z]).*$/.test(password)) {
            setError('Mật khẩu phải chứa cả chữ và số.')
        } else if(password!==retype){
            setError('Nhập lại mật khẩu chưa chính xác.')
        } else {
            setError('ok');
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

                    {error && <p className="text-red-700 pb-2">{error}</p>}

                    {step === 1 &&
                        <>
                            <input className="login-input"
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
                                <input className="login-input text-center text-xl font-bold" autoFocus={true} style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, 1: e.target.value })} value={otp[1]} />
                                <input className="login-input text-center text-xl font-bold" style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, 2: e.target.value })} value={otp[2]} />
                                <input className="login-input text-center text-xl font-bold" style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, 3: e.target.value })} value={otp[3]} />
                                <input className="login-input text-center text-xl font-bold" style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, 4: e.target.value })} value={otp[4]} />
                                <input className="login-input text-center text-xl font-bold" style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, 5: e.target.value })} value={otp[5]} />
                                <input className="login-input text-center text-xl font-bold" style={{ width: '15%', padding: '8px 0' }} type="text" maxLength={1} onChange={(e) => setOtp({ ...otp, 6: e.target.value })} value={otp[6]} />
                            </div>
                            <p className="text-xs py-2">Kiểm tra hòm thư của bạn để lấy mã OTP</p>
                            <button className="login-button" onClick={(e) => { e.preventDefault(); setStep(3) }}>
                                XÁC NHẬN
                            </button>
                            <p className="text-xs pt-4">Nếu chưa nhận được email hoặc mã đã hết hạn</p>
                            <button className="login-button" style={{ backgroundColor: 'black' }}>
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