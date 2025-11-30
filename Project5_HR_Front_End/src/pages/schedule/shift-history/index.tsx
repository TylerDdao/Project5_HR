import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../../utils/time';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type {  Account,  Shift, Staff } from '../../../data/type';
import { Link } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { isManager, useSetStaff } from '../../../utils/account';


const ShiftHistoryPage: React.FC = () => {
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

    const [shiftList, setShiftList] = useState<Shift[]>([]);

    const fetchShifts = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_SERVER}/api/shift_detail?status=done`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const shiftData = result.done_shifts as Shift[];

                // Convert start_time and end_time to Date objects
                const shiftsWithDates = shiftData.map(shift => ({
                    ...shift,
                    start_time: new Date(shift.start_time),
                    end_time: new Date(shift.end_time)
                }));
                setShiftList(shiftsWithDates);
            } else {
                alert("Failed to load shift details");
                throw new Error(result.message || "Failed to load shift details");
            }

        } catch (err) {
            console.error("Error loading shift details:", err);
        }
    };


    useEffect(() => {
        fetchShifts();
    }, []);

  return (
    <div className='flex'>
        <div>
        <NavBar />
        </div>

        <div className='flex flex-col ml-[400px] p-5'>
            <Link to={"/schedule"}><button className='text-light_gray bg-charcoal w-fit text-center'><ArrowBackIcon/> Back</button></Link>
            <div className="border border-charcoal w-[100px] my-[30px]"></div>

            <h2>Shift History</h2>
            <div className='flex flex-col space-y-[10px] mt-[30px]'>
                {shiftList.length > 0 ? (
                    shiftList.map((shift) => (
                        <Link to={`/schedule/${shift.shift_id}`} key={shift.shift_id}>
                            <div className='p-5 shadow rounded-[8px] text-charcoal'>
                                <h3>Start Time: {extractFullDate(shift.start_time)} @ {extractTime(shift.start_time)}</h3>
                                <h3>End Time: {extractFullDate(shift.end_time)} @ {extractTime(shift.end_time)}</h3>
                                <p>
                                Work time: {caculateWorkTime(shift.start_time, shift.end_time).hours} hours {caculateWorkTime(shift.start_time, shift.end_time).minutes} minutes
                                </p>
                            </div>
                        </Link>
                    ))):
                (
                    <div className='mt-[30px] flex space-x-[5px] text-medium_gray'>
                        <CalendarTodayIcon/>
                        <h3>Shift History is empty</h3>
                    </div>
                )}
            </div>

        </div>
    </div>
    );
};

export default ShiftHistoryPage;
