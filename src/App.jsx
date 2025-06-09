import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ImportOrder from './pages/Import';
import CreateimportOrder from './pages/CreateImportOrder';
import ViewOrder from './pages/OrderForm';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path='/quen-mat-khau' element={<ForgotPassword />} />
        <Route path= '/nhap-hang' element={<ImportOrder />} />
        <Route path='/nhap-hang/tao-don-nhap-hang' element={<CreateimportOrder />} /> 
        <Route path= '/nhap-hang/xem-don' element={<ViewOrder />} />
      </Routes>
    </div>
  );
}

export default App;
