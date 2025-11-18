import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../../utils/time';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Account, Shift, Staff } from '../../../data/type';
import { shifts, shiftsStaffs, staffs } from '../../../data/dummyData';
import { Link, useParams } from 'react-router-dom';

const ShiftDetailPage: React.FC = () => {
    const {shiftId} = useParams<{ shiftId: string }>()
    const [shift, setShift] = useState<Shift>();
    const [isActive, setIsActive] = useState<Boolean>(false)
    const [associatedStaffs, setAssociatedStaffs] = useState<Staff[]>();
    const [hasStaffs, setHasStaffs] = useState<Boolean>(true);

    const handleLoadingShiftDetail = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_SERVER}/api/shift_detail?shift_id=1`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            });

            const result = await response.json();

            if (response.ok && result.success) {
            const staffs = result.staffs as Staff[];
            const shiftData = result.shift as Shift;
            const shiftWithDates = {
                ...shiftData,
                start_time: new Date(shiftData.start_time),
                end_time: new Date(shiftData.end_time)
            };
            setShift(shiftWithDates);

            setAssociatedStaffs(staffs)
            if(staffs.length == 0){
                setHasStaffs(false);
            }
            } else {
            alert("Failed to load shift details");
            throw new Error(result.message || "Failed to load shift details");
            }

        } catch (err) {
            console.error("Error loading shift details:", err);
        }
    };


    const [staff, setCurrentStaff] = useState<Staff>();
    const [account, setCurrentAccount] = useState<Account>();

    useEffect(() => {
        handleLoadingShiftDetail()
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

    // const [shift, setShift] = useState<Shift>();
    // const [isActive, setIsActive] = useState<Boolean>(false)
    // const [associatedStaffs, setAssociatedStaffs] = useState<Staff[]>();

    // useEffect(()=>{
    //     setShift(shifts.find((shift)=>{return(shift.id.toString() == shiftId)}))
    //     const staffIds = shiftsStaffs.filter((ss)=>{return(ss.shift_id == shift?.id)})
    //     console.log(staffIds);
    // }, [])

    useEffect(() => {
    const checkActive = () => {
        if (!shift) return false;
        const now = new Date();
        return shift.start_time.getTime() <= now.getTime() && now.getTime() < shift.end_time.getTime();
    };

    setIsActive(checkActive());
    const timer = setInterval(() => setIsActive(checkActive()), 1000);
    return () => clearInterval(timer);
    }, [shift]);

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
                            <div className='p-[5px] shadow rounded rounded-md'><p>{extractFullDate(shift?.start_time)}</p></div>
                            <div className='p-[5px] shadow rounded rounded-md'><p>{extractTime(shift?.start_time)}</p></div>
                        </div>
                    ):(
                        <div className='flex space-x-[10px]'>
                            <input className='w-fit bg-charcoal text-light_gray' type='datetime-local' defaultValue={shift? new Date(shift.start_time).toISOString().slice(0, 16):''} />
                        </div>
                    )}
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>End Time</h2>
                    {isActive?(
                        <div className='flex space-x-[10px]'>
                            <div className='p-[5px] shadow rounded rounded-md'><p>{extractFullDate(shift?.end_time)}</p></div>
                            <div className='p-[5px] shadow rounded rounded-md'><p>{extractTime(shift?.end_time)}</p></div>
                        </div>
                    ):(
                        <div className='flex space-x-[10px]'>
                            <input className='w-fit bg-charcoal text-light_gray' type='datetime-local' defaultValue={shift? new Date(shift.end_time).toISOString().slice(0, 16):''} />
                        </div>
                    )}
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Assigned Staffs</h2>
                    {associatedStaffs ?(
                        associatedStaffs.map((staff)=>(
                            <div>{staff.name}</div>
                        ))
                    ):(
                        hasStaffs ? (
                            <h3>Loading staffs...</h3>
                        ):(
                            <h3>No staff were assigned to this shift</h3>
                        )
                    )}
                </div>
            </div>

        </div>
    </div>
    );
};

export default ShiftDetailPage;
