import React, { useEffect, useState } from 'react';
import { extractDate, extractTime, getCurrentDateTime } from '../../utils/time';
import NavBar from '../../components/navBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { Shift } from '../../data/type';
import { simulatedThisWeek } from '../../data/dummyData';

const HomePage: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

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
    setThisWeekShifts(simulatedThisWeek);
  })

  return (
    <div className='flex'>
      <div>
        <NavBar/>
      </div>
      <div className='flex flex-col p-5'>
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
                  <h3>{extractDate(shift.startTime)} | {extractTime(shift.startTime)} - {extractTime(shift.endTime)}</h3>

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
              <div>Active!</div>
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

export default HomePage;
