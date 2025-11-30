import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, formatDateForInput, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../../utils/time';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import type { Account, Shift, Staff } from '../../../data/type';
import { Link, useParams } from 'react-router-dom';
import { isManager, parsedStaff, useSetStaff } from '../../../utils/account';
import { hashSHA256 } from '../../../utils/security';

const StaffInfoPage: React.FC = () => {
    const {staffId} = useParams<{ staffId: string }>()
    const { staff, handleStaff } = useSetStaff();
    useEffect(() => {
        handleStaff();
    }, []);

    const [currentStaff, setCurrentStaff] = useState<Staff>()

    const fetchStaff =async ()=>{
        if(!staff) return;
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_SERVER}/api/get_staff?staff_id=${staffId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
        });

        const data = await response.json();
        if(data.success){
            setCurrentStaff(data.staff)
        }
        else{
            alert("Can not save staff")
        }
    }

    const handleSaveStaff = async() =>{
        if(!staff) return;
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_SERVER}/api/update_staff?staff_id=${staffId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
            "name": currentStaff?.name,
            "position": currentStaff?.position,
            "phone_number": currentStaff?.phone_number,
            "account_type": currentStaff?.account?.account_type,
            "wage_rate": currentStaff?.wage_rate,
            "password": currentStaff?.account?.password,
            "hire_date": currentStaff?.hire_date?.toISOString()
        })
        });

        const data = await response.json();
        if(data.success){
            alert("Staff saved")
            window.location.href = '/staff'
        }
        else{
            alert("Can not load staff")
        }
    }

    const handleDeleteStaff = async() =>{
        if(!staff) return;
        const option = confirm("Do you want to delete staff?")
        if(!option) return;

        const token = sessionStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_SERVER}/api/delete_staff?staff_id=${staffId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        });

        const data = await response.json();
        if(data.success){
            alert("Staff deleted")
            window.location.href = '/staff'
        }
        else{
            alert("Can not delete staff")
        }
    }
    
    useEffect(() => {
    if (staff) {
        if (!isManager(staff)) {
            alert("You don't have permission");
            window.location.href = "/";
            return
        }
        fetchStaff()
    }
    }, [staff]);

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
                    <h2>Staff ID: {currentStaff?.staff_id}</h2>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Staff name</h2>
                    <input type='text' value={currentStaff?.name} onChange={(e)=>setCurrentStaff(prev => ({ ...prev, name: e.target.value }))}/>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Phone number</h2>
                    <input type='tel' value={currentStaff?.phone_number} onChange={(e)=>setCurrentStaff(prev => ({ ...prev, phone_number: e.target.value }))}/>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Staff position</h2>
                    <input type='text' value={currentStaff?.position} onChange={(e)=>setCurrentStaff(prev => ({ ...prev, position: e.target.value }))}/>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Wage rate</h2>
                    <input type='number'value={currentStaff?.wage_rate} onChange={(e)=>setCurrentStaff(prev => ({ ...prev, wage_rate: Number(e.target.value) }))}/>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Hire date</h2>
                    <input id='hire_date' value={formatDateForInput(currentStaff?.hire_date)} className='bg-charcoal text-light_gray' type='date' onChange={(e)=>setCurrentStaff(prev => ({ ...prev, hire_date: new Date(e.target.value) }))}/>
                </div>

                <div className='flex space-x-[5px] items-center'>
                    <h2>Account permission</h2>
                    <select
                        className='p-2 border-[2px] rounded-[8px] w-fit'
                        value={currentStaff?.account?.account_type}
                        onChange={(e) =>
                            setCurrentStaff(prev => ({...(prev ?? {}),account: {...(prev?.account ?? {}),account_type: e.target.value,},}))
                        }
                    >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>

            </div>

            <div className='flex space-x-[30px] mt-[50px]'>
                <button className='bg-forest_green text-light_gray' onClick={handleSaveStaff}><h2>Save</h2></button>
                <button className='bg-tomato_red text-light_gray' onClick={handleDeleteStaff}><h2>Delete</h2></button>
                <Link to={'/staff'}><button className='text-charcoal hover:bg-gray-300 transition'><h2>Cancel</h2></button></Link>
            </div>

        </div>
    </div>
    );
};

export default StaffInfoPage;
