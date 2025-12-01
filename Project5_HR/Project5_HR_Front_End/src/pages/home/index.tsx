import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../utils/time';
import NavBar from '../../components/navBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { Shift, Staff } from '../../data/type';
import { shifts, staffs } from '../../data/dummyData';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
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
    <div className='h-screen flex flex-col items-center justify-center space-y-2'>
      <h1>Human Resource Management System | Project 5</h1>
      <h3>Please login to continue</h3>
      <Link to={"/login"}>
        <button className='bg-accent_blue text-light_gray'><h3>Log In</h3></button>
      </Link>
    </div>
  );
};

export default HomePage;
