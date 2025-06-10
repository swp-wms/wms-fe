import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const [user, setUser] = useState();

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home setUser={setUser} user={user} />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path='/quen-mat-khau' element={<ForgotPassword />} />
        <Route path="/tong-quan-kho" element={<Home setUser={setUser} user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
