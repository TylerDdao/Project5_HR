import React, { useEffect, useState } from 'react';
import { extractDate, extractTime} from '../../utils/time';
import NavBar from '../../components/navBar';
import type {  Staff } from '../../data/type';
import { isManager, useSetStaff } from '../../utils/account';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const StaffPage: React.FC = () => {
    const [staffsList, setStaffsList] = useState<Staff[] | []>([]);
    const [staffsPage, setStaffsPage] = useState<number>(1);
    const [isNextPage, setIsNextPage] = useState<Boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())

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

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

  return (
    <div className='flex'>
        <div>
        <NavBar />
        </div>

        <div className='flex flex-col ml-[400px] p-5'>
            <h1>{extractDate(currentDateTime)} - {extractTime(currentDateTime)}</h1>
            <div className="border border-charcoal w-[100px] my-[30px]"></div>
            <div className='flex space-x-[30px] w-full'>
                <div className='flex flex-col min-w-[300px]'>
                    <h2>Staff List</h2>
                    <div className='flex flex-col space-y-[10px] mt-[10px]'>
                        {staffsList.map((staff)=>(
                            <div className='p-2 shadow rounded-[8px] hover:bg-gray-300 transition cursor-pointer' onClick={()=>window.location.href=`/staff/${staff.staff_id}`} key={staff.staff_id}>
                                <div className='flex items-center space-x-[10px]'>
                                    <AccountCircleIcon fontSize='large'/>
                                    <div>
                                        <h3>{staff.name}</h3>
                                        <p>{staff.position}</p>
                                    </div>
                                </div>
                            </div>
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

                <div className='flex flex-col space-y-[10px]'>
                    <button className='bg-accent_blue text-light_gray' onClick={()=>window.location.href='/staff/add-staff'}><h2>Add staff</h2></button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default StaffPage;
