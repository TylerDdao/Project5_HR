import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay, toUTCString } from '../../../utils/time';
import NavBar from '../../../components/navBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import type { Account, Shift, Staff } from '../../../data/type';
import { Link, useParams } from 'react-router-dom';
import { parsedAccountandStaff } from '../../../utils/account';

const ShiftDetailPage: React.FC = () => {
    const {shiftId} = useParams<{ shiftId: string }>()
    const [shift, setShift] = useState<Shift>();
    const [isActive, setIsActive] = useState<Boolean>(false)
    const [isDone, setIsDone] = useState<Boolean>(false);
    const [associatedStaffs, setAssociatedStaffs] = useState<Staff[]>();
    const [hasStaffs, setHasStaffs] = useState<Boolean>(true);

    const [staffsList, setStaffsList] = useState<Staff[] | []>([]);
    const [staffsPage, setStaffsPage] = useState<number>(1);
    const [isNextPage, setIsNextPage] = useState<Boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [staff, setStaff] = useState<Staff>();
    const [account, setAccount] = useState<Account>();

    const [updatedShift, setUpdatedShift] = useState<Shift>();

    const [removedStaffs, setRemovedStaffs] = useState<Staff[]>([]);
    const [newlyAddedStaffs, setNewlyAddedStaffs] = useState<Staff[]>([]);

   const handleShiftChange = async () => {
        if(updatedShift?.start_time && updatedShift.end_time){
            if(updatedShift?.start_time.getTime() >= updatedShift?.end_time.getTime()){
                alert("Shift end time must be after start time");
                return
            }   
        }
        try {
            const removedIDs = removedStaffs.map(s => s.staff_id);
            const finalStaffList = (associatedStaffs ?? [])
            .filter(s => !removedIDs.includes(s.staff_id))
            .concat(newlyAddedStaffs ?? []);

            const assignedIds = finalStaffList.map(staff=>staff.staff_id)

            const token = sessionStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_SERVER}/api/update_shift?shift_id=${shift?.shift_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                        start_time: toUTCString(updatedShift?.start_time),
                        end_time: toUTCString(updatedShift?.end_time),
                        staffs: assignedIds,
                    }),
                }
            );

            const result = await response.json();

            if (response.ok && result.success) {
                alert("Shift Updated");
                window.location.href = "/schedule/shift-list";
            }
        } catch (err) {
            console.error("Error updating shift:", err);
        }
    };


    const handleAddStaffs = async (staff:Staff) =>{
        if (newlyAddedStaffs.some(s => s.staff_id === staff.staff_id)) {
            setNewlyAddedStaffs(prev =>
                prev.filter(s => s.staff_id !== staff.staff_id)
            );
        } else {
            setNewlyAddedStaffs(prev => [...prev, staff]);
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

    const handleDeleteStaff = async (staff:Staff) =>{
        const isRemoved = removedStaffs.includes(staff)
        if(!isRemoved){
            setRemovedStaffs(prev => [...prev, staff]);
        }
    }

    const handleUndoDeleteStaff = async (staff:Staff) =>{
        const undo = removedStaffs.filter((s)=>(s.staff_id != staff.staff_id))
        setRemovedStaffs(undo);
    }

    useEffect(() => {
        const handleLoadingShiftDetail = async () => {
            try {
                const token = sessionStorage.getItem("token");

                const response = await fetch(`${import.meta.env.VITE_SERVER}/api/shift_detail?shift_id=${shiftId}`, {
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
                const shiftWithDate = {
                    ...shiftData,
                    start_time: new Date(shiftData.start_time),
                    end_time: new Date(shiftData.end_time)
                };
                setShift(shiftWithDate);
                setUpdatedShift(shiftWithDate);
                setAssociatedStaffs(staffs);

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
        // Load account and staff
        const parsedAccount = parsedAccountandStaff()?.parsedAccount
        const parsedStaff = parsedAccountandStaff()?.parsedStaff
        if(parsedAccount && parsedStaff){
            if(parsedAccount.account_type != "Manager"){
                alert("You don't have permission!");
                window.location.href = "/dashboard";
            }
            setAccount(parsedAccount)
            setStaff({
                ...parsedStaff,
                hire_date: parsedStaff.hire_date ? new Date(parsedStaff.hire_date) : undefined
            })
        }
        else{
            alert("Something is wrong");
            window.location.href = "/";
        }

        handleLoadingShiftDetail()
    }, []);

    useEffect(() => {
        if(!shift) return;
        if(shift.end_time.getTime() < new Date().getTime()){
            setIsDone(true);
        }
        else{
            const checkActive = () => {
            const now = new Date();
            return shift.start_time.getTime() <= now.getTime() && now.getTime() < shift.end_time.getTime();
        };

        setIsActive(checkActive());
        const timer = setInterval(() => setIsActive(checkActive()), 1000);
        return () => clearInterval(timer);
        }
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
                    <h2>Shift ID: {shift?.shift_id}</h2>
                    {isActive ? (
                        <div>Status: Active</div>
                    ):(
                        isDone ? (
                            <div>Status: Done</div>
                        ):(
                            <div>Status: Scheduled</div>
                        )
                    )}
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    {shift?.start_time != updatedShift?.start_time?(
                        <h2 className='text-tomato_red'>Start Time (Unsaved)</h2>
                    ):(
                        <h2>Start Time</h2>
                    )}
                    {isActive || isDone ?(
                        <div className='flex space-x-[10px]'>
                            <div className='p-[5px] shadow rounded rounded-md' onClick={()=>{alert("You can't modify an active shift or a done shift")}}><p>{extractFullDate(shift?.start_time)}</p></div>
                            <div className='p-[5px] shadow rounded rounded-md' onClick={()=>{alert("You can't modify an active shift or a done shift")}}><p>{extractTime(shift?.start_time)}</p></div>
                        </div>
                    ):(
                        <div className='flex space-x-[10px]'>
                            <div className='flex flex-col space-y-[10px]'>
                                {shift?.start_time != updatedShift?.start_time && (
                                    <h3>Current start time: {extractFullDate(shift?.start_time)} - {extractTime(shift?.start_time)}</h3>
                                )}
                                <div>
                                    <input id='start_time' className='w-fit bg-charcoal text-light_gray' type='datetime-local' defaultValue={shift? new Date(shift.start_time).toISOString().slice(0, 16):''} onChange={(e)=>setUpdatedShift({...updatedShift!, start_time: new Date(e.target.value)})}/>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className='flex flex-col space-y-[5px]'>
                    {shift?.end_time != updatedShift?.end_time?(
                        <h2 className='text-tomato_red'>End Time (Unsaved)</h2>
                    ):(
                        <h2>End Time</h2>
                    )}
                    {isActive || isDone ?(
                        <div className='flex space-x-[10px]'>
                            <div className='p-[5px] shadow rounded rounded-md' onClick={()=>{alert("You can't modify an active shift or a done shift")}}><p>{extractFullDate(shift?.end_time)}</p></div>
                            <div className='p-[5px] shadow rounded rounded-md' onClick={()=>{alert("You can't modify an active shift or a done shift")}}><p>{extractTime(shift?.end_time)}</p></div>
                        </div>
                    ):(
                        <div className='flex space-x-[10px]'>
                            <div className='flex flex-col space-y-[10px]'>
                                {shift?.end_time != updatedShift?.end_time && (
                                    <h3>Current end time: {extractFullDate(shift?.end_time)} - {extractTime(shift?.end_time)}</h3>
                                )}
                                <div>
                                    <input id='end_time' className='w-fit bg-charcoal text-light_gray' type='datetime-local' defaultValue={shift? new Date(shift.end_time).toISOString().slice(0, 16):''} onChange={(e)=>setUpdatedShift({...updatedShift!, end_time: new Date(e.target.value)})}/>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className='flex flex-col space-y-[10px]'>
                    {removedStaffs.length > 0 ?(
                        <h2 className='text-tomato_red'>Assigned Staffs (Unsaved)</h2>
                    ):(
                        <h2>Assigned Staffs</h2>
                    )}
                    {associatedStaffs && associatedStaffs?.length > 0 ?(
                        associatedStaffs.map((staff)=>(
                            <div className='flex items-center space-x-[10px]' key={staff.staff_id}>
                                {removedStaffs.includes(staff)?(
                                    <div className='p-2 shadow rounded-[8px] bg-medium_gray text-light_gray'>
                                        <div className='flex items-center space-x-[10px]'>
                                            <AccountCircleIcon fontSize='large'/>
                                            <div>
                                                <h3>{staff.name} (Removed)</h3>
                                                <p>{staff.position}</p>
                                            </div>
                                        </div>
                                    </div>
                                ):(
                                    <div className='p-2 shadow rounded-[8px]'>
                                        <div className='flex items-center space-x-[10px]'>
                                            <AccountCircleIcon fontSize='large'/>
                                            <div>
                                                <h3>{staff.name}</h3>
                                                <p>{staff.position}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {!isActive && !isDone  && (
                                    !removedStaffs.includes(staff) ? (
                                        <button className='flex flex-col p-2 items-center bg-tomato_red rounded-[8px]' onClick={()=>{handleDeleteStaff(staff)}}>
                                            <span className="material-symbols-outlined text-light_gray" style={{ fontSize: '40' }}>cancel</span>
                                        </button>
                                    ):(
                                        <button className='flex flex-col p-2 items-center bg-light_gray rounded-[8px]' onClick={()=>{handleUndoDeleteStaff(staff)}}>
                                            <span className="material-symbols-outlined text-charcoal" style={{ fontSize: '40' }}>undo</span>
                                        </button>
                                    )
                                )}
                            </div>
                        ))
                    ):(
                        hasStaffs ? (
                            <h3>Loading staffs...</h3>
                        ):(
                            <h3>No staff were assigned to this shift</h3>
                        )
                    )}
                    {!isActive && !isDone &&(
                        <button className='bg-accent_blue text-light_gray' onClick={handleLoadStaffLists}><h3>Add Staff</h3></button>
                    )}
                </div>
            </div>

            {!isActive && !isDone && (
                <div className='flex space-x-[30px] mt-[50px]'>
                    <button className='bg-forest_green text-light_gray' onClick={handleShiftChange}><h2>Save</h2></button>
                    <Link to={'/schedule/shift-list'}><button className='text-charcoal'><h2>Cancel</h2></button></Link>
                    <button className='bg-tomato_red text-light_gray'><h2>Delete</h2></button>
                </div>
            )}

        </div>

        {staffsList.length >0 && (
            <div className='p-5 flex flex-col '>
                <h2>Staff List | Assigning: {newlyAddedStaffs.length} staffs</h2>
                <p>Assign staffs for shift #{shift?.shift_id}</p>
                <div className='flex flex-col space-y-[10px] mt-[10px]'>
                    {staffsList.map((staff)=>(
                        associatedStaffs?.some(s => s.staff_id === staff.staff_id) ?(
                            <div className='p-2 shadow rounded-[8px] bg-medium_gray text-light_gray'>
                                <div className='flex items-center space-x-[10px]'>
                                    <AccountCircleIcon fontSize='large'/>
                                    <div>
                                        <h3>{staff.name} (Unavailable)</h3>
                                        <p>{staff.position}</p>
                                    </div>
                                </div>
                            </div>
                        ):(
                            newlyAddedStaffs.some(s => s.staff_id === staff.staff_id) ? (
                                <div className='p-2 shadow rounded-[8px] bg-accent_blue text-light_gray' onClick={()=>{handleAddStaffs(staff)}}>
                                    <div className='flex items-center space-x-[10px]'>
                                        <AccountCircleIcon fontSize='large'/>
                                        <div>
                                            <h3>{staff.name}</h3>
                                            <p>{staff.position}</p>
                                        </div>
                                    </div>
                                </div>
                            ):(
                                <div className='p-2 shadow rounded-[8px]' onClick={()=>{handleAddStaffs(staff)}}>
                                    <div className='flex items-center space-x-[10px]'>
                                        <AccountCircleIcon fontSize='large'/>
                                        <div>
                                            <h3>{staff.name}</h3>
                                            <p>{staff.position}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    ))}
                </div>
                <div className='mt-[30px]'>
                    <h3 className='text-center'>Page {staffsPage.toString()} / {totalPages.toString()}</h3>
                    <div className='flex justify-between'>
                        {staffsPage > 1 ? (
                                <button><span className="material-symbols-outlined">chevron_left</span></button>
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
                <button className='mt-[30px]' onClick={()=>{setStaffsList([])}}><h3>Cancel assigning staffs</h3></button>
            </div>
        )}
    </div>
    );
};

export default ShiftDetailPage;
