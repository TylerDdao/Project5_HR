import React, { useEffect, useState } from 'react';
import {
  caculateWorkTime,
  extractDate,
  extractFullDate,
  extractTime,
  getCurrentDateTime,
  getEndOfNextWeekDate,
  getEndOfWeekDate,
  getStartOfNextWeekDate,
  getStartOfWeekDate
} from '../../utils/time';
import NavBar from '../../components/navBar';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import { type Payroll } from '../../data/type';
import { shifts as rawShifts, shiftsStaffs } from '../../data/dummyData';
import { Link } from 'react-router-dom';
import { parsedStaff, useSetStaff } from '../../utils/account';

const PayrollPage: React.FC = () => {
  const [thisMonthPayrolls, setThisMonthPayrolls] = useState<Payroll[]>([])
  const [allPayrolls, setAllPayrolls] = useState<Payroll[]>([])

    const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())

    const { staff, handleStaff } = useSetStaff();
    useEffect(() => {
      handleStaff();
    }, []);

    const fetchPayrolls = async() =>{
      if(!staff) return;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_SERVER}/api/my_payrolls?staff_id=${staff.staff_id}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      });

      const data = await response.json()
      if(data.success == true){
        setThisMonthPayrolls(data.this_month_payrolls || []);
        setAllPayrolls(data.all_payrolls || []);
      }
    }

    useEffect(() => {
      fetchPayrolls();
    }, [staff]);


    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

  return (
    <div className="flex">
      <NavBar />
      <div className="flex flex-col ml-[400px] p-5">
        <h1>{extractDate(currentDateTime)} - {extractTime(currentDateTime)}</h1>
        <div className="border border-charcoal w-[100px] my-[30px]"></div>

        <div className='flex space-x-[30px]'>
          <div className='flex flex-col space-y-[10px]'>
            <h2>My payroll this month</h2>
            {thisMonthPayrolls.map((payroll)=>(
              payroll.is_canceled ? (
                <Link key={payroll.payroll_id} to={`/payroll/${payroll.payroll_id}`}>
                  <div className="p-5 shadow rounded-[8px] text-light_gray bg-tomato_red">
                    <h2>Payroll #{payroll.payroll_id} (Canceled)</h2>
                    <p>Issue date: {extractFullDate(payroll.created_at)}</p>
                    <h3>Amount: ${(payroll.hours_worked * payroll.wage_rate).toFixed(2)}</h3>
                  </div>
                </Link>
              ):(
                <Link key={payroll.payroll_id} to={`/payroll/${payroll.payroll_id}`}>
                  <div className="p-5 shadow rounded-[8px] text-charcoal">
                    <h2>Payroll #{payroll.payroll_id}</h2>
                    <p>Issue date: {extractFullDate(payroll.created_at)}</p>
                    <h3>Amount: ${(payroll.hours_worked * payroll.wage_rate).toFixed(2)}</h3>
                  </div>
                </Link>
              )
            ))}
          </div>

          <div className='flex flex-col space-y-[10px]'>
            <h2>All of my payrolls</h2>
            {allPayrolls.map((payroll)=>(
             payroll.is_canceled ? (
                <Link key={payroll.payroll_id} to={`/payroll/${payroll.payroll_id}`}>
                  <div className="p-5 shadow rounded-[8px] text-light_gray bg-tomato_red">
                    <h2>Payroll #{payroll.payroll_id} (Canceled)</h2>
                    <p>Issue date: {extractFullDate(payroll.created_at)}</p>
                    <h3>Amount: ${(payroll.hours_worked * payroll.wage_rate).toFixed(2)}</h3>
                  </div>
                </Link>
              ):(
                <Link key={payroll.payroll_id} to={`/payroll/${payroll.payroll_id}`}>
                  <div className="p-5 shadow rounded-[8px] text-charcoal">
                    <h2>Payroll #{payroll.payroll_id}</h2>
                    <p>Issue date: {extractFullDate(payroll.created_at)}</p>
                    <h3>Amount: ${(payroll.hours_worked * payroll.wage_rate).toFixed(2)}</h3>
                  </div>
                </Link>
              )
            ))}
          </div>

          {staff?.account?.account_type == "manager" &&(
            <div className='flex flex-col space-y-[10px]'>
              <button className='bg-accent_blue text-light_gray w-min-[200px]' onClick={()=> window.location.href = '/payroll/create-payroll'}><h3>Create payroll</h3></button>
              <button className='w-min-[200px] hover:bg-gray-300 transition'  onClick={()=> window.location.href = '/payroll/payroll-list'}><h3>Payrolls list</h3></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;
