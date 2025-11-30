import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../utils/time';
import NavBar from '../../components/navBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { type Communication, type Account, type Shift, type Staff } from '../../data/type';
import { shifts } from '../../data/dummyData';
import { calculateTotalHours, parsedStaff } from '../../utils/account';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [staff, setStaff] = useState<Staff>();
  
  const [thisWeekShifts, setThisWeekShifts] = useState<Shift[]>([]);
  const [nextWeekShifts, setNextWeekShifts] = useState<Shift[]>([]);
  const [currentShifts, setCurrentShifts] = useState<Shift[]>([])
  const [announcements, setAnnouncements] = useState<Communication[]>([]);

  const [moneyEarned, setMoneyEarned] = useState<number>(-1);
  const [hoursWorked, setHoursWorked] = useState<number>(-1)

  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())

  //Load staff and account
  useEffect(()=>{
    const staff = parsedStaff()
    if(staff){
      setStaff({...staff, hire_date: staff.hire_date ? new Date(staff.hire_date) : undefined})
    }
  }, [])

  const fetchAnnouncement = async () => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_SERVER}/api/get_announcements`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      });

      const data = await response.json()
      if(data.success){
        setAnnouncements(data.announcements)
      }
      
  }

  const fetchRecords = async()=>{
    if(!staff) return
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_SERVER}/api/this_week_shift_records?staff_id=${staff.staff_id}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      });

    const data = await response.json()
    if(data.success == true){
      const { hours, minutes } = calculateTotalHours(data.shift_records);
      setHoursWorked(Number((hours + minutes / 60).toFixed(2))); // total hours as decimal
      if(staff.wage_rate){
        setMoneyEarned(Number((staff.wage_rate * (hours + minutes / 60)).toFixed(2)))
      }
    }
  }

  const handleClockIn = async()=>{
    if(!staff) return;
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_SERVER}/api/clock_in?staff_id=${staff.staff_id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        staff_id: staff.staff_id,
        check_in: new Date().toISOString()
      }),
      });

      const data = await response.json()
      if(data.success == true){
        alert("Clocked in")
        const updatedStaff = { ...staff, is_working: true };
        setStaff(updatedStaff);
        sessionStorage.setItem("staff", JSON.stringify(updatedStaff));
        sessionStorage.setItem("shift_record_id", data.shift_record_id)
      }
      else{
        alert("Can not clock in")
      }
  }

  const handleClockOut = async() =>{
    if(!staff) return;
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_SERVER}/api/clock_out?staff_id=${staff.staff_id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        staff_id: staff.staff_id,
        shift_record_id: sessionStorage.getItem("shift_record_id"),
        check_out: new Date().toISOString()
      }),
      });

      const data = await response.json()
      if(data.success == true){
        alert("Clocked out")
        const updatedStaff = { ...staff, is_working: false };
        setStaff(updatedStaff);
        sessionStorage.setItem("staff", JSON.stringify(updatedStaff));
      }
      else{
        alert("Can not clock out")
      }
  }

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
      fetchRecords();
      fetchAnnouncement();
  }, [staff])

  useEffect(() => {
    const currentShifts = thisWeekShifts.filter(
        shift => shift.start_time.getTime() <= currentDateTime.getTime() && shift.end_time.getTime() > currentDateTime.getTime()
    );
    setCurrentShifts(currentShifts);
  }, [thisWeekShifts, currentDateTime]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
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
            <div className='flex flex-col space-y-[10px]'>
              <h2>This Week</h2>
              {moneyEarned >= 0 ?(
                <h3 className='bg-light_gray shadow-md p-[5px] rounded-[8px] w-fit'>Money Earned <AttachMoneyIcon className='text-forest_green'/> | ${moneyEarned}</h3>
              ):(
                <h3 className='bg-light_gray shadow-md p-[5px] rounded-[8px]'>Money Earned <AttachMoneyIcon className='text-forest_green'/> | Loading...</h3>
              )}
              {hoursWorked >=0?(
                <h3 className='bg-light_gray shadow-md p-[5px] rounded-[8px] w-fit'>Hour Worked <AccessTimeIcon/> | {hoursWorked}h</h3>
              ):(
                <h3 className='bg-light_gray shadow-md p-[5px] rounded-[8px]'>Hour Worked <AccessTimeIcon/> | Loading...</h3>
              )}
            </div>
            <div className='flex flex-col space-y-[10px] mt-[30px]'>
              <button className='hover:bg-gray-300 transition' onClick={handleClockIn}><h3>Clock In</h3></button>
              <button className='hover:bg-gray-300 transition' onClick={handleClockOut}><h3>Clock Out</h3></button>
            </div>

            {staff?.is_working ?(
            <div><h3 className='text-tomato_red'>Status: In shift</h3></div>):
            (<div><h3 className='text-forest_green'>Status: Not in shift</h3></div>)
            }
          </div>

          <div className='flex flex-col space-y-[10px]'>
              <div className="flex flex-col space-y-[10px]">
              <h1>Active Shift</h1>
              {currentShifts.length > 0 ? (
                currentShifts.map(shift => {
                  const now = new Date()
                  return(
                    <Link to={`/schedule/${shift.shift_id}`} key={shift.shift_id}>
                      <div className="p-5 bg-accent_blue shadow rounded-[8px] text-light_gray">
                        <h3>Start Time: {extractFullDate(shift.start_time)} @ {extractTime(shift.start_time)}</h3>
                        <h3>End Time: {extractFullDate(shift.end_time)} @ {extractTime(shift.end_time)}</h3>
                        <p>Expected work time: {caculateWorkTime(shift.start_time, shift.end_time).hours}  hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes</p>
                        <p>Time left: {caculateWorkTime(now, shift.end_time).hours} hours {caculateWorkTime(now, shift.end_time).minutes} minutes</p>
                        <h3>Shift ID: {shift.shift_id}</h3>
                      </div>
                    </Link>
                  )
                })
              ) : (
                <div>
                   No Shift
                </div>
              )}
            </div>


            <h2>My shifts this week</h2>
            {thisWeekShifts.length > 0 ? (
              thisWeekShifts.map((shift)=>(
                <Link to={`/schedule/${shift.shift_id}`} key={shift.shift_id}>
                  <div className='p-5 shadow-md rounded-[8px] text-charcoal'>
                    <h3>Start Time: {extractFullDate(shift.start_time)} @ {extractTime(shift.start_time)}</h3>
                    <h3>End Time: {extractFullDate(shift.end_time)} @ {extractTime(shift.end_time)}</h3>
                    <p>Expected work time: {caculateWorkTime(shift.start_time, shift.end_time).hours}  hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes</p>
                    <h3>Shift ID: {shift.shift_id}</h3>
                  </div>
                </Link>
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
                <Link to={`/schedule/${shift.shift_id}`} key={shift.shift_id}>
                  <div className='p-5 shadow-md rounded-[8px] text-charcoal'>
                    <h3>Start Time: {extractFullDate(shift.start_time)} @ {extractTime(shift.start_time)}</h3>
                    <h3>End Time: {extractFullDate(shift.end_time)} @ {extractTime(shift.end_time)}</h3>
                    <p>Expected work time: {caculateWorkTime(shift.start_time, shift.end_time).hours}  hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes</p>
                    <h3>Shift ID: {shift.shift_id}</h3>
                  </div>
                </Link>
              ))
            ) : (
              <div className='text-medium_gray flex items-center'>
                <CalendarTodayIcon/>
                <div>No shift next week</div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col space-y-[10px] mt-[30px]'>
          <h2>Announcement</h2>
          <div className='flex flex-col space-y-[10px]'>
            {announcements.length > 0 ? (
              announcements.map((a)=>(
              <div key={a.communication_id} className='p-5 shadow-md rounded-[8px] text-charcoal'>
                <h3>{a.subject}</h3>
                <p>{a.body}</p>
                <div className='caption'>Sent at: {extractFullDate(a.sent_at)}</div>
              </div>
            ))
            ):(
              <div className='text-medium_gray'>No announcement <span className="material-symbols-outlined">chat_dashed</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
