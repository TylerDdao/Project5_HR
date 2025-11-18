from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime

from header.utils.database_control import DatabaseControl
from header.core.employee import Employee
from header.core.account import Account

db = DatabaseControl()


SECRET_KEY = "secret"
ISSUER = "project5_hr"

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

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
    return "Hello world"

# @app.route("/token")
# def get_token():
#     user = {"name": "Tyler", "phone": "0987654321"}
#     account = {"role": "Manager", "id": 1}
#     payload = {
#         "user": user,
#         "account": account,
#         "iss": ISSUER,
#         "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
#     }
#     token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
#     return jsonify({"user": user, "account": account, "token": token})

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
            e = Employee()
            e = db.get_staff(staff_id)
            
            payload = {
                "staff": {
                    "id": e.get_staff_id(),
                    "name": e.get_name(),
                    "hire_date": e.get_hire_date(),
                    "phone_number": e.get_phone_num()
                },
                "account": {
                    "id": a.get_account_id(),
                    "role": a.get_account_type()
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
    # auth = request.headers.get("Authorization")
    # if not token_checker(auth):
    #     return jsonify({"success": False, "message": "Invalid token"}), 403


    shift_id = request.args.get("shift_id", type=int)

    if not shift_id:
        shifts = db.get_all_shifts()
        if not shifts:
            return jsonify({"success": False, "message": "Shift not found"}), 404
        return jsonify({
            "success": True,
            "shifts": shifts or [],
        })

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

if __name__ == "__main__":
    app.run(port=5000)
