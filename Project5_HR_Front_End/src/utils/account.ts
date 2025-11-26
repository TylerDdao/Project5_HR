import type { Account, Staff } from "../data/type";

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