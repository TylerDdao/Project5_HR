from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
import random

from header.utils.database_control import DatabaseControl
from header.core.staff import Staff
from header.core.account import Account
from header.core.shift import Shift

db = DatabaseControl()


SECRET_KEY = "secret"
ISSUER = "project5_hr"

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

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
    return payload

# Routes
@app.route("/")
def home():
    return "Hello world"

@app.route("/token")
def get_token():
    user = {"name": "Tyler", "phone": "0987654321"}
    account = {"role": "Manager", "id": 1}
    payload = {
        "user": user,
        "account": account,
        "iss": ISSUER,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return jsonify({"user": user, "account": account, "token": token})

# @app.route("/verify-token", methods=["GET"])
# def verify_token():
#     auth = request.headers.get("Authorization")
#     if token_checker(auth):
#         decoded = token_decoder(auth)
#         user = decoded.get("user")
#         account = decoded.get("account")
#         print(user["name"], account["id"])
#         return "ok", 200
#     else:
#         return jsonify({"success": False, "message": "Invalid token"}), 401
        

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json
        staff_id = data.get("staff_id")
        password = data.get("password")

        ok = db.verify_login(staff_id, password)
        if ok:
            a = Account()
            a = db.get_account(staff_id)
            e = Staff()
            e = db.get_staff_by_id(staff_id)
            
            payload = {
                "staff": {
                    "staff_id": e.get_staff_id(),
                    "name": e.get_name(),
                    "hire_date": e.get_hire_date(),
                    "phone_number": e.get_phone_num()
                },
                "account": {
                    "account_id": a.get_account_id(),
                    "account_type": a.get_account_type()
                },
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            payload["token"] = token
            return jsonify({"success": True, "message": "Login successful", **payload}), 200

        else:
            return jsonify({"success": False, "message": "Invalid staff ID or password"}), 401

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/api/shift_detail", methods=["GET"])
def get_shift_detail():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403

    shift_id = request.args.get("shift_id", type=int)
    status = request.args.get("status", type=str)

    if not shift_id:
        if status == "scheduled":
            shifts = db.get_scheduled_and_active_shifts()
            
            return jsonify({
                "success": True,
                "shifts": shifts or [],
            }), 200
        elif status == "done":
            shifts = db.get_done_shifts()
            return jsonify({
                "success": True,
                "shifts": shifts or [],
            }), 200
        else:
            return jsonify({"success": False, "message": "Missing shift status"}), 404
            
    try:
        # Get shift info
        shift = db.get_shift_by_id(shift_id)
        if not shift:
            return jsonify({"success": False, "message": "Shift not found"}), 404

        # Get employees assigned to the shift
        staffs = db.get_staffs_by_shift_id(shift_id)

        return jsonify({
            "success": True,
            "shift": shift,
            "staffs": staffs or []
        }), 200

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
        # Get shift info
        this_week_shifts = db.get_this_week_shifts(staff_id)
        if not this_week_shifts:
            return jsonify({"success": False, "message": "Shifts not found"}), 404
        next_week_shifts = db.get_next_week_shifts(staff_id)

        return jsonify({
            "success": True,
            "this_week_shifts": this_week_shifts,
            "next_week_shifts": next_week_shifts or []
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    
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
    
@app.route("/api/update_shift", methods=["PUT"])
def update_shift():
    auth = request.headers.get("Authorization")
    if not token_checker(auth):
        return jsonify({"success": False, "message": "Invalid token"}), 403

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

    



    


if __name__ == "__main__":
    app.run(port=5000)
