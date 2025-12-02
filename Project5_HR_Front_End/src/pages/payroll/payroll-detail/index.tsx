import React, { useEffect, useState } from 'react';
import {extractFullDate} from '../../../utils/time';
import NavBar from '../../../components/navBar';
import type { Payroll } from '../../../data/type';
import {useParams } from 'react-router-dom';
import { useSetStaff } from '../../../utils/account';

const PayrollDetailPage: React.FC = () => {
    const {payrollId} = useParams<{ payrollId: string }>()
    const { staff, handleStaff } = useSetStaff();
        useEffect(() => {
        handleStaff();
    }, []);
    const [payroll, setPayroll] = useState<Payroll>()
    const fetchPayroll = async() =>{
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_SERVER}/api/payroll_detail?payroll_id=${payrollId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        });

        const data = await response.json()
        if(data.success == true){
            setPayroll(data.payroll)
        }
        else{
            alert("Can not load payroll")
            window.location.href = '/payroll'
        }
    }

    const handleCancelPayroll = async() =>{
        const option = confirm("Do you want to cancel this payroll?")
        if (option){
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_SERVER}/api/cancel_payroll?payroll_id=${payrollId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            });

            const data = await response.json()
            if(data.success){
                alert("Payroll canceled")
                window.location.reload()
            }
        }
    }

    useEffect(()=>{
        fetchPayroll()
    }, [])
  return (
    <div className='flex'>
        <div>
        <NavBar />
        </div>
        {payroll && (
            <div className='flex flex-col ml-[400px] p-5'>
                <div className='flex flex-col space-y-[30px]'>
                    <div className='flex flex-col space-y-[10px]'>
                        <h1>Detail of payroll</h1>
                        {payroll.is_canceled ?(
                            <div className="p-5 shadow rounded-[8px] text-light_gray bg-tomato_red">
                                <h2>Payroll #{payroll.payroll_id} (This payroll is canceled)</h2>
                                <p>Issue date: {extractFullDate(payroll.created_at)}</p>
                                <h3>Amount: ${(payroll.hours_worked * payroll.wage_rate).toFixed(2)}</h3>
                            </div>
                        ):(
                            <div className="p-5 shadow rounded-[8px] text-charcoal ">
                                <h2>Payroll #{payroll.payroll_id}</h2>
                                <p>Issue date: {extractFullDate(payroll.created_at)}</p>
                                <h3>Amount: ${(payroll.hours_worked * payroll.wage_rate).toFixed(2)}</h3>
                            </div>
                        )}
                    </div>
                    <div className='border border-charcoal w-[400px]'></div>
                </div>

                <div className='flex space-x-[50px] mt-[30px]'>
                    <div className='flex flex-col space-y-[30px]'>
                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Issue Date</h3>
                            <div className="p-5 shadow rounded-[8px] text-charcoal w-fit">
                                <h3>{extractFullDate(payroll.created_at)}</h3>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Receiver</h3>
                            <div className="p-5 shadow rounded-[8px] text-charcoal w-fit">
                                <h3>{payroll.receiver}</h3>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col space-y-[30px]'>
                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Pay date range</h3>
                            <div className="p-5 shadow rounded-[8px] text-charcoal w-fit">
                                <h3>{extractFullDate(payroll.start_date)} - {extractFullDate(payroll.end_date)}</h3>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Wage</h3>
                            <div className="p-5 shadow rounded-[8px] text-charcoal w-fit">
                                <h3>${payroll.wage_rate}/h</h3>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Hours worked</h3>
                            <div className="p-5 shadow rounded-[8px] text-charcoal w-fit">
                                <h3>{payroll.hours_worked}h</h3>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Salary</h3>
                            <div className="p-5 shadow rounded-[8px] text-charcoal w-fit">
                                <h3>${(payroll.hours_worked * payroll.wage_rate).toFixed(2)}</h3>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col space-y-[30px]'>
                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Bonus</h3>
                            <div className="p-5 shadow rounded-[8px] text-light_gray bg-forest_green w-fit">
                                <h3>${payroll.bonus}</h3>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Deduction</h3>
                            <div className="p-5 shadow rounded-[8px] text-light_gray bg-tomato_red w-fit">
                                <h3>- ${payroll.deduction}</h3>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-[5px]'>
                            <h3>Amount received</h3>
                            <div className="p-5 shadow rounded-[8px] text-light_gray bg-accent_blue w-fit">
                                <h3>${((payroll.hours_worked*payroll.wage_rate) + payroll.bonus - payroll.deduction)}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                {staff?.account?.account_type == "manager" ? (
                    <div className='flex space-x-[10px] mt-[30px]'>
                        <button onClick={()=>window.location.href='/payroll'}><h3>Back</h3></button>
                        {!payroll.is_canceled && (
                            <button className='bg-tomato_red text-light_gray' onClick={handleCancelPayroll}><h3>Cancel payroll</h3></button>
                        )}
                    </div>
                ):(
                    <div className='flex space-x-[10px] mt-[30px]'>
                        <button onClick={()=>window.location.href='/payroll'}><h3>Back</h3></button>
                    </div>
                )}
            </div>
        )}

        
    </div>
    );
};

export default PayrollDetailPage;
