import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../utils/time';
import NavBar from '../../components/navBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { Shift, Staff } from '../../data/type';
import { shifts, staffs } from '../../data/dummyData';

const DashboardPage: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());
  const [staff, setCurrentStaff] = useState<Staff>();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000); // update every 1 second

    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  const [moneyEarned, setMoneyEarned] = useState(0);
  const [hourWorked, setHourWorked] = useState(0);

  const [thisWeekShifts, setThisWeekShifts] = useState<Shift[]>([]);
  const [nextWeekShifts, setNextWeekShifts] = useState<Shift[]>([]);

  useEffect(()=>{
    const thisWeekShifts = shifts.filter(shift=>{
      return(shift.startTime <= getEndOfWeekDate() && shift.startTime >= getStartOfWeekDate());
    })

    const nextWeekShift = shifts.filter(shift =>{
      return(shift.startTime >= getStartOfNextWeekDate() && shift.startTime <= getEndOfNextWeekDate())
    })

    setThisWeekShifts(thisWeekShifts);
    setNextWeekShifts(nextWeekShift);
    setCurrentStaff(staffs[0]);
  }, [])

  return (
    <div className='flex'>
      <div>
        <NavBar/>
      </div>
      <div className='ml-[400px] flex flex-col p-5'>
        <h1>{currentDateTime}</h1>
        <div className="border border-charcoal w-[100px] my-[30px]"></div>
        <div className='flex space-x-[50px]'>
          <div className='flex flex-col space-y-[10px]'>
            <h2>This Week</h2>
            <h3 className='bg-light_gray shadow-md p-[5px] rounded-[8px]'>Money Earned <AttachMoneyIcon className='text-forest_green'/> | ${moneyEarned}</h3>
            <h3 className='bg-light_gray shadow-md p-[5px] rounded-[8px]'>Hour Worked <AccessTimeIcon/> | {hourWorked}h</h3>
          </div>

          <div className='flex flex-col space-y-[10px]'>
            <h2>My shifts this week</h2>
            {thisWeekShifts.length > 0 ? (
              thisWeekShifts.map((shift)=>(
                <div key={shift.id} className='p-5 shadow-md rounded-[8px]'>
                  <h3>{extractFullDate(shift.startTime)} | {extractTime(shift.startTime)} - {extractTime(shift.endTime)}</h3>
                  <p>Expected work time: {caculateWorkTime(shift.startTime, shift.endTime).hours}  hours {caculateWorkTime(shift.startTime, shift.endTime).minutes} minutes</p>
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
                <div key={shift.id} className='p-5 shadow-md rounded-[8px]'>
                  <h3>{extractFullDate(shift.startTime)} | {extractTime(shift.startTime)} - {extractTime(shift.endTime)}</h3>
                  <p>Expected work time: {caculateWorkTime(shift.startTime, shift.endTime).hours}  hours {caculateWorkTime(shift.startTime, shift.endTime).minutes} minutes</p>
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
