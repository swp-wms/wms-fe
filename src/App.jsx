import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ImportOrder from './pages/Import';
import ExportOrder from './pages/Export';
import CreateImportOrder from './pages/CreateImportOrder';
import CreateExportOrder from './pages/CreateExportOrder';
import ViewOrder from './pages/OrderForm';
import Header from './components/common/header';

function App() {
  const [user, setUser] = useState();

  return (
    <div>
      
      <Routes>
        
        <Route path="/" element={<Home setUser={setUser} user={user} />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path='/quen-mat-khau' element={<ForgotPassword />} />
        <Route path='/nhap-hang' element={<ImportOrder />} />
        <Route path='/xuat-hang' element={<ExportOrder />} />
        <Route path='/nhap-hang/tao-don-nhap-hang' element={<CreateImportOrder />} />
        <Route path='/xuat-hang/tao-don-xuat-hang' element={<CreateExportOrder />} />

        <Route path= '/nhap-hang/:id' element={<ViewOrder />} />
        <Route path= '/xuat-hang/:id' element={<ViewOrder />} />
        <Route path="/tong-quan-kho" element={<Home setUser={setUser} user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
