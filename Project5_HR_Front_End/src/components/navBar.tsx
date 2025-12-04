import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import type { Account, AccountType, Staff } from "../data/type";
import { parsedStaff } from "../utils/account";

const navLinks: Record<AccountType, { name: string; path: string }[]> = {
  manager: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Schedule", path: "/schedule" },
    { name: "Payroll", path: "/payroll" },
    { name: "Staff Management", path: "/staff" },
    { name: "Communication", path: "/communication" },
  ],
  employee: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Schedule", path: "/schedule" },
    { name: "Payroll", path: "/payroll" },
    { name: "Communication", path: "/communication" },
  ],
};

const NavBar: React.FC = () => {
    const [staff, setCurrentStaff] = useState<Staff>();
    useEffect(()=>{
        const staff = parsedStaff();
        if(staff){
          setCurrentStaff({...staff, hire_date: staff.hire_date ? new Date(staff.hire_date) : undefined})
        }
    }, [])
    
    const role = (staff?.account?.account_type as AccountType) || "employee";
    const name = staff?.name || "Unknown";
    const links = navLinks[role];
    const location = useLocation();

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = "/";
      };

    return (
        <div className="fixed left-0 top-0 w-[400px] h-screen bg-charcoal p-5 flex flex-col">
        <div className="flex items-center justify-center">
            <AssignmentIndIcon className="text-light_gray !text-[37.5px] mr-[10px]" />
            <div className="text-light_gray">
            <h3>{name}</h3>
            {staff?.account?.account_type == "manager" ? (
              <div className="label">Permission: Manager</div>
            ):(
              staff?.account?.account_type == "employee" ? (
                <div className="label">Permission: Employee</div>
              ):(
                <div className="label">Permission: Undefined</div>
              )
            )}
            <div className="label">Position: {staff?.position}</div>
            </div>
        </div>

        <div className="border border-light_gray w-full my-[30px]"></div>

        <div className="flex flex-col space-y-[10px] justify-center items-center">
            {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
                <Link
                key={link.path}
                to={link.path}
                className={`p-[10px] rounded-xl text-center w-fit min-w-[300px] transition 
                    ${
                    isActive
                        ? "bg-accent_blue"
                        : "bg-light_gray hover:bg-gray-300"
                    }`}
                >
                <h3 className={`${isActive ? "text-light_gray" : "text-charcoal"}`}>{link.name}</h3>
                </Link>
            );
            })}
        </div>

        <div className="flex flex-col justify-end h-full space-y-[10px] items-center mt-auto">
            <button
              className='bg-light_gray hover:bg-gray-300 transition w-full ' 
              onClick={()=>window.location.href='/my-account'}
            >
              <h3 className='text-charcoal'>My Account</h3>
            </button>

            <button
              className='bg-accent_blue w-full'
              onClick={handleLogout}
            >
              <h3 className='text-light_gray'>Log Out</h3>
            </button>
        </div>
        </div>
    );
};

export default NavBar;
