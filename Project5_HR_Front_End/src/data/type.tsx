export type Shift = {
    shift_id: string | number,
    start_time: Date,
    end_time: Date
}

export type Staff = {
    staff_id?: string | number,
    hire_date?: Date,
    phone_number?: string,
    name?: string,
    position?: string,
    is_working?: boolean,
    account?: Account,
    wage_rate?: number
}

export type Account = {
    account_type?: string,
    password?: string
}

export type ShiftStaff = {
    shift_id: string | number,
    staff_id: string | number
}

export type Payroll = {
    payroll_id: string | number,
    staff_id: string | number,
    wage_rate: number,
    hours_worked: number,
    bonus: number,
    deduction: number,
    start_date: Date,
    end_date: Date,
    receiver?: string,
    created_at: Date,
    is_canceled: boolean
}

export type ShiftRecord = {
    shift_record_id?: number
    shift_id?: number,
    staff_id?: number,
    check_in?: Date,
    check_out?: Date | undefined
}

export type Communication = {
    communication_id?: number,
    sender_id?: number,
    sender_name?: string | undefined,
    recipient_id?: number | undefined,
    recipient_name?: string | undefined,
    subject?: string,
    body?: string,
    type?: string,
    sent_at?: Date
    
}

export type AccountType = "manager" | "employee";