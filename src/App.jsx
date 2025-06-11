import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ImportOrder from './pages/Import';
import CreateImportOrder from './pages/CreateImportOrder';
import ViewOrder from './pages/OrderForm';

function App() {
  const [user, setUser] = useState();

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home setUser={setUser} user={user} />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path='/quen-mat-khau' element={<ForgotPassword />} />
        <Route path= '/nhap-hang' element={<ImportOrder />} />
        <Route path='/nhap-hang/tao-don-nhap-hang' element={<CreateImportOrder />} /> 
        <Route path= '/nhap-hang/:id' element={<ViewOrder />} />
        <Route path="/tong-quan-kho" element={<Home setUser={setUser} user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
