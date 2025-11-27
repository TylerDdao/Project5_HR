// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import DesignPage from './pages/design';
import DashboardPage from './pages/dashboard'; // Notice you don't need to write '/index.tsx'
import LoginPage from './pages/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SchedulePage from './pages/schedule';
import ShiftListPage from './pages/schedule/shift-list';
import CreateShiftPage from './pages/schedule/create-shift';
import ShiftDetailPage from './pages/schedule/shift-detail';
import ShiftHistoryPage from './pages/schedule/shift-history';
// import PayrollPage from './pages/payroll';
import { useEffect, useState } from 'react';
import { parsedStaff } from './utils/account';
import type { Staff } from './data/type';

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

              {/* <Route path='/payroll' element={<PayrollPage/>}/> */}

              <Route path="/login" element={<LoginPage />} />
              <Route path='/design' element={<DesignPage/>}/>
            </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
