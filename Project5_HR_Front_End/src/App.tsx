
import DashboardPage from './pages/dashboard';
import LoginPage from './pages/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SchedulePage from './pages/schedule';
import ShiftListPage from './pages/schedule/shift-list';
import CreateShiftPage from './pages/schedule/create-shift';
import ShiftDetailPage from './pages/schedule/shift-detail';
import ShiftHistoryPage from './pages/schedule/shift-history';
import { useEffect, useState } from 'react';
import { parsedStaff } from './utils/account';
import type { Staff } from './data/type';
import PayrollPage from './pages/payroll';
import PayrollListPage from './pages/payroll/payroll-list';
import CreatePayrollPage from './pages/payroll/create-payroll';
import PayrollDetailPage from './pages/payroll/payroll-detail';
import CommunicationPage from './pages/communication';
import MailPage from './pages/communication/my-mail';
import StaffPage from './pages/staff';
import AddStaffPage from './pages/staff/add-staff';
import StaffInfoPage from './pages/staff/staff-info';
import MyAccountPage from './pages/my-account';

export default function App() {
  const [staff, setStaff] = useState<Staff>();
  useEffect(()=>{
    const currentPath = window.location.pathname;
    const staff = parsedStaff()
    if(staff){
        setStaff({
            ...staff,
            hire_date: staff.hire_date ? new Date(staff.hire_date) : undefined
        })
        sessionStorage.setItem("account_type", staff.account?.account_type || "employee")
    }
    else{
        const publicRoutes = ["/login", "/"];

      if (!staff) {
          if (!publicRoutes.includes(currentPath)) {
              window.location.href = "/login";
          }
          return;
      }
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="">
        <main className="">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/schedule" element={<SchedulePage/>}/>
              <Route path="/schedule/shift-list" element={<ShiftListPage/>}/>
              <Route path="/schedule/create-shift" element={<CreateShiftPage/>}/>
              <Route path="/schedule/shift-history" element={<ShiftHistoryPage/>}/>
              <Route path="/schedule/:shiftId" element={<ShiftDetailPage/>}/>

              <Route path="/payroll" element={<PayrollPage/>}/>
              <Route path="/payroll/payroll-list" element={<PayrollListPage/>}/>
              <Route path="/payroll/create-payroll" element={<CreatePayrollPage/>}/>
              <Route path="/payroll/:payrollId" element={<PayrollDetailPage/>}/>

              <Route path="/communication" element={<CommunicationPage/>}/>
              <Route path="/communication/my-mail" element={<MailPage/>}/>

              <Route path='/staff' element={<StaffPage/>}/>
              <Route path='/staff/add-staff' element={<AddStaffPage/>}/>
              <Route path='/staff/:staffId' element={<StaffInfoPage/>}/>

              <Route path='/my-account' element={<MyAccountPage/>}/>

              {/* <Route path='/payroll' element={<PayrollPage/>}/> */}

              <Route path="/login" element={<LoginPage />} />
            </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
