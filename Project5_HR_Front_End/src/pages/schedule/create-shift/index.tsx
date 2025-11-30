import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../../utils/time';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import type { Account, Shift, Staff } from '../../../data/type';
import { Link, useParams } from 'react-router-dom';
import { isManager, parsedStaff, useSetStaff } from '../../../utils/account';

const CreateShiftPage: React.FC = () => {
    const [shift, setShift] = useState<Shift>();
    const [associatedStaffs, setAssociatedStaffs] = useState<Staff[]>([]);

    const [staffsList, setStaffsList] = useState<Staff[] | []>([]);
    const [staffsPage, setStaffsPage] = useState<number>(1);
    const [isNextPage, setIsNextPage] = useState<Boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);

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

   const handleCreateShift = async () => {
        if(!shift?.start_time && !shift?.end_time){
            alert("All fields must be filled");
            return;
        }
        if(shift?.start_time.getTime() >= shift?.end_time.getTime()){
            alert("Shift end time must be after start time");
            return
        }   
        try {
            const finalStaffList = (associatedStaffs ?? []).map(staff=>staff.staff_id)

            const token = sessionStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_SERVER}/api/create_shift`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                        start_time: shift?.start_time.toISOString(),
                        end_time: shift?.end_time.toISOString(),
                        staffs: finalStaffList,
                    }),
                }
            );

            const result = await response.json();

            if (response.ok && result.success) {
                alert(`Shift created, shift ID: ${result.shift_id}`);
                // window.location.href = "/schedule/shift-list";
            }
        } catch (err) {
            console.error("Error updating shift:", err);
        }
    };


    const handleAddStaffs = async (staff:Staff) =>{
        if (associatedStaffs.some(s => s.staff_id === staff.staff_id)) {
            setAssociatedStaffs(prev =>
                prev.filter(s => s.staff_id !== staff.staff_id)
            );
        } else {
            setAssociatedStaffs(prev => [...prev, staff]);
        }
    }

    const handleLoadStaffLists = async()=>{
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_SERVER}/api/get_staffs?page=${staffsPage}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const staffs = result.staffs as Staff[]
                const totalPage = result.total_page;
                setStaffsList(staffs)
                setTotalPages(totalPage)
                
                if(staffsPage == totalPages){
                    setIsNextPage(false);
                }
                else{
                    setIsNextPage(true);
                }
                
            }

        } catch (err) {
            console.error("Error loading shift details:", err);
        }
    }

    useEffect(() => {
        handleLoadStaffLists()
    }, []);

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
                    <h2>Shift ID will be generated after shift is created</h2>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Start Time</h2>
                    <div className='flex space-x-[10px]'>
                        <div className='flex flex-col space-y-[10px]'>
                            <div>
                                <input id='start_time' className='w-fit bg-charcoal text-light_gray' type='datetime-local' onChange={(e)=>setShift({...shift!, start_time: new Date(e.target.value)})}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>End Time</h2>
                    <div className='flex space-x-[10px]'>
                        <div className='flex flex-col space-y-[10px]'>
                            <div>
                                <input id='end_time' className='w-fit bg-charcoal text-light_gray' type='datetime-local' onChange={(e)=>setShift({...shift!, end_time: new Date(e.target.value)})}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex space-x-[30px] mt-[50px]'>
                <button className='bg-forest_green text-light_gray' onClick={handleCreateShift}><h2>Confirm and create</h2></button>
                <Link to={'/schedule'}><button className='text-charcoal hover:bg-gray-300 transition'><h2>Cancel</h2></button></Link>
            </div>

        </div>

        <div className='p-5 flex flex-col '>
            <h2>Staff List | Assigning: {associatedStaffs.length} staffs</h2>
            <div className='flex flex-col space-y-[10px] mt-[10px]'>
                {staffsList.map((staff)=>(
                    associatedStaffs.some(s => s.staff_id === staff.staff_id) ? (
                    <div className='p-2 shadow rounded-[8px] bg-accent_blue text-light_gray cursor-pointer' onClick={()=>{handleAddStaffs(staff)}} key={staff.staff_id}>
                            <div className='flex items-center space-x-[10px]'>
                                <AccountCircleIcon fontSize='large'/>
                                <div>
                                    <h3>{staff.name}</h3>
                                    <p>{staff.position}</p>
                                </div>
                            </div>
                        </div>
                    ):(
                        <div className='p-2 shadow rounded-[8px] hover:bg-gray-300 transition cursor-pointer' onClick={()=>{handleAddStaffs(staff)}} key={staff.staff_id}>
                            <div className='flex items-center space-x-[10px]'>
                                <AccountCircleIcon fontSize='large'/>
                                <div>
                                    <h3>{staff.name}</h3>
                                    <p>{staff.position}</p>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
            <div className='mt-[30px]'>
                <h3 className='text-center'>Page {staffsPage.toString()} / {totalPages.toString()}</h3>
                <div className='flex justify-between'>
                    {staffsPage > 1 ? (
                            <button><span className="material-symbols-outlined" onClick={()=>{setStaffsPage(staffsPage-1); handleLoadStaffLists()}}>chevron_left</span></button>
                        ):(
                            <button className='bg-medium_gray text-light_gray'><span className="material-symbols-outlined">chevron_left</span></button>
                        )
                    }

                    {staffsPage == totalPages ? (
                            <button className='bg-medium_gray text-light_gray'><span className="material-symbols-outlined">chevron_right</span></button>
                        ):(
                            <button><span className="material-symbols-outlined">chevron_right</span></button>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
    );
};

export default CreateShiftPage;
