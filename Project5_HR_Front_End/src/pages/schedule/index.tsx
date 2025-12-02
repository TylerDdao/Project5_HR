import React, { useEffect, useState } from 'react';
import {
  caculateWorkTime,
  extractDate,
  extractFullDate,
  extractTime,
  getEndOfNextWeekDate,
  getEndOfWeekDate,
  getStartOfNextWeekDate,
  getStartOfWeekDate
} from '../../utils/time';
import NavBar from '../../components/navBar';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import type { Shift } from '../../data/type';
import { Link } from 'react-router-dom';
import { useSetStaff } from '../../utils/account';

const SchedulePage: React.FC = () => {
    const [thisWeekDates, setThisWeekDates] = useState<Date[]>([]);
    const [nextWeekDates, setNextWeekDates] = useState<Date[]>([]);
    const [thisWeekShifts, setThisWeekShifts] = useState<Shift[]>([]);
    const [nextWeekShifts, setNextWeekShifts] = useState<Shift[]>([]);
    const [currentShifts, setCurrentShifts] = useState<Shift[]>([])

    const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())

    const { staff, handleStaff } = useSetStaff();
    useEffect(() => {
      handleStaff();
    }, []);

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

                const nextWeekShiftsData = data.next_wek_shifts as Shift[]
                const nextWeekShiftsWithDate = nextWeekShiftsData.map((shift)=>({
                    ...shift,
                    start_time: new Date(shift.start_time),
                    end_time: new Date(shift.end_time)
                }))
                setNextWeekShifts(nextWeekShiftsWithDate)
            }
        }
        //This week date
        const thisWeekDates =[];
        for(let i = getStartOfWeekDate(); i < getEndOfWeekDate(); i.setDate(i.getDate() + 1)){
            thisWeekDates.push(new Date(i));
        }
        setThisWeekDates(thisWeekDates);

        const nextWeekDates =[];
        for(let i = getStartOfNextWeekDate(); i < getEndOfNextWeekDate(); i.setDate(i.getDate() + 1)){
            nextWeekDates.push(new Date(i));
        }
        setNextWeekDates(nextWeekDates);

        fetchShifts();
    }, [staff])

    //Refresh time and active shift
    useEffect(() => {
        const currentShifts = thisWeekShifts.filter(
            shift => shift.start_time.getTime() <= currentDateTime.getTime() &&
                    shift.end_time.getTime() > currentDateTime.getTime()
        );
        setCurrentShifts(currentShifts);
    }, [thisWeekShifts, currentDateTime]);

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

        <div className="flex space-x-[30px]">
          <div className="flex flex-col">
            {/* This Week Shifts */}
            <div className="flex flex-col">
              <h1>This Week Shifts</h1>
              {thisWeekDates.map(date => {
                const todayShift = thisWeekShifts.filter(
                  shift => shift.start_time && shift.start_time.toDateString() === date.toDateString()
                );
                return (
                  <div key={date.toDateString()} className="mb-[10px]">
                    <h3>{extractFullDate(date)}</h3>
                    {todayShift.length > 0 ? (
                      todayShift.map(shift => (
                        <Link to={`/schedule/${shift.shift_id}`} key={shift.shift_id}>
                          <div className="p-5 shadow rounded-[8px] text-charcoal">
                            <h3>Start Time: {extractFullDate(shift.start_time)} @ {extractTime(shift.start_time)}</h3>
                            <h3>End Time: {extractFullDate(shift.end_time)} @ {extractTime(shift.end_time)}</h3>
                            <p>Expected work time: {caculateWorkTime(shift.start_time!, shift.end_time!).hours} hours {caculateWorkTime(shift.start_time!, shift.end_time!).minutes} minutes</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div>
                        <FreeBreakfastIcon /> No Shift
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next Week Shifts */}
            <div className="flex flex-col mt-5">
              <h1>Next Week Shifts</h1>
              {nextWeekDates.map(date => {
                const nextWeek = nextWeekShifts.filter(
                  shift => shift.start_time && shift.start_time.toDateString() === date.toDateString()
                );
                return (
                  <div key={date.toDateString()} className="mb-[10px]">
                    <h3>{extractFullDate(date)}</h3>
                    {nextWeek.length > 0 ? (
                      nextWeek.map(shift => (
                        <Link to={`schedule/${shift.shift_id}`} key={shift.shift_id}>
                          <div  className="p-5 shadow rounded-[8px] text-charcoal">
                            <h3>Start Time: {extractFullDate(shift.start_time)} @ {extractTime(shift.start_time)}</h3>
                            <h3>End Time: {extractFullDate(shift.end_time)} @ {extractTime(shift.end_time)}</h3>
                            <p>Expected work time: {caculateWorkTime(shift.start_time!, shift.end_time!).hours} hours {caculateWorkTime(shift.start_time!, shift.end_time!).minutes} minutes</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div>
                        <FreeBreakfastIcon /> No Shift
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Shifts */}
          <div className="flex flex-col space-y-[30px]">
            <div className="flex flex-col space-y-[10px]">
              <h1>Active Shift</h1>
              {currentShifts.length > 0 ? (
                currentShifts.map(shift => (
                  <div key={shift.shift_id} className="p-5 bg-accent_blue shadow rounded-[8px] text-light_gray">
                    <h3>
                      {extractFullDate(shift.start_time!)} | {extractTime(shift.start_time!)} -{' '}
                      {extractTime(shift.end_time!)}
                    </h3>
                    <p>
                      Expected work time: {caculateWorkTime(shift.start_time!, shift.end_time!).hours} hours{' '}
                      {caculateWorkTime(shift.start_time!, shift.end_time!).minutes} minutes
                    </p>
                    <p>
                      Time left: {caculateWorkTime(new Date(), shift.end_time!).hours} hours{' '}
                      {caculateWorkTime(new Date(), shift.end_time!).minutes + 1} minutes
                    </p>
                  </div>
                ))
              ) : (
                <div>
                  <FreeBreakfastIcon /> No Shift
                </div>
              )}
            </div>

            {staff?.account?.account_type === 'manager' && (
              <div className="flex flex-col space-y-[10px]">
                <h1>Shift Management</h1>
                <div className="flex space-x-[10px]">
                  <Link to="/schedule/create-shift">
                    <button className="bg-accent_blue text-light_gray">Create Shift</button>
                  </Link>
                  <Link to="/schedule/shift-list">
                    <button className="bg-light_gray text-accent_blue hover:bg-gray-300 transition">Modify Shift</button>
                  </Link>
                  <Link to="/schedule/shift-history">
                    <button className="bg-light_gray text-accent_blue hover:bg-gray-300 transition">Shift History</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
