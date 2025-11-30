import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../utils/time';
import NavBar from '../../components/navBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {type Communication, type Staff } from '../../data/type';
import {parsedStaff } from '../../utils/account'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const CommunicationPage: React.FC = () => {
  const [staff, setStaff] = useState<Staff>();
  
  const [recipient, setRecipient] = useState<Staff | null>(null);

  const [staffsList, setStaffsList] = useState<Staff[]>([]);
  const [staffsPage, setStaffsPage] = useState<number>(1);
  const [isNextPage, setIsNextPage] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())

  const [communication, setCommunication] = useState<Communication>()

  //Load staff and account
  useEffect(()=>{
    const staff = parsedStaff()
    if(staff){
      setStaff({...staff, hire_date: staff.hire_date ? new Date(staff.hire_date) : undefined})
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectStaff = (staff: Staff) => {
    if (recipient?.staff_id === staff.staff_id) {
      setRecipient(null); // Unselect
    } else {
      setRecipient(staff)
    }
  };

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

  const handlePostingCommunication = async(type: string)=>{
    if(!staff) return
    if (type == "mail"){
      setCommunication({...communication, type: "mail", recipient_id: Number(recipient?.staff_id)})
    }
    else if (type == "announcement"){
      setCommunication({...communication, type: "announcement", recipient_id: undefined})
    }

    const token = sessionStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_SERVER}/api/create_communication`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            "sender_id": staff.staff_id,
            "recipient_id": communication?.recipient_id,
            "subject": communication?.subject,
            "body": communication?.body,
            "type": communication?.type,
            "sent_at": new Date().toISOString()
          })
      });
      const data = await response.json();
      if(data.success){
        if(data.type == "mail"){
          alert("Mail sent")
        }
        else if(data.type == "announcement"){
          alert("Announcement posted")
        }
      }
  }
  useEffect(() => {
    handleLoadStaffLists();
  }, [staffsPage]);

  return (
    <div className='flex'>
      <div>
        <NavBar/>
      </div>
      <div className='ml-[400px] flex flex-col p-5 w-full'>
        <h1>{extractDate(currentDateTime)} - {extractTime(currentDateTime)}</h1>
        <div className="border border-charcoal w-[100px] my-[30px]"></div>
        
        <div className='flex space-x-[50px] w-full'>
          <div className='flex flex-col space-y-[10px] w-full'>
            <h1>Send a mail</h1>
            <div className='flex flex-col space-y-[5px]'>
              <h3>Subject</h3>
              <input type='text' placeholder='Enter subject' onChange={(e)=>setCommunication({...communication, subject: e.target.value})}/>
            </div>

            <div className='flex flex-col space-y-[5px]'>
              <h3>Body</h3>
              <textarea placeholder='Enter body' onChange={(e)=>setCommunication({...communication, body: e.target.value})}></textarea>
            </div>

            <div className="flex flex-col space-y-[10px]">
              <h2>Receiver</h2>
              <div className="flex flex-col space-y-[10px] mt-[10px]">
                  {staffsList.map((s) => (
                      s.staff_id != staff?.staff_id &&(
                        <div
                          key={s.staff_id}
                          className={`p-2 shadow rounded-[8px] ${
                              recipient?.staff_id === s.staff_id
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
                      )
                  ))}
              </div>
              <h3 className='text-center mt-[10px]'>Page {staffsPage.toString()} / {totalPages.toString()}</h3>
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
            <button className='bg-accent_blue text-light_gray' onClick={()=>handlePostingCommunication("mail")}><h3>Send</h3></button>
            <button className='hover:bg-gray-300 transition' onClick={()=>window.location.href="/communication/my-mail"}><h3>My mail</h3></button>
          </div>

          {staff?.account?.account_type == 'manager' &&(
            <div className='flex flex-col space-y-[10px] w-full'>
            <h1>Post an announcement</h1>
            <div className='flex flex-col space-y-[5px]'>
              <h3>Subject</h3>
              <input type='text' placeholder='Enter subject' onChange={(e)=>setCommunication({...communication, subject: e.target.value})}/>
            </div>

            <div className='flex flex-col space-y-[5px]'>
              <h3>Body</h3>
              <textarea placeholder='Enter body' onChange={(e)=>setCommunication({...communication, body: e.target.value})}></textarea>
            </div>

            <button className='bg-accent_blue text-light_gray' onClick={()=>handlePostingCommunication("announcement")}><h3>Post</h3></button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;
