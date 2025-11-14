import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../../utils/time';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Shift, Staff } from '../../../data/type';
import { shifts, shiftsStaffs, staffs } from '../../../data/dummyData';
import { Link } from 'react-router-dom';

const ShiftListPage: React.FC = () => {
    const [staff, setCurrentStaff] = useState<Staff>();

    useEffect(()=>{
        setCurrentStaff(staffs[0])
    }, [staff?.position])

    const [shiftList, setShiftList] = useState<Shift[]>([]);

    useEffect(()=>{
        if(!staff){
            return
        }

        const now = new Date()
        const todayShift: Shift[] = shifts.filter((shift)=>{
            return(shift.startTime.toDateString() == now.toDateString() && shift.startTime.getTime() <= now.getTime() && shift.endTime.getTime() > now.getTime())
        });
        setCurrentShifts(todayShift);

        const today = new Date();
        const shiftList = shifts.filter((shift)=>{
            return(shift.startTime > today);
        })

        setShiftList(shiftList);

    }, [staff])

    

  useEffect(()=>{
    if (!staff) return;
  }, [staff])

    const [currentShifts, setCurrentShifts] = useState<Shift[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            const todayShift: Shift[] = shifts.filter((shift)=>{
                return(shift.startTime.toDateString() == now.toDateString() && shift.startTime.getTime() <= now.getTime() && shift.endTime.getTime() > now.getTime())
            });
            setCurrentShifts(todayShift);
        }, 1000);
    
        return () => clearInterval(timer);
      });

  return (
    <div className='flex'>
        <div>
        <NavBar />
        </div>

        <div className='flex flex-col ml-[400px] p-5'>
            <Link to={"/schedule"}><button className='text-light_gray bg-charcoal w-fit text-center'><ArrowBackIcon/> Back</button></Link>
            <div className="border border-charcoal w-[100px] my-[30px]"></div>

            <h2>Active Shift</h2>
            <div className='flex flex-col space-y-[10px]'>
                {currentShifts.map((shift)=>(
                    <Link to={`/schedule/${shift.id}`}>
                        <div key={shift.id} className='p-5 shadow rounded-[8px] text-light_gray bg-accent_blue'>
                            <h3>{extractFullDate(shift.startTime)} | {extractTime(shift.startTime)} - {extractTime(shift.endTime)}</h3>
                            <p>Expected work time: {caculateWorkTime(shift.startTime, shift.endTime).hours}  hours {caculateWorkTime(shift.startTime, shift.endTime).minutes} minutes</p>
                            <p>Expected work time left: {caculateWorkTime(new Date(), shift.endTime).hours} hours {caculateWorkTime(new Date(), shift.endTime).minutes + 1} minutes</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="border border-charcoal w-[100px] my-[30px]"></div>

            <h2>Choose a shift for modification</h2>
            <div className='flex flex-col space-y-[10px]'>
                {shiftList.map((shift)=>(
                    <Link to={`/schedule/${shift.id}`}>
                        <div key={shift.id} className='p-5 shadow rounded-[8px] text-charcoal'>
                            <h3>{extractFullDate(shift.startTime)} | {extractTime(shift.startTime)} - {extractTime(shift.endTime)}</h3>
                            <p>Expected work time: {caculateWorkTime(shift.startTime, shift.endTime).hours}  hours {caculateWorkTime(shift.startTime, shift.endTime).minutes} minutes</p>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    </div>
    );
};

export default ShiftListPage;
