import React, { useEffect, useState } from 'react';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Staff } from '../../../data/type';
import { Link } from 'react-router-dom';
import { isManager, useSetStaff } from '../../../utils/account';
import { hashSHA256 } from '../../../utils/security';

const AddStaffPage: React.FC = () => {
    const [newStaff, setNewStaff] = useState<Staff>();
    const { staff, handleStaff } = useSetStaff();
    useEffect(() => {
        handleStaff();
    }, []);

    const handlePassword= async(password:string)=>{
        const hashed = await hashSHA256(password)
        setNewStaff(prev => ({...(prev ?? {}),account: {...(prev?.account ?? {}),password: hashed,},}));
    }

    const handleAddStaff =async ()=>{
        if(!staff) return;
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_SERVER}/api/add_staff`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
            "name": newStaff?.name,
            "position": newStaff?.position,
            "phone_number": newStaff?.phone_number,
            "account_type": newStaff?.account?.account_type,
            "wage_rate": newStaff?.wage_rate,
            "password": newStaff?.account?.password,
            "hire_date": newStaff?.hire_date?.toISOString()
        })
        });

        const data = await response.json();
        if(data.success){
            const id = data.staff_id;
            alert(`Staff added, staff ID: ${id}`)
            window.location.href = '/staff'
        }
        else{
            alert("Can not add staff")
        }
    }
    
    useEffect(() => {
    if (staff) {
        if (!isManager(staff)) {
        alert("You don't have permission");
        window.location.href = "/";
        }
    }
    }, [staff]);

  return (
    <div className='flex'>
        <div>
        <NavBar />
        </div>

        <div className='flex flex-col ml-[400px] p-5'>
            <Link to={"/staff"}><button className='text-light_gray bg-charcoal w-fit text-center'><ArrowBackIcon/> Back</button></Link>
            <div className="border border-charcoal w-[100px] my-[30px]"></div>

            <div className='flex flex-col space-y-[30px]'>
                <div className='flex flex-col space-y-[5px]'>
                    <h2>Staff ID will be generated after staff is created</h2>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Staff name</h2>
                    <input type='text' onChange={(e)=>setNewStaff(prev => ({ ...prev, name: e.target.value }))}/>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Phone number</h2>
                    <input type='tel'onChange={(e)=>setNewStaff(prev => ({ ...prev, phone_number: e.target.value }))}/>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Staff position</h2>
                    <input type='text'onChange={(e)=>setNewStaff(prev => ({ ...prev, position: e.target.value }))}/>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Wage rate</h2>
                    <input type='number' onChange={(e)=>setNewStaff(prev => ({ ...prev, wage_rate: Number(e.target.value) }))}/>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Password</h2>
                    <input type='password' onChange={(e)=>handlePassword(e.target.value)}/>
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    <h2>Hire date</h2>
                    <input id='hire_date' className='bg-charcoal text-light_gray' type='date' onChange={(e)=>setNewStaff(prev => ({ ...prev, hire_date: new Date(e.target.value) }))}/>
                </div>

                <div className='flex space-x-[5px] items-center'>
                    <h2>Account permission</h2>
                    <select
                        className='p-2 border-[2px] rounded-[8px] w-fit'
                        defaultValue="employee"
                        onChange={(e) =>
                            setNewStaff(prev => ({...(prev ?? {}),account: {...(prev?.account ?? {}),account_type: e.target.value,},}))
                        }
                    >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>

            </div>

            <div className='flex space-x-[30px] mt-[50px]'>
                <button className='bg-forest_green text-light_gray' onClick={handleAddStaff}><h2>Confirm and add</h2></button>
                <Link to={'/staff'}><button className='text-charcoal hover:bg-gray-300 transition'><h2>Cancel</h2></button></Link>
            </div>

        </div>
    </div>
    );
};

export default AddStaffPage;
