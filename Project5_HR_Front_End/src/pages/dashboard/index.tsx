import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../utils/time';
import NavBar from '../../components/navBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { Account, Shift, Staff } from '../../data/type';
import { shifts } from '../../data/dummyData';
import { parsedAccountandStaff } from '../../utils/account';

const DashboardPage: React.FC = () => {
  const [staff, setStaff] = useState<Staff>();
      const [account, setAccount] = useState<Account>();
  
      const [thisWeekShifts, setThisWeekShifts] = useState<Shift[]>([]);
      const [nextWeekShifts, setNextWeekShifts] = useState<Shift[]>([]);
      const [currentShifts, setCurrentShifts] = useState<Shift[]>([])

      const [moneyEarned, setMoneyEarned] = useState<number>(-1);
      const [hoursWorked, setHoursWorked] = useState<number>(-1)
  
      const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())
  
      //Load staff and account
      useEffect(()=>{
          const parsedAccount = parsedAccountandStaff()?.parsedAccount
          const parsedStaff = parsedAccountandStaff()?.parsedStaff
          if(parsedAccount && parsedStaff){
              setAccount(parsedAccount)
              setStaff({
                  ...parsedStaff,
                  hire_date: parsedStaff.hire_date ? new Date(parsedStaff.hire_date) : undefined
              })
          }
          else{
              alert("Something is wrong");
              window.location.href = "/";
          }
      }, [])
  
      //Load this week and next week shifts
      useEffect(()=>{
          const fetchShifts = async() =>{
              if(!staff) return;
              const token = sessionStorage.getItem("token");
              const response = await fetch(`${import.meta.env.VITE_SERVER}/api/assigned_shifts?staff_id=${staff.staff_id}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  ...(token ? { "Authorization": `Bearer ${token}` } : {})
              },
              });
  
              const data = await response.json();
              if(data.success == true){
                  const thisWeekShiftsData = data.this_week_shifts as Shift[]
                  const thisWeekShiftsWithDate = thisWeekShiftsData.map((shift)=>({
                      ...shift,
                      start_time: new Date(shift.start_time),
                      end_time: new Date(shift.end_time)
                  }))
                  setThisWeekShifts(thisWeekShiftsWithDate)
  
                  const nextWeekShiftsData = data.next_week_shifts as Shift[]
                  const nextWeekShiftsWithDate = nextWeekShiftsData.map((shift)=>({
                      ...shift,
                      start_time: new Date(shift.start_time),
                      end_time: new Date(shift.end_time)
                  }))
                  setNextWeekShifts(nextWeekShiftsWithDate)
              }
          }
  
          fetchShifts();
      }, [staff])
  
      //Refresh time and active shift
      useEffect(() => {
          const timer = setInterval(() => 
              {
                  const now = new Date()
                  setCurrentDateTime(now);
                  const currentShifts = thisWeekShifts.filter(shift=>(shift.start_time.getTime() <= now.getTime() && shift.end_time.getTime() > now.getTime()))
                  setCurrentShifts(currentShifts);
              }, 1000);
          return () => clearInterval(timer);
      }, []);

  return (
    <div className='flex'>
      <div>
        <NavBar/>
      </div>
      <div className='ml-[400px] flex flex-col p-5'>
        <h1>{extractDate(currentDateTime)} - {extractTime(currentDateTime)}</h1>
        <div className="border border-charcoal w-[100px] my-[30px]"></div>
        <div className='flex space-x-[50px]'>
          <div className='flex flex-col space-y-[10px]'>
            <h2>This Week</h2>
            {moneyEarned >= 0 ?(
              <h3 className='bg-light_gray shadow-md p-[5px] rounded-[8px]'>Money Earned <AttachMoneyIcon className='text-forest_green'/> | ${moneyEarned}</h3>
            ):(
              <h3 className='bg-light_gray shadow-md p-[5px] rounded-[8px]'>Money Earned <AttachMoneyIcon className='text-forest_green'/> | Loading...</h3>
            )}
            {hoursWorked >=0?(
              <h3 className='bg-light_gray shadow-md p-[5px] rounded-[8px]'>Hour Worked <AccessTimeIcon/> | {hoursWorked}h</h3>
            ):(
              <h3 className='bg-light_gray shadow-md p-[5px] rounded-[8px]'>Hour Worked <AccessTimeIcon/> | Loading...</h3>
            )}
          </div>

          <div className='flex flex-col space-y-[10px]'>
            <h2>My shifts this week</h2>
            {thisWeekShifts.length > 0 ? (
              thisWeekShifts.map((shift)=>(
                <div key={shift.shift_id} className='p-5 shadow-md rounded-[8px]'>
                  <h3>{extractFullDate(shift.start_time)} | {extractTime(shift.start_time)} - {extractTime(shift.end_time)}</h3>
                  <p>Expected work time: {caculateWorkTime(shift.start_time, shift.end_time).hours}  hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes</p>
                </div>
              ))
            ) : (
              <div className='text-medium_gray flex items-center'>
                <CalendarTodayIcon/>
                <div>No shift this week</div>
              </div>
            )}

            <h2 className='mt-[30px]'>My shifts next week</h2>
            {nextWeekShifts.length > 0 ? (
              nextWeekShifts.map((shift)=>(
                <div key={shift.shift_id} className='p-5 shadow-md rounded-[8px]'>
                  <h3>{extractFullDate(shift.start_time)} | {extractTime(shift.start_time)} - {extractTime(shift.end_time)}</h3>
                  <p>Expected work time: {caculateWorkTime(shift.start_time, shift.end_time).hours}  hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes</p>
                </div>
              ))
            ) : (
              <div className='text-medium_gray flex items-center'>
                <CalendarTodayIcon/>
                <div>No shift next week</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
