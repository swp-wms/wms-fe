import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ImportOrder from "./pages/Import";
import ExportOrder from "./pages/Export";
import CreateImportOrder from "./pages/CreateImportOrder";
import CreateExportOrder from "./pages/CreateExportOrder";
import ViewOrder from "./pages/OrderForm";
import EditOrder from "./pages/EditOrder";
import Header from "./components/common/header";

import FormTemplate from "./components/order/partnerForm";

import Delivery from "./pages/Delivery";
import OverviewPage from "./pages/OverviewPage";
import Statistic from "./pages/Statistic";
import DeliverySchedule from "./pages/DeliverySchedule";
import Profile from "./pages/Profile";
import AdminPage from "./pages/AdminPage";

import Error404 from "./pages/Error-404";
import Error403 from "./pages/Error-403";


function App() {
  const [user, setUser] = useState();

  return (
    <div>
      {user && <Header user={user} setUser={setUser} />}
      <Routes>
        
        <Route path="/" element={<Home setUser={setUser} user={user} />} />
        <Route path="/dang-nhap" element={<Login />} />

        <Route path="/quen-mat-khau" element={<ForgotPassword />} />
        <Route path="/nhap-hang" element={<ImportOrder setUser={setUser} user={user}  />} />
        <Route path='/xuat-hang' element={<ExportOrder setUser={setUser} user={user}/>} />
        <Route
          path="/nhap-hang/tao-don-nhap-hang"
          element={<CreateImportOrder setUser={setUser} user={user} />}
        />
        <Route path='/doi-tac' element={<FormTemplate />} />
        <Route
          path='/xuat-hang/tao-don-xuat-hang'
          element={<CreateExportOrder setUser={setUser} user={user} />}
        />
        {/* View Order */}
        <Route path="/nhap-hang/:id" element={<ViewOrder user={user} setUser={setUser} />} />
        <Route path='/xuat-hang/:id' element={<ViewOrder user={user} setUser={setUser} />} />

        {/* Edit Order */}
        <Route path="/nhap-hang/:id/cap-nhat" element={<EditOrder user={user} setUser={setUser} />} />
        <Route path='/xuat-hang/:id/cap-nhat' element={<EditOrder user={user} setUser={setUser} />} />

        <Route
          path="/tong-quan-kho"
          element={<OverviewPage user={user} setUser={setUser} />}
        />
        <Route
          path="/thong-ke-kho"
          element={<Statistic user={user} setUser={setUser} />}
        />

        <Route path="/ke-hoach-van-chuyen" element={<Delivery
          setUser={setUser}
          user={user}
        />} />
        <Route path="/ke-hoach-van-chuyen/:act" element={<DeliverySchedule
          setUser={setUser}
          user={user}
        />} />

        <Route
          path="/thong-tin-ca-nhan"
          element={<Profile user={user} setUser={setUser} />}
        />

        <Route
          path="/danh-sach-nguoi-dung"
          element={<AdminPage user={user} setUser={setUser} />}
        />
        <Route path="/error403" element={<Error403 user={user} setUser={setUser} />} />
        <Route path="/error404" element={<Error404 user={user} setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;
