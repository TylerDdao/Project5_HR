import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../utils/time';
import NavBar from '../../components/navBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import type { Account, Shift, Staff } from '../../data/type';
import { shifts, shiftsStaffs, staffs } from '../../data/dummyData';
import { Link } from 'react-router-dom';

const SchedulePage: React.FC = () => {
    const [staff, setCurrentStaff] = useState<Staff>();
    const [account, setCurrentAccount] = useState<Account>();

    useEffect(() => {
        const accountStr = sessionStorage.getItem("account");
        const staffStr = sessionStorage.getItem("staff");

        if (accountStr) {
            const parsedAccount = JSON.parse(accountStr) as Account;
            setCurrentAccount(parsedAccount);

            if (parsedAccount.role !== "Manager") {
                alert("You don't have permission to access this page");
                window.location.href = "/dashboard";
            }
        } else {
            alert("You are not logged in");
            window.location.href = "/dashboard";
        }

        if (staffStr) {
            const parsedStaff = JSON.parse(staffStr) as Staff;
            setCurrentStaff({
                ...parsedStaff,
                hire_date: parsedStaff.hire_date ? new Date(parsedStaff.hire_date) : undefined
            });
        }
    }, []);

    const [thisWeekDates, setThisWeekDates] = useState<Date[]>([]);
    const [nextWeekDates, setNextWeekDates] = useState<Date[]>([]);

    const [thisWeekShifts, setThisWeekShifts] = useState<Shift[]>([]);
    const [nextWeekShifts, setNextWeekShifts] = useState<Shift[]>([]);

  useEffect(()=>{
    if (!staff) return;

    const startWeek = getStartOfWeekDate();
    const endWeek = getEndOfWeekDate();

    const current = new Date(startWeek);;
    const dates: Date[] = [];
    while(current <= endWeek){
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    const startNextWeek = getStartOfNextWeekDate();
    const endNextWeek = getEndOfNextWeekDate();
    const nextWeek = new Date(startNextWeek)
    const nextWeekDates: Date[] = [];
    while(nextWeek <= endNextWeek){
        nextWeekDates.push(new Date(nextWeek));
        nextWeek.setDate(nextWeek.getDate()+1);
    }

    //Load shift by staff
    const shiftIds = shiftsStaffs.filter((s) => s.staff_id === staff?.id).map((s) => s.shift_id);

    let thisWeekShifts = shifts.filter(shift=>(shiftIds.includes(shift.id)))

    thisWeekShifts = thisWeekShifts.filter(shift=>{
          return(shift.start_time <= getEndOfWeekDate() && shift.start_time >= getStartOfWeekDate() );
    })

    let nextWeekShift = shifts.filter(shift=>(shiftIds.includes(shift.id)))
    
    nextWeekShift = nextWeekShift.filter(shift =>{
        return(shift.start_time >= getStartOfNextWeekDate() && shift.start_time <= getEndOfNextWeekDate())
    })
    
    setThisWeekShifts(thisWeekShifts);
    setNextWeekShifts(nextWeekShift);

    setThisWeekDates(dates);
    setNextWeekDates(nextWeekDates);
  }, [staff])

  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000); // update every 1 second

    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  const [currentShifts, setCurrentShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
        const now = new Date()
        const todayShift: Shift[] = [];
        thisWeekShifts.map((shift) => {
            if(shift.start_time.toDateString() == now.toDateString() && shift.start_time.getTime() <= now.getTime() && shift.end_time.getTime() > now.getTime()){
                todayShift.push(shift);
            }
        });
        setCurrentShifts(todayShift);
    }, 100);

    return () => clearInterval(timer);
  });

  return (
    <div className='flex'>
        <div>
        <NavBar />
        </div>

        <div className='flex flex-col ml-[400px] p-5'>
            <h1>{currentDateTime}</h1>
            <div className="border border-charcoal w-[100px] my-[30px]"></div>

            <div className='flex space-x-[30px]'>
                <div className=' flex flex-col'>
                    <h1>This Week Shifts</h1>
                    {thisWeekDates.map((date)=>{
                        const todayShift: Shift[] = [];
                        thisWeekShifts.forEach((shift) => {
                            if(shift.start_time.toDateString() == date.toDateString()){
                                todayShift.push(shift);
                            }
                        })

                        return(
                            <div className='mb-[10px]'>
                                <h3>{extractFullDate(date)}</h3>
                                {todayShift.length >0 ? (
                                    <div className='flex flex-col space-y-[10px]'>
                                        {todayShift.map((shift)=>(
                                            <div key={shift.id} className='p-5 shadow rounded-[8px]'>
                                                <h3>{extractFullDate(shift.start_time)} | {extractTime(shift.start_time)} - {extractTime(shift.end_time)}</h3>
                                                <p>Expected work time: {caculateWorkTime(shift.start_time, shift.end_time).hours}  hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes</p>
                                            </div>
                                        ))}
                                    </div>
                                ):(
                                    <div><FreeBreakfastIcon/> No Shift</div>
                                )}
                            </div>
                        )
                    })}
                    <div className="border border-charcoal w-[200px] my-[30px]"></div>
                    <h1>Next Week Shifts</h1>
                    {nextWeekDates.map((date)=>{
                        const todayShift: Shift[] = [];
                        nextWeekShifts.forEach((shift) => {
                            if(shift.start_time.toDateString() == date.toDateString()){
                                todayShift.push(shift);
                            }
                        })

                        return(
                            <div className='mb-[10px]'>
                                <h3>{extractFullDate(date)}</h3>
                                {todayShift.length >0 ? (
                                <div className='flex flex-col space-y-[10px]'>
                                    {todayShift.map((shift)=>(
                                        <div key={shift.id} className='p-5 shadow rounded-[8px]'>
                                            <h3>{extractFullDate(shift.start_time)} | {extractTime(shift.start_time)} - {extractTime(shift.end_time)}</h3>
                                            <p>Expected work time: {caculateWorkTime(shift.start_time, shift.end_time).hours}  hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes</p>
                                        </div>
                                    ))}
                                </div>
                                ):(
                                    <div><FreeBreakfastIcon/> No Shift</div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className='flex flex-col space-y-[30px]'>
                    <div className='flex flex-col space-y-[10px]'>
                        <h1>Active Shift</h1>
                        {currentShifts.length>0?(
                            <div className='flex flex-col space-y-[10px]'>
                                {currentShifts.map((shift)=>(
                                    <div>
                                        <div key={shift.id} className='p-5 bg-accent_blue shadow rounded-[8px] text-light_gray'>
                                            <h3>{extractFullDate(shift.start_time)} | {extractTime(shift.start_time)} - {extractTime(shift.end_time)}</h3>
                                            <p>Expected work time: {caculateWorkTime(shift.start_time, shift.end_time).hours}  hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes</p>
                                            <p>Expected work time left: {caculateWorkTime(new Date(), shift.end_time).hours} hours {caculateWorkTime(new Date(), shift.end_time).minutes + 1} minutes</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ):(
                            <div><FreeBreakfastIcon/> No Shift</div>
                        )}
                    </div>

                    {account?.role == "Manager" && (
                        <div className='flex flex-col space-y-[10px]'>
                            <h1>Shift Management</h1>
                            <div className='flex space-x-[10px]'>
                                <Link to={"/schedule/create-shift"}><button className='bg-accent_blue text-light_gray'><p>Create Shift</p></button></Link>
                                <Link to={"/schedule/shift-list"}><button className='bg-light_gray text-accent_blue'><p>Modify Shift</p></button></Link>
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
