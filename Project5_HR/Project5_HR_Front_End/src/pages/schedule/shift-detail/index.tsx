import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../../utils/time';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Shift, Staff } from '../../../data/type';
import { shifts, shiftsStaffs, staffs } from '../../../data/dummyData';
import { Link, useParams } from 'react-router-dom';

const ShiftDetailPage: React.FC = () => {
    const {shiftId} = useParams<{ shiftId: string }>()

    const [staff, setCurrentStaff] = useState<Staff>();

    useEffect(()=>{
        setCurrentStaff(staffs[0])
    }, [staff?.position])

    const [shift, setShift] = useState<Shift>();
    const [isActive, setIsActive] = useState<Boolean>(false)

    useEffect(()=>{
        setShift(shifts.find((shift)=>{return(shift.id.toString() == shiftId)}))
    }, [])

    useEffect(()=>{
        const now = new Date()
        if(shift?.startTime.toDateString() == now.toDateString() && shift.startTime.getTime() <= now.getTime() && shift.endTime.getTime() > now.getTime()){
            setIsActive(true);
        }
        else{
            setIsActive(false);
        }
    }, [shift])

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            if(shift?.startTime.toDateString() == now.toDateString() && shift.startTime.getTime() <= now.getTime() && shift.endTime.getTime() > now.getTime()){
                setIsActive(true);
            }
            else{
                setIsActive(false);
            }
        }, 1000);

        return () => clearInterval(timer);
    });

  return (
    <div className='flex'>
        <div>
        <NavBar />
        </div>

        <div className='flex flex-col ml-[400px] p-5'>
            <Link to={"/schedule/shift-list"}><button className='text-light_gray bg-charcoal w-fit text-center'><ArrowBackIcon/> Back</button></Link>
            <div className="border border-charcoal w-[100px] my-[30px]"></div>

            <div className='flex flex-col space-y-[30px]'>
                <div className='flex flex-col space-y-[5px]'>
                    <h2>Shift ID: {shift?.id}</h2>
                    {isActive?(
                        <div className='p-[5px] shadow rounded rounded-md bg-accent_blue text-light_gray w-fit'><h3>Status: Active</h3></div>
                    ):(
                        <div className='p-[5px] shadow rounded rounded-md w-fit bg-forest_green text-light_gray'><h3>Status: Scheduled</h3></div>
                    )}
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Start Time</h2>
                    {isActive?(
                        <div className='flex space-x-[10px]'>
                            <div className='p-[5px] shadow rounded rounded-md'><p>{extractFullDate(shift?.startTime)}</p></div>
                            <div className='p-[5px] shadow rounded rounded-md'><p>{extractTime(shift?.startTime)}</p></div>
                        </div>
                    ):(
                        <div className='flex space-x-[10px]'>
                            <input className='w-fit bg-charcoal text-light_gray' type='datetime-local' defaultValue={shift? new Date(shift.startTime).toISOString().slice(0, 16):''} />
                        </div>
                    )}
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>End Time</h2>
                    {isActive?(
                        <div className='flex space-x-[10px]'>
                            <div className='p-[5px] shadow rounded rounded-md'><p>{extractFullDate(shift?.endTime)}</p></div>
                            <div className='p-[5px] shadow rounded rounded-md'><p>{extractTime(shift?.endTime)}</p></div>
                        </div>
                    ):(
                        <div className='flex space-x-[10px]'>
                            <input className='w-fit bg-charcoal text-light_gray' type='datetime-local' defaultValue={shift? new Date(shift.endTime).toISOString().slice(0, 16):''} />
                        </div>
                    )}
                </div>
            </div>

        </div>
    </div>
    );
};

export default ShiftDetailPage;
