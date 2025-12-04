import React, { useEffect, useState } from 'react';
import { extractFullDate } from '../../../utils/time';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Payroll } from '../../../data/type';
import { Link } from 'react-router-dom';
import { isManager, useSetStaff } from '../../../utils/account';

const PayrollListPage: React.FC = () => {
    // const [staff, setStaff] = useState<Staff>();
    const [payrollList, setPayrollList] = useState<Payroll[]>([]);

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

    const fetchPayrolls = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_SERVER}/api/get_all_payrolls`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
            });

            const result = await response.json();

            if (result.success) {
                setPayrollList(result.payrolls)
            } else {
                alert("Failed to load shift details");
                throw new Error(result.message || "Failed to load shift details");
            }

        } catch (err) {
            console.error("Error loading shift details:", err);
        }
    };

    fetch

    useEffect(()=>{
        fetchPayrolls();
    }, [])

  return (
    <div className='flex'>
        <div>
        <NavBar />
        </div>

        <div className='flex flex-col ml-[400px] p-5'>
            <Link to={"/payroll"}><button className='text-light_gray bg-charcoal w-fit text-center'><ArrowBackIcon/> Back</button></Link>
            <div className="border border-charcoal w-[100px] my-[30px]"></div>
            <h2>All payroll</h2>
            {payrollList.map((payroll)=>(
                payroll.is_canceled ? (
                <Link key={payroll.payroll_id} to={`/payroll/${payroll.payroll_id}`}>
                    <div className="p-5 shadow rounded-[8px] text-light_gray bg-tomato_red">
                    <h2>Payroll #{payroll.payroll_id} (Canceled)</h2>
                    <p>Issue date: {extractFullDate(payroll.created_at)}</p>
                    <p>Receiver: {payroll.receiver}</p>
                    <h3>Amount: ${(payroll.hours_worked * payroll.wage_rate).toFixed(2)}</h3>
                    </div>
                </Link>
                ):(
                <Link key={payroll.payroll_id} to={`/payroll/${payroll.payroll_id}`}>
                    <div className="p-5 shadow rounded-[8px] text-charcoal">
                    <h2>Payroll #{payroll.payroll_id}</h2>
                    <p>Issue date: {extractFullDate(payroll.created_at)}</p>
                    <p>Receiver: {payroll.receiver}</p>
                    <h3>Amount: ${(payroll.hours_worked * payroll.wage_rate).toFixed(2)}</h3>
                    </div>
                </Link>
                )
            ))}
        </div>
    </div>
    );
};

export default PayrollListPage;
