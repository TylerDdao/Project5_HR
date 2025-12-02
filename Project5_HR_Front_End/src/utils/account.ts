import { useState } from "react";
import type { ShiftRecord, Staff } from "../data/type";

export function parsedStaff(){
    const staffStr = sessionStorage.getItem("staff");

    if(staffStr){
        const parsedStaff = JSON.parse(staffStr) as Staff;
        return parsedStaff as Staff;
    }
    else{
        return;
    }
}

export function isManager(staff: Staff){
    if(staff.account?.account_type === "manager"){
        return true;
    }
    else{
        return false;
    }
}

export function useSetStaff() {
  const [staff, setStaff] = useState<Staff | null>(null);

  function handleStaff() {
    const staffData = parsedStaff();
    if (staffData) {
      setStaff({
        ...staffData,
        hire_date: staffData.hire_date ? new Date(staffData.hire_date) : undefined,
      });
    } 
    else {
      alert("Something is wrong");
      window.location.href = "/";
    }
  }

  return { staff, handleStaff, setStaff };
}

export function calculateTotalHours (records: ShiftRecord[]){
  let totalMinutes = 0;
  records.forEach(record => {
    if (record.check_in && record.check_out) {
      const checkIn = new Date(record.check_in).getTime();
      const checkOut = new Date(record.check_out).getTime();
      const diffMinutes = (checkOut - checkIn) / (1000 * 60); // difference in minutes
      totalMinutes += diffMinutes;
    }
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return { hours, minutes };
};
