import React, { useEffect, useState } from 'react';
import {extractFullDate } from '../../utils/time';
import NavBar from '../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Link } from 'react-router-dom';
import { useSetStaff } from '../../utils/account';
import { hashSHA256 } from '../../utils/security';

const MyAccountPage: React.FC = () => {
    const { staff, handleStaff } = useSetStaff();
    useEffect(() => {
        handleStaff();
    }, []);

    const [oldPassword, setOldPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>()

    const handleUpdatePassword = async() =>{
        if(!staff) return;
        if(!oldPassword && !newPassword) return
        
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_SERVER}/api/update_password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
            "staff_id": staff.staff_id,
            "old_password": oldPassword,
            "new_password": newPassword
        })
        });

        const data = await response.json();
        if(data.success){
            alert("Password updated")
            window.location.href = '/dashboard'
        }
        else{
            if(data.not_match){
                alert("Your old password is incorrect")
                return
            }
            alert("Can not update password")
        }
    }

    const handleOldPassword = async(password: string) => {
        const hashed = await hashSHA256(password)
        setOldPassword(hashed)
    }

    const handleNewPassword = async(password: string) => {
        const hashed = await hashSHA256(password)
        setNewPassword(hashed)
    }
    return (
        <div className='flex'>
            <div>
            <NavBar />
            </div>

            <div className='flex flex-col ml-[400px] p-5'>
                <Link to={"/schedule/shift-list"}><button className='text-light_gray bg-charcoal w-fit text-center'><ArrowBackIcon/> Back</button></Link>
                <div className="border border-charcoal w-[100px] my-[30px]"></div>

                {staff&&(
                    <div className='flex flex-col space-y-[10px]'>
                        <h2>Information</h2>
                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Staff ID: {staff?.staff_id}</h3>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Staff name: {staff.name}</h3>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Phone number: {staff.phone_number}</h3>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Staff position: {staff.position}</h3>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Wage rate: ${staff.wage_rate}/h</h3>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Hire date: {extractFullDate(staff.hire_date)}</h3>
                        </div>

                        <div className='flex flex-col space-y-[10px]'>
                            <h2>Change password</h2>
                            <div className='flex flex-col space-y-[5px]'>
                                <h3>Old password</h3>
                                <input type='password' onChange={(e)=>{handleOldPassword(e.target.value)}}/>
                            </div>

                            <div className='flex flex-col space-y-[5px]'>
                                <h3>New password</h3>
                                <input type='password' onChange={(e)=>{handleNewPassword(e.target.value)}}/>
                            </div>
                        </div>

                    </div>
                )}

                <div className='flex space-x-[30px] mt-[50px]'>
                    <button className='bg-forest_green text-light_gray' onClick={handleUpdatePassword}><h2>Save</h2></button>
                    <Link to={'/staff'}><button className='text-charcoal hover:bg-gray-300 transition'><h2>Cancel</h2></button></Link>
                </div>

            </div>
        </div>
        );
};

export default MyAccountPage;
