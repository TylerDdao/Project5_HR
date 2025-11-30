import React, { useEffect, useState } from 'react';
import { caculateWorkTime, extractDate, extractFullDate, extractTime, getCurrentDateTime, getEndOfNextWeekDate, getEndOfWeekDate, getStartOfNextWeekDate, getStartOfWeekDate, getTodayWeekDay } from '../../../utils/time';
import NavBar from '../../../components/navBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {type Communication, type Staff } from '../../../data/type';
import {parsedStaff, useSetStaff } from '../../../utils/account'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const MailPage: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())
  const [sentMails, setSentMails] = useState<Communication[]>([])
  const [receivedMails, setReceivedMails] = useState<Communication[]>([])
  const { staff, handleStaff } = useSetStaff();
  useEffect(() => {
    handleStaff();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSentMail = async() =>{
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_SERVER}/api/get_mails?staff_id=${staff?.staff_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
    });
    const data = await response.json()
    if(data.success){
      setSentMails(data.sent_mails)
      setReceivedMails(data.received_mails)
    }
  }

  useEffect(()=>{
    if(!staff) return
    fetchSentMail()
  }, [staff])

  return (
    <div className='flex'>
      <div>
        <NavBar/>
      </div>
      <div className='ml-[400px] flex flex-col p-5 w-full'>
        <h1>{extractDate(currentDateTime)} - {extractTime(currentDateTime)}</h1>
        <div className="border border-charcoal w-[100px] my-[30px]"></div>
        <div className='flex space-x-[30px] w-full'>
          <div className='flex space-x-[50px] w-full'>
            <div className='flex flex-col space-y-[10px]'>
              <h2>Received mails</h2>
              {receivedMails.length>0?(
                receivedMails.map((mail)=>(
                  <div key={mail.communication_id} className='p-5 shadow-md rounded-[8px] text-charcoal'>
                    <h3>{mail.subject}</h3>
                    <p>{mail.body}</p>
                    <div className='caption'>Sent at: {extractFullDate(mail.sent_at)} from {mail.sender_name}</div>
                  </div>
                ))
              ):(
                <div className='text-medium_gray'>No mail <span className="material-symbols-outlined">chat_dashed</span></div>
              )}
            </div>
          </div>

          <div className='flex space-x-[50px] w-full'>
            <div className='flex flex-col space-y-[10px]'>
              <h2>Sent mails</h2>
              {sentMails.length>0?(
                sentMails.map((mail)=>(
                  <div key={mail.communication_id} className='p-5 shadow-md rounded-[8px] text-charcoal'>
                    <h3>{mail.subject}</h3>
                    <p>{mail.body}</p>
                    <div className='caption'>Sent at: {extractFullDate(mail.sent_at)} to {mail.recipient_name}</div>
                  </div>
                ))
              ):(
                <div className='text-medium_gray'>No mail <span className="material-symbols-outlined">chat_dashed</span></div>
              )}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default MailPage;
