from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
import random

from header.utils.mongo_database import DatabaseControl
from header.utils.shifts_db import ShiftsDatabase
from header.utils.staffs_db import StaffsDatabase


from header.core.staff import Staff
from header.core.account import Account
from header.core.shift import Shift

# db = DatabaseControl()

# Token for Tyler
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGFmZiI6eyJzdGFmZl9pZCI6MSwibmFtZSI6IlR5bGVyIiwiaGlyZV9kYXRlIjoiMjAyNS0xMC0zMSIsInBob25lX251bWJlciI6IjU0ODM4NDM2ODEifSwiYWNjb3VudCI6eyJhY2NvdW50X2lkIjoxLCJhY2NvdW50X3R5cGUiOiJNYW5hZ2VyIn19.Rp7MQWOUT5V4SpgeWXD15O3KED_pkMX9UTkSkRuE-bI


SECRET_KEY = "secret"
ISSUER = "project5_hr"

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Utility functions
def token_checker(auth_header):
    return True
    # if not auth_header or not auth_header.startswith("Bearer "):
    #     return False
    # token = auth_header[7:]
    # try:
    #     jwt.decode(token, SECRET_KEY, algorithms=["HS256"], issuer=ISSUER)
    #     return True
    # except jwt.PyJWTError:
    #     return False

def token_decoder(auth_header):
    token = auth_header[7:]
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"], issuer=ISSUER)
    print(payload)
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
            "phone_number": "5481234567"
        },
        "account": {
            "account_id": 1,
            "account_type": "Manager"
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
    try:
        if shift_id is None:
            db = ShiftsDatabase()
            active_shifts = db.get_active_shifts()
            scheduled_shifts = db.get_scheduled_shifts()
            payload = {
                "active_shifts": active_shifts,
                "scheduled_shifts": scheduled_shifts
            }
            return jsonify({"success": True, **payload}), 200
                
        
        return jsonify({"success": False}), 400

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
            "this_week_shifts": shifts["this_week_shifts"],
            "next_week_shifts": shifts["next_week_shifts"] or []
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500




@app.route("/api/update_shift", methods=["PUT"])
def update_shift():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    decoded = token_decoder(auth)
    account_info = decoded.get("account")
    account_type = account_info.get("account_type")
    if account_type!="Manager":
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
    

@app.route("/api/create_shift" ,methods=["POST"])
def create_shift():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403

    decoded = token_decoder(auth)
    account_info = decoded.get("account")
    account_type = account_info.get("account_type")
    if account_type!="Manager":
        return jsonify({"success": False, "message": "You don't have permission to use this API"}), 401
    
    try:
        data = request.json
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        staff_ids = data.get("staffs")

        if start_time is None or end_time is None or staff_ids is None:
            return jsonify({"success": False, "message": "Missing shift information"}), 404
        
        shift = Shift(start_time=start_time, end_time=end_time, staffs=staff_ids)
        shift_id = db.insert_shift(shift=shift)
        return jsonify({"success": True, "shift_id": shift_id}), 200
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

# Payrolls
@app.route("/api/payroll-detail",methods=["GET"])
def get_payroll_detail():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403
    decoded = token_decoder(auth)
    account_info = decoded.get("account")
    account_type = account_info.get("account_type")
    staff_info = decoded.get("staff")
    staff_id = staff_info.get("staff_id")

    payroll_id = request.args.get("payroll_id", type=int)
    if payroll_id is None:
        payrolls = db.get_payrolls_by_staff_id(staff_id=staff_id)
        return jsonify({"success": True, "payrolls": payrolls}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
