import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractFullDate, extractTime} from '../../../utils/time';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type {  Shift } from '../../../data/type';
import { Link } from 'react-router-dom';
import { isManager, useSetStaff } from '../../../utils/account';

const ShiftListPage: React.FC = () => {
    // const [staff, setStaff] = useState<Staff>();
    const [shiftList, setShiftList] = useState<Shift[]>([]);
    const [activeShifts, setActiveShifts] = useState<Shift[]>([]);
    const [scheduledShifts, setScheduledShifts] = useState<Shift[]>([]);

    const { staff, handleStaff } = useSetStaff();
    useEffect(() => {
        handleStaff();
    }, []);

    useEffect(() => {
    if (staff) {
        if (!isManager(staff)) {
        alert("You don't have permission");
        window.location.href = "/";
        }
    }
    }, [staff]);

    const fetchShifts = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_SERVER}/api/shift_detail?status=scheduled`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const activeShifts = result.active_shifts as Shift[];

                // Convert start_time and end_time to Date objects
                const activeShiftsWithDates = activeShifts.map(shift => ({
                    ...shift,
                    start_time: new Date(shift.start_time),
                    end_time: new Date(shift.end_time)
                }));
                setActiveShifts(activeShiftsWithDates);

                const scheduledShifts = result.scheduled_shifts as Shift[];

                // Convert start_time and end_time to Date objects
                const schdeuledShiftsWithDates = scheduledShifts.map(shift => ({
                    ...shift,
                    start_time: new Date(shift.start_time),
                    end_time: new Date(shift.end_time)
                }));
                setScheduledShifts(schdeuledShiftsWithDates);
            } else {
                alert("Failed to load shift details");
                throw new Error(result.message || "Failed to load shift details");
            }

        } catch (err) {
            console.error("Error loading shift details:", err);
        }
    };

    useEffect(()=>{
        fetchShifts();
    }, [])

  return (
    <div className='flex'>
        <div>
        <NavBar />
        </div>

        <div className='flex flex-col ml-[400px] p-5'>
            <Link to={"/schedule"}><button className='text-light_gray bg-charcoal w-fit text-center'><ArrowBackIcon/> Back</button></Link>
            <div className="border border-charcoal w-[100px] my-[30px]"></div>
            <h2>Active shifts</h2>
            <div className='flex flex-col space-y-[10px] mt-[5px] mb-[30px]'>
                {activeShifts.map((shift)=>{
                    const now = new Date()
                    return(
                        <Link to={`/schedule/${shift.shift_id}`} key={shift.shift_id}>
                            <div className='p-5 shadow rounded-[8px] text-light_gray bg-accent_blue'>
                                <h3>Start Time: {extractFullDate(shift.start_time)} @ {extractTime(shift.start_time)}</h3>
                                <h3>End Time: {extractFullDate(shift.end_time)} @ {extractTime(shift.end_time)}</h3>
                                <p>Expected work time: {caculateWorkTime(shift.start_time, shift.end_time).hours}  hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes</p>
                                <p>Shift is currently active</p>
                                <p>Time left: {caculateWorkTime(now, shift.end_time).hours} hours {caculateWorkTime(now, shift.end_time).minutes} minutes</p>
                                <h3>Shift ID: {shift.shift_id}</h3>
                            </div>
                        </Link>
                    )
                })}
            </div>

            <h2>Choose a shift for modification</h2>
            <div className='flex flex-col space-y-[10px] mt-[5px]'>
                {scheduledShifts.map((shift)=>(
                    <Link to={`/schedule/${shift.shift_id}`} key={shift.shift_id}>
                        <div className='p-5 shadow rounded-[8px] text-charcoal hover:bg-gray-300 transition'>
                            <h3>Start Time: {extractFullDate(shift.start_time)} @ {extractTime(shift.start_time)}</h3>
                            <h3>End Time: {extractFullDate(shift.end_time)} @ {extractTime(shift.end_time)}</h3>
                            <p>Expected work time: {caculateWorkTime(shift.start_time, shift.end_time).hours}  hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes</p>
                            <h3>Shift ID: {shift.shift_id}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
    );
};

export default ShiftListPage;
