import React, { useEffect, useState } from 'react';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import type { Payroll, Staff } from '../../../data/type';
import { Link } from 'react-router-dom';
import { isManager, useSetStaff } from '../../../utils/account';

const CreateShiftPage: React.FC = () => {
    const [payroll, setPayroll] = useState<Payroll>({
        payroll_id: 0,
        staff_id: 0,
        created_at: new Date(),
        is_canceled: false,
        hours_worked: 0,
        wage_rate: 0,
        bonus: 0,
        deduction: 0,
        start_date: new Date(),
        end_date: new Date(),
    });
    const [receiver, setReceiver] = useState<Staff | null>(null);

    const [staffsList, setStaffsList] = useState<Staff[]>([]);
    const [staffsPage, setStaffsPage] = useState<number>(1);
    const [isNextPage, setIsNextPage] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);

    const { staff, handleStaff } = useSetStaff();
    useEffect(() => {
        handleStaff();
    }, []);

    useEffect(() => {
        if (staff && !isManager(staff)) {
            alert("You don't have permission");
            window.location.href = "/";
        }
    }, [staff]);

    // Load staff list
    const handleLoadStaffLists = async () => {
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
                setStaffsList(result.staffs as Staff[]);
                setTotalPages(result.total_page);
                setIsNextPage(staffsPage < result.total_page);
            }
        } catch (err) {
            console.error("Error loading staff list:", err);
        }
    };

    useEffect(() => {
        handleLoadStaffLists();
    }, [staffsPage]);

    // Assign a single staff
    const handleSelectStaff = (staff: Staff) => {
        if (receiver?.staff_id === staff.staff_id) {
            setReceiver(null); // Unselect
        } else {
            setReceiver(staff); // Replace with new staff
        }
    };

    // Create payroll
    const handleCreatePayroll = async () => {
        if (!payroll?.start_date || !payroll?.end_date || !receiver) {
            alert("Please fill start date, end date and choose a staff");
            return;
        }
        if (payroll.start_date.getTime() >= payroll.end_date.getTime()) {
            alert("Payroll end time must be after start time");
            return;
        }

        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_SERVER}/api/create_payroll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    start_date: new Date(payroll.start_date.getTime() - payroll.start_date.getTimezoneOffset() * 60000).toISOString(),
                    end_date: new Date(payroll.end_date.getTime() - payroll.end_date.getTimezoneOffset() * 60000).toISOString(),
                    staff_id: receiver?.staff_id,
                    wage_rate: payroll.wage_rate,
                    hours_worked: payroll.hours_worked,
                    bonus: payroll.bonus,
                    deduction: payroll.deduction
                }),
            });
            const result = await response.json();
            if (result.success) {
                alert(`Payroll created, payroll ID: ${result.payroll_id}`);
                window.location.href = "/payroll";
            }
        } catch (err) {
            console.error("Error creating shift:", err);
        }
    };

    const handleCalculateSalary = async()=>{
        if (!payroll?.start_date || !payroll?.end_date || !receiver) {
            alert("Please fill start date, end date and choose a staff");
            return; // important to stop the function here
        }
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_SERVER}/api/calculate_salary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    start_date: new Date(payroll.start_date.getTime() - payroll.start_date.getTimezoneOffset() * 60000).toISOString(),
                    end_date: new Date(payroll.end_date.getTime() - payroll.end_date.getTimezoneOffset() * 60000).toISOString(),
                    staff_id: receiver?.staff_id,
                }),
            });
            const data = await response.json();
            if (data.success) {
                const hours_worked = data.hours_worked
                const wage_rate = data.wage_rate

                setPayroll((prev) => ({...prev!, wage_rate: Number(wage_rate), hours_worked: Number(hours_worked)}))
                
            }
        } catch (err) {
            console.error("Error creating shift:", err);
        }
    }

    return (
        <div className="flex">
            <NavBar />
            <div className="flex flex-col ml-[400px] p-5">
                <Link to="/schedule/shift-list">
                    <button className="text-light_gray bg-charcoal w-fit text-center">
                        <ArrowBackIcon /> Back
                    </button>
                </Link>

                <div className="border border-charcoal w-[100px] my-[30px]"></div>

                <div className='flex space-x-[30px]'>
                    <div className="flex flex-col space-y-[30px]">
                        <div className="flex flex-col space-y-[5px]">
                            <h2>Payroll ID will be generated after creation</h2>
                        </div>

                        <div className="flex flex-col space-y-[5px]">
                            <h2>Pay from</h2>
                            <input
                                type="date"
                                className="w-fit bg-charcoal text-light_gray"
                                onChange={(e) =>
                                    setPayroll({ ...payroll!, start_date: new Date(e.target.value) })
                                }
                            />
                        </div>

                        <div className="flex flex-col space-y-[5px]">
                            <h2>Pay until</h2>
                            <input
                                type="date"
                                className="w-fit bg-charcoal text-light_gray"
                                onChange={(e) =>
                                    setPayroll({ ...payroll!, end_date: new Date(e.target.value) })
                                }
                            />
                        </div>

                        <button className='hover:bg-gray-300 transition' onClick={handleCalculateSalary}><h3>Calculate salary</h3></button>

                        <div className="flex flex-col space-y-[10px]">
                            <h2>Receiver | Selected: {receiver ? receiver.name : "None"}</h2>
                            <div className="flex flex-col space-y-[10px] mt-[10px]">
                                {staffsList.map((s) => (
                                    <div
                                        key={s.staff_id}
                                        className={`p-2 shadow rounded-[8px] ${
                                            receiver?.staff_id === s.staff_id
                                                ? "bg-accent_blue text-light_gray"
                                                : "hover:bg-gray-300 transition cursor-pointer"
                                        }`}
                                        onClick={() => handleSelectStaff(s)}
                                    >
                                        <div className="flex items-center space-x-[10px]">
                                            <AccountCircleIcon fontSize="large" />
                                            <div>
                                                <h3>{s.name}</h3>
                                                <p>{s.position}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <h3 className='text-center mt-[30px]'>Page {staffsPage.toString()} / {totalPages.toString()}</h3>
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

                    <div className='flex flex-col space-y-[30px]'>
                        <div className='flex flex-col space-y-[10px]'>
                            <h3>Hours worked * Wage rate</h3>
                            <div className='flex space-x-[10px]'>
                                <div className='flex space-x-[5px] items-center'>
                                    <input type='number' value={payroll?.hours_worked} onChange={(e)=>setPayroll((prev) => ({...prev!, hours_worked: Number(e.target.value)}))}/>
                                    <p>h</p>
                                </div>

                                <p> * </p>

                                <div className='flex space-x-[5px] items-center'>
                                    <p>$</p>
                                    <input type='number' value={payroll?.wage_rate} onChange={(e)=>setPayroll((prev) => ({...prev!, wage_rate: Number(e.target.value)}))}/>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-[10px]'>
                            <h3>Bonus</h3>
                            <div className='flex space-x-[5px] items-center'>
                                <p>+ $</p>
                                <input type='number' value={payroll?.bonus} onChange={(e)=>setPayroll((prev) => ({...prev!, bonus: Number(e.target.value)}))}/>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-[10px]'>
                            <h3>Deduction</h3>
                            <div className='flex space-x-[5px] items-center'>
                                <p>- $</p>
                                <input type='number' value={payroll?.deduction} onChange={(e)=>setPayroll((prev) => ({...prev!, deduction: Number(e.target.value)}))}/>
                            </div>
                        </div>

                        <div className='border border-charcoal w-[200px]'></div>

                        <div className='flex flex-col space-y-[10px]'>
                            <h2 className='text-accent_blue'>Amount received</h2>
                            <div className='flex space-x-[5px] items-center'>
                                <p>$</p>
                                <input type='number' value={((payroll?.hours_worked * payroll?.wage_rate) + payroll.bonus - payroll.deduction).toFixed(2)} disabled/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-[30px] mt-[50px]">
                    <button
                        className="bg-forest_green text-light_gray"
                        onClick={handleCreatePayroll}
                    >
                        <h2>Confirm and create</h2>
                    </button>
                    <Link to="/schedule">
                        <button className="text-charcoal hover:bg-gray-300 transition">
                            <h2>Cancel</h2>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CreateShiftPage;
