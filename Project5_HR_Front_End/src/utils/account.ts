import type { Account, Staff } from "../data/type";

export function parsedAccountandStaff(){
    const accountStr = sessionStorage.getItem("account");
    const staffStr = sessionStorage.getItem("staff");

    if(accountStr && staffStr){
        const parsedAccount = JSON.parse(accountStr) as Account;
        const parsedStaff = JSON.parse(staffStr) as Staff;
        return {parsedAccount, parsedStaff};
    }
    else{
        return;
    }
}