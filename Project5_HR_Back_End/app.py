from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from dotenv import load_dotenv
import os

from header.utils.shifts_db import ShiftsDatabase
from header.utils.staffs_db import StaffsDatabase
from header.utils.shift_records_db import ShiftRecordDatabase
from header.utils.payrolls_db import PayrollDatabase
from header.utils.communications_db import CommunicationsDatabase


from header.core.staff import Staff
from header.core.account import Account
from header.core.shift import Shift
from header.core.shift_record import ShiftRecord
from header.core.payroll import Payroll
from header.core.communication import Communication

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY") | "secret"
ISSUER = os.getenv("ISSUER") | "project5_hr"

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Utility functions
def token_checker(auth_header):
    if not auth_header or not auth_header.startswith("Bearer "):
        return False
    token = auth_header[7:]
    try:
        jwt.decode(token, SECRET_KEY, algorithms=["HS256"], issuer=ISSUER)
        return True
    except jwt.PyJWTError:
        return False

def token_decoder(auth_header):
    token = auth_header[7:]
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"], issuer=ISSUER)
    return payload

# Routes
@app.route("/")
def home():
    return "Hello world, backend is up!"

@app.route("/token", methods=["GET"])
def get_token():
    payload = {
        "staff": {
            "staff_id": 1,
            "name": "Tyler",
            "hire_date": "2025-10-31",
            "phone_number": "5481234567",
            "account": {
                "account_id": 1,
                "account_type": "manager"
            },
        },
        "iss": ISSUER
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    payload["token"] = token
    return jsonify({"success": True, "message": "Login successful", **payload}), 200

@app.route("/api/login", methods=["POST"])
def login():
    try:
        db = StaffsDatabase()
        data = request.json
        staff_id = data.get("staff_id")
        password = data.get("password")

        staff = db.verify_login(staff_id, password)
        if staff is not None:
            payload = {
                "staff": staff,
                "iss": ISSUER
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            payload["token"] = token
            return jsonify({"success": True, **payload}), 200

        else:
            return jsonify({"success": False, "message": "Invalid staff ID or password"}), 401

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Shifts 
@app.route("/api/shift_detail", methods=["GET"])
def get_shift_detail():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403

    shift_id = request.args.get("shift_id", type=int)
    status = request.args.get("status", type=str)
    try:
        db = ShiftsDatabase()
        if shift_id is None:
            if status == "done":
                done_shift = db.get_done_shifts()
                payload = {
                    "done_shifts": done_shift,
                }
                return jsonify({"success": True, **payload}), 200
            else:
                active_shifts = db.get_active_shifts()
                scheduled_shifts = db.get_scheduled_shifts()
                payload = {
                    "active_shifts": active_shifts,
                    "scheduled_shifts": scheduled_shifts
                }
                return jsonify({"success": True, **payload}), 200
        else:
            shift = db.get_shift_by_id(shift_id)
            payload = {
                "shift": shift,
            }
            return jsonify({"success": True, **payload}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route("/api/assigned_shifts", methods=["GET"])
def get_assigned_shifts():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    staff_id = request.args.get("staff_id", type=int)

    if not staff_id:
        return jsonify({"success": False, "message": "Missing staff ID"}), 400
    
    try:
        db = ShiftsDatabase()
        shifts = db.get_assigned_shifts(staff_id)
        if not shifts:
            return jsonify({"success": False, "message": "Shifts not found"}), 404

        return jsonify({
            "success": True,
            # "active_shitfs": shifts["active_shifts"] or [],
            "this_week_shifts": shifts["this_week_shifts"],
            "next_week_shifts": shifts["next_week_shifts"] or []
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route("/api/create_shift" ,methods=["POST"])
def create_shift():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403

    decoded = token_decoder(auth)
    staff_info = decoded.get("staff")
    account_info = staff_info.get("account")
    account_type = account_info.get("account_type")
    if account_type!="manager":
        return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401
    
    try:
        data = request.json
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        staff_ids = data.get("staffs")

        if start_time is None or end_time is None or staff_ids is None:
            return jsonify({"success": False, "message": "Missing shift information"}), 404
        
        db = ShiftsDatabase()
        shift = Shift(start_time=start_time, end_time=end_time, staffs=staff_ids)
        shift_id = db.insert_shift(shift=shift)
        return jsonify({"success": True, "shift_id": shift_id}), 200
    except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500


@app.route("/api/update_shift", methods=["PUT"])
def update_shift():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    decoded = token_decoder(auth)
    staff = decoded.get("staff")
    account_info = staff.get("account")
    account_type = account_info.get("account_type")
    if account_type!="manager":
        return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401

    shift_id = request.args.get("shift_id")
    if  shift_id is None:
        return jsonify({"success": False, "message": "Missing shift ID"}), 400
    
    data = request.json

    start_time = data.get("start_time")
    end_time = data.get("end_time")
    staff_ids = data.get("staffs")

    if start_time is None or end_time is None:
        return jsonify({"success": False, "message": "Missing Infomation"}), 400

    try:
        shift = Shift(shift_id=shift_id, start_time=start_time, end_time=end_time,staffs=staff_ids)
        db = ShiftsDatabase()
        ok = db.update_shift(shift=shift)
        if ok:
            shift_data={
                "shift_id": shift.get_shift_id(),
                "start_time": shift.get_start_time(),
                "end_time": shift.get_end_time(),
                "staffs": shift.get_staffs()
            }
            return jsonify({"success": True, "shift":shift_data}), 200
        else:
            return jsonify({"success": False, "message": "Database Error"}), 500

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    
# Staffs
@app.route("/api/get_staffs", methods=["GET"])
def get_staffs():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    page = request.args.get("page", type=int)
    if page is None:
        return jsonify({"success": False, "message": "Missing page"}), 400
    
    try:
        db = StaffsDatabase()
        total = db.get_total_staffs()
        if total < 100:
            totalPage = 1
        else:
            totalPage = total/100
        staffsList = db.get_staffs(page)   
        return jsonify({
            "success": True,
            "staffs": staffsList or [],
            "total_page": int(totalPage)
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/clock_in", methods=["PUT"])
def set_clock_in():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    data = request.json
    staff_id = data.get("staff_id")
    check_in = data.get("check_in")
    if staff_id is None and check_in is None:
        return jsonify({"success": False, "message": "Missing information"}), 400
    
    try:
        staff_db = StaffsDatabase()
        staff_ok = staff_db.set_clock_in(staff_id=staff_id)

        record = ShiftRecord(staff_id=staff_id, check_in=check_in)

        shift_record_db = ShiftRecordDatabase()
        shift_record_id = shift_record_db.start_shift_record(record)

        if staff_ok and shift_record_id:
            return jsonify({
                "success": True,
                "shift_record_id": shift_record_id,
            }), 200
        else:
            return jsonify({
                "success": False,
            }), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500


@app.route("/api/clock_out", methods=["PUT"])
def set_clock_out():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    data = request.json
    staff_id = data.get("staff_id")
    shift_record_id = data.get("shift_record_id")
    check_out = data.get("check_out")
    if staff_id is None or check_out is None:
        return jsonify({"success": False, "message": "Missing information"}), 400
    
    try:
        staff_db = StaffsDatabase()
        staff_ok = staff_db.set_clock_out(staff_id=staff_id)

        record = ShiftRecord(shift_record_id=shift_record_id ,staff_id=staff_id, check_out=check_out)
        print(record.get_check_out())

        shift_record_db = ShiftRecordDatabase()
        shift_record_ok = shift_record_db.end_shift_record(record)

        if staff_ok and shift_record_ok is not None:
            return jsonify({
                "success": True,
            }), 200
        else:
            return jsonify({
                "success": False,
            }), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/this_week_shift_records", methods=["GET"])
def get_this_week_shift_records():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    staff_id = request.args.get("staff_id")

    if staff_id is None:
        return jsonify({"success": False, "message": "Missing staff ID"}), 400
    
    try:
        shift_record_db = ShiftRecordDatabase()
        shift_records = shift_record_db.get_this_week_shift_records(staff_id=staff_id)

        return jsonify({
            "success": True,
            "shift_records": shift_records
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

# Payrolls
@app.route("/api/my_payrolls",methods = ["GET"])
def get_my_payrolls():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    staff_id = request.args.get("staff_id")

    if staff_id is None:
        return jsonify({"success": False, "message": "Missing staff ID"}), 400
    
    try:
        db = PayrollDatabase()

        payrolls = db.get_my_payroll(staff_id=staff_id)

        return jsonify({
            "success": True,
            "this_month_payrolls": payrolls["this_month"],
            "all_payrolls": payrolls["all"]
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/payroll_detail",methods = ["GET"])
def get_payroll_detail():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    payroll_id = request.args.get("payroll_id")

    if payroll_id is None:
        return jsonify({"success": False, "message": "Missing payroll ID"}), 400
    
    try:
        db = PayrollDatabase()

        payroll = db.get_payroll_by_id(payroll_id=payroll_id)

        return jsonify({
            "success": True,
            "payroll": payroll,
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/cancel_payroll",methods = ["DELETE"])
def cancel_payroll():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    payroll_id = request.args.get("payroll_id")

    if payroll_id is None:
        return jsonify({"success": False, "message": "Missing payroll ID"}), 400
    
    try:
        db = PayrollDatabase()
        ok = db.cancel_payroll(payroll_id=payroll_id)
        if ok:
            return jsonify({
                "success": True,
            }), 200
        else:
            return jsonify({
                "success": False,
            }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/create_payroll",methods = ["POST"])
def create_payroll():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    decoded = token_decoder(auth)
    staff_info = decoded.get("staff")
    account_info = staff_info.get("account")
    account_type = account_info.get("account_type")
    if account_type!="manager":
        return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401
    
    data = request.json
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    staff_id = data.get("staff_id")
    wage_rate = data.get("wage_rate")
    hours_worked = data.get("hours_worked")
    bonus = data.get("bonus")
    deduction = data.get("deduction")
    if start_date is None or end_date is None or staff_id is None:
        return jsonify({"success": False, "message": "Missing information"}), 400
    
    try:
        payroll = Payroll()
        payroll.set_start_date(start_date)
        payroll.set_end_date(end_date)
        payroll.set_staff_id(staff_id)
        payroll.set_bonus(bonus)
        payroll.set_wage_rate(wage_rate)
        payroll.set_hours_worked(hours_worked)
        payroll.set_deduction(deduction)
        db = PayrollDatabase()
        id = db.insert_payroll(payroll)
        if id is not None:
            return jsonify({
                "success": True,
                "payroll_id": id
            }), 200
        else:
            return jsonify({
                "success": False,
            }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/calculate_salary",methods = ["POST"])
def calculate_salary():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    data = request.json
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    staff_id = data.get("staff_id")

    if start_date is None or end_date is None or staff_id is None:
        return jsonify({"success": False, "message": "Missing information"}), 400
    
    try:
        staff_db = StaffsDatabase()
        record_db = ShiftRecordDatabase()

        staff = staff_db.get_staff_by_id(staff_id=staff_id)
        records = record_db.get_shift_records_in_range(staff_id=staff_id, start_date=start_date, end_date=end_date)

        total_seconds = 0
        for record in records:
            check_in = record.get("check_in")
            check_out = record.get("check_out")

            # Skip if check_out is missing
            if not check_in or not check_out:
                continue

            duration = check_out - check_in  # timedelta object
            total_seconds += duration.total_seconds()

        total_hours = total_seconds / 3600  # convert seconds → hours
        return jsonify({
            "success": True,
            "hours_worked": total_hours,
            "wage_rate": staff["wage_rate"]
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/get_all_payrolls",methods = ["GET"])
def get_all_payrolls():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    print(f"Decoding token: '{auth}'")
    decoded = token_decoder(auth)
    staff_info = decoded.get("staff")
    account_info = staff_info.get("account")
    account_type = account_info.get("account_type")
    if account_type!="manager":
        return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401
    
    try:
        db = PayrollDatabase()
        payrolls = db.get_all_payrolls()
        return jsonify({
            "success": True,
            "payrolls": payrolls
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/create_communication",methods = ["POST"])
def create_communication():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    data = request.json
    if(data.get("type") == "announcement"):
        decoded = token_decoder(auth)
        staff_info = decoded.get("staff")
        account_info = staff_info.get("account")
        account_type = account_info.get("account_type")
        if account_type!="manager":
            return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401
    
        try:
            announcement = Communication()
            sender_id = data.get("sender_id")
            subject = data.get("subject")
            body = data.get("body")
            type = "announcement"
            sent_at = data.get("sent_at")
            announcement.set_sender_id(sender_id)
            announcement.set_subject(subject)
            announcement.set_body(body)
            announcement.set_type(type)
            announcement.set_sent_at(sent_at)
            db = CommunicationsDatabase()
            id = db.insert_communication(announcement)
            if id is not None:
                return jsonify({
                    "success": True,
                    "communication_id": id,
                    "type": "announcement"
                }), 200
            
            return jsonify({
                "success": False,
            }), 400
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500
        
    elif(data.get("type") == "mail"):
        try:
            mail = Communication()
            sender_id = data.get("sender_id")
            recipient_id = data.get("recipient_id")
            subject = data.get("subject")
            body = data.get("body")
            type = "mail"
            sent_at = data.get("sent_at")
            mail.set_sender_id(sender_id)
            mail.set_recipient_id(recipient_id)
            mail.set_subject(subject)
            mail.set_body(body)
            mail.set_type(type)
            mail.set_sent_at(sent_at)
            db = CommunicationsDatabase()
            id = db.insert_communication(mail)
            if id is not None:
                return jsonify({
                    "success": True,
                    "communication_id": id,
                    "type": "mail"
                }), 200
            
            return jsonify({
                "success": False,
            }), 400
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route("/api/get_announcements",methods = ["GET"])
def get_announcements():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    try:
        db = CommunicationsDatabase()
        announcements = db.get_announcements()
        return jsonify({
            "success": True,
            "announcements": announcements
        }), 200

    except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/get_mails",methods = ["GET"])
def get_mails():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    staff_id = request.args.get("staff_id")
    if staff_id is None:
        return jsonify({"success": False, "message": "Missing information"}), 400

    try:
        db = CommunicationsDatabase()
        sent_mails = db.get_sent_mail(staff_id=staff_id)
        received_mails = db.get_received_mail(staff_id=staff_id)
        return jsonify({
            "success": True,
            "sent_mails": sent_mails,
            "received_mails": received_mails
        }), 200

    except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/add_staff",methods = ["POST"])
def add_staff():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    decoded = token_decoder(auth)
    staff_info = decoded.get("staff")
    account_info = staff_info.get("account")
    account_type = account_info.get("account_type")
    if account_type!="manager":
        return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401
    
    data =request.json

    name = data.get("name")
    phone_number = data.get("phone_number")
    wage_rate = data.get("wage_rate")
    position = data.get("position")
    hire_date = data.get("hire_date")
    password = data.get("password")
    account_type = data.get("account_type")
    if name is None or phone_number is None or wage_rate is None or position is None or hire_date is None or password is None:
        return jsonify({"success": False, "message": "Missing information"}), 400

    try:
        staff = Staff(name=name, position=position, phone_num=phone_number, hire_date=hire_date, wage_rate=wage_rate, password=password)
        if account_type is None:
            staff.set_account_type("employee")
        else:
            staff.set_account_type(account_type=account_type)
        db = StaffsDatabase()
        id = db.insert_staff(staff)
        if id is not None:
            return jsonify({
                "success": True,
                "staff_id": id,
            }), 200
        else:
            return jsonify({
                "success": False,
            }), 200

    except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route("/api/update_staff",methods = ["PUT"])
def update_staff():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    decoded = token_decoder(auth)
    staff_info = decoded.get("staff")
    account_info = staff_info.get("account")
    account_type = account_info.get("account_type")
    if account_type!="manager":
        return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401
    
    data =request.json

    staff_id = data.get("staff_id")
    name = data.get("name")
    phone_number = data.get("phone_number")
    wage_rate = data.get("wage_rate")
    position = data.get("position")
    hire_date = data.get("hire_date")
    password = data.get("password")
    account_type = data.get("account_type")
    if name is None or phone_number is None or wage_rate is None or position is None or hire_date is None or password is None:
        return jsonify({"success": False, "message": "Missing information"}), 400

    try:
        staff = Staff(staff_id=staff_id, name=name, position=position, phone_num=phone_number, hire_date=hire_date, wage_rate=wage_rate, password=password)
        if account_type is None:
            staff.set_account_type("employee")
        else:
            staff.set_account_type(account_type=account_type)
        db = StaffsDatabase()
        id = db.update_staff(staff)
        if id is not None:
            return jsonify({
                "success": True,
            }), 200
        else:
            return jsonify({
                "success": False,
            }), 200

    except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/get_staff",methods = ["GET"])
def get_staff():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403

    staff_id = request.args.get("staff_id")
    if staff_id is None:
        return jsonify({"success": False, "message": "Missing staff ID"}), 400

    try:
        db = StaffsDatabase()
        staff = db.get_staff_by_id(staff_id=staff_id)
        return jsonify({
                "success": True,
                "staff": staff
            }), 200

    except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/delete_staff",methods = ["DELETE"])
def delete_staff():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    decoded = token_decoder(auth)
    staff_info = decoded.get("staff")
    account_info = staff_info.get("account")
    account_type = account_info.get("account_type")
    if account_type!="manager":
        return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401

    staff_id = request.args.get("staff_id")
    if staff_id is None:
        return jsonify({"success": False, "message": "Missing staff ID"}), 400

    try:
        db = StaffsDatabase()
        ok = db.delete_staff(staff_id=staff_id)
        if ok:
            return jsonify({
                "success": True,
            }), 200
        else:
            return jsonify({
                "success": False,
            }), 200

    except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/delete_shift",methods = ["DELETE"])
def delete_shift():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    decoded = token_decoder(auth)
    staff_info = decoded.get("staff")
    account_info = staff_info.get("account")
    account_type = account_info.get("account_type")
    if account_type!="manager":
        return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401

    shift_id = request.args.get("shift_id")
    if shift_id is None:
        return jsonify({"success": False, "message": "Missing shift ID"}), 400

    try:
        db = ShiftsDatabase()
        ok = db.delete_shift(shift_id=shift_id)
        if ok:
            return jsonify({
                "success": True,
            }), 200
        else:
            return jsonify({
                "success": False,
            }), 200

    except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500
    
@app.route("/api/update_password",methods = ["PUT"])
def update_password():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    
    data = request.json
    staff_id = data.get("staff_id")
    old_password = data.get("old_password")
    new_password = data.get("new_password")
    
    decoded = token_decoder(auth)
    staff_info = decoded.get("staff")
    if int(staff_info.get("staff_id"))!=int(staff_id):
        return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401

    try:
        db = StaffsDatabase()
        ok = db.update_password(staff_id=staff_id, old_password=old_password, new_password=new_password)
        if ok:
            return jsonify({
                "success": True,
            }), 200
        else:
            return jsonify({
                "success": False,
                "not_match": True
            }), 200

    except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
