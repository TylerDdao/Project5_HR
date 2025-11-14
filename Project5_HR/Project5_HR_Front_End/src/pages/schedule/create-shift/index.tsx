import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../../utils/time';
import NavBar from '../../../components/navBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import type { Shift, Staff } from '../../../data/type';
import { shifts, shiftsStaffs, staffs } from '../../../data/dummyData';
import { Link } from 'react-router-dom';

const CreateShift: React.FC = () => {
    const [staff, setCurrentStaff] = useState<Staff>();

    const [thisWeekDates, setThisWeekDates] = useState<Date[]>([]);
    const [nextWeekDates, setNextWeekDates] = useState<Date[]>([]);

    const [thisWeekShifts, setThisWeekShifts] = useState<Shift[]>([]);
    const [nextWeekShifts, setNextWeekShifts] = useState<Shift[]>([]);

    useEffect(()=>{
        setCurrentStaff(staffs[0])
    }, [staff?.position])

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
    const shiftIds = shiftsStaffs.filter((s) => s.staffId === staff?.id).map((s) => s.shiftId);

    let thisWeekShifts = shifts.filter(shift=>(shiftIds.includes(shift.id)))

    thisWeekShifts = thisWeekShifts.filter(shift=>{
          return(shift.startTime <= getEndOfWeekDate() && shift.startTime >= getStartOfWeekDate() );
    })

    let nextWeekShift = shifts.filter(shift=>(shiftIds.includes(shift.id)))
    
    nextWeekShift = nextWeekShift.filter(shift =>{
        return(shift.startTime >= getStartOfNextWeekDate() && shift.startTime <= getEndOfNextWeekDate())
    })
    
    setThisWeekShifts(thisWeekShifts);
    setNextWeekShifts(nextWeekShift);

    setThisWeekDates(dates);
    setNextWeekDates(nextWeekDates);
  }, [staff])


  const [currentShifts, setCurrentShifts] = useState<Shift[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000); // update every 1 second

    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
        const todayShift: Shift[] = [];
        thisWeekShifts.map((shift) => {
            if(shift.startTime.toDateString() == new Date().toDateString()){
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
                            if(shift.startTime.toDateString() == date.toDateString()){
                                todayShift.push(shift);
                            }
                        })

                        return(
                            <div className='mb-[10px]'>
                                <h3>{extractFullDate(date)}</h3>
                                {todayShift.length >0 ? (
                                todayShift.map((shift)=>(
                                        <div key={shift.id} className='p-5 shadow-md rounded-[8px]'>
                                            <h3>{extractFullDate(shift.startTime)} | {extractTime(shift.startTime)} - {extractTime(shift.endTime)}</h3>
                                            <p>Expected work time: {caculateWorkTime(shift.startTime, shift.endTime).hours}  hours {caculateWorkTime(shift.startTime, shift.endTime).minutes} minutes</p>
                                        </div>
                                    ))
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
                            if(shift.startTime.toDateString() == date.toDateString()){
                                todayShift.push(shift);
                            }
                        })

                        return(
                            <div className='mb-[10px]'>
                                <h3>{extractFullDate(date)}</h3>
                                {todayShift.length >0 ? (
                                todayShift.map((shift)=>(
                                        <div key={shift.id} className='p-5 shadow-md rounded-[8px]'>
                                            <h3>{extractFullDate(shift.startTime)} | {extractTime(shift.startTime)} - {extractTime(shift.endTime)}</h3>
                                            <p>Expected work time: {caculateWorkTime(shift.startTime, shift.endTime).hours}  hours {caculateWorkTime(shift.startTime, shift.endTime).minutes} minutes</p>
                                        </div>
                                    ))
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
                            currentShifts.map((shift)=>(
                                <div>
                                    <div key={shift.id} className='p-5 bg-accent_blue shadow-md rounded-[8px] text-light_gray'>
                                        <h3>{extractFullDate(shift.startTime)} | {extractTime(shift.startTime)} - {extractTime(shift.endTime)}</h3>
                                        <p>Expected work time: {caculateWorkTime(shift.startTime, shift.endTime).hours}  hours {caculateWorkTime(shift.startTime, shift.endTime).minutes} minutes</p>
                                    </div>
                                </div>
                            ))
                        ):(
                            <div><FreeBreakfastIcon/> No Shift</div>
                        )}
                    </div>

                    {staff?.position == "Manager" && (
                        <div className='flex flex-col space-y-[10px]'>
                            <h1>Shift Management</h1>
                            <div className='flex space-x-[10px]'>
                                <Link to={"/shift/create_shift"}><button className='bg-accent_blue text-light_gray'><p>Create Shift</p></button></Link>
                                <Link to={"/shift/modify_shift"}><button className='bg-light_gray text-accent_blue'><p>Modify Shift</p></button></Link>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    </div>
    );
};

export default CreateShift;
