import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import type { Role, Staff } from "../data/type";
import { staffs } from "../data/dummyData";

const navLinks: Record<Role, { name: string; path: string }[]> = {
  Manager: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Schedule", path: "/schedule" },
    { name: "Payroll", path: "/payroll" },
    { name: "Employee Management", path: "/employee_management" },
    { name: "Communication", path: "/communication" },
  ],
  Employee: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Schedule", path: "/schedule" },
    { name: "Payroll", path: "/payroll" },
    { name: "Communication", path: "/communication" },
  ],
};

const NavBar: React.FC = () => {
    const [staff, setCurrentStaff] = useState<Staff>();
    useEffect(()=>{
        setCurrentStaff(staffs[0]);
      })
    
    const role = (staff?.position as Role) || "Manager";
    const name = staff?.name || "Unknown";
  
  
    const links = navLinks[role];
    const location = useLocation(); // ✅ get current URL path

    return (
        <div className="fixed left-0 top-0 w-[400px] h-screen bg-charcoal p-5 flex flex-col">
        <div className="flex items-center justify-center">
            <AssignmentIndIcon className="text-light_gray !text-[37.5px] mr-[10px]" />
            <div className="text-light_gray">
            <h3>{name}</h3>
            <div className="label">Role: {staff?.position}</div>
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
                        ? "bg-accent_blue text-light_gray"
                        : "bg-light_gray text-charcoal hover:bg-gray-300"
                    }`}
                >
                <h3 className={` ${
                    isActive
                        ? "text-light_gray"
                        : "text-charcoal"
                    }`}>{link.name}</h3>
                </Link>
            );
            })}
        </div>

        <div className="flex flex-col justify-end h-full space-y-[10px] items-center mt-auto">
            <div className="p-[10px] bg-light_gray rounded-xl text-center w-fit min-w-[300px] hover:bg-gray-300 transition">
            <h3>My Account</h3>
            </div>
            <div className="p-[10px] bg-light_gray rounded-xl text-center w-fit min-w-[300px] hover:bg-tomato_red hover:text-light_gray transition">
            <h3>Log out</h3>
            </div>
        </div>
        </div>
    );
};

export default NavBar;
