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
import EmployeeInfoPage from "./pages/employee_info";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SchedulePage from './pages/schedule';
import HomePage from './pages/home';
import ShiftListPage from './pages/schedule/shift-list';
import CreateShiftPage from './pages/schedule/create-shift';
import ShiftDetailPage from './pages/schedule/shift-detail';
import ShiftHistoryPage from './pages/schedule/shift-history';

export default function App() {
  return (
    <BrowserRouter>
      <div className="">
        <main className="">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/schedule/shift-list" element={<ShiftListPage />} />
            <Route path="/schedule/create-shift" element={<CreateShiftPage />} />
            <Route path="/schedule/shift-history" element={<ShiftHistoryPage />} />
            <Route path="/schedule/:shiftId" element={<ShiftDetailPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path='/design' element={<DesignPage />} />
            <Route path="/employee_management" element={<EmployeeInfoPage />} />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
