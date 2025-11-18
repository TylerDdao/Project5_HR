# # from header.core.account import Account
from header.utils.database_control import DatabaseControl

# # # a = Account(1, 101, "mypassword", "Manager")
# # # print(a.get_account_id())        # 1
# # # print(a.get_staff_id())          # 101
# # # a.set_password("newpassword")
# # # print(a.get_password())    # newpassword

# # db = DatabaseControl()
# # db.set_connection()

# # a = Account()
# # a = db.get_account(1)

# # print(a.get_account_id())


# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# # CORS(app, origins=["*"], supports_credentials=True)

# @app.route("/test", methods=["POST"])
# def test():
#     try:
#         data = request.json
#         print("Raw data:", data.get('password'))     # parsed JSON

#         data = request.json
#         if not data:
#             return jsonify({"success": False, "message": "No JSON received"}), 400

#         # Echo back what was sent
#         return jsonify({
#             "success": True,
#             "message": "JSON received successfully",
#             "data": data
#         })

#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500
    

# if __name__ == "__main__":
#     app.run(port=5000)

# db = DatabaseControl()
# staff_id = "1"
# password = "123"
# ok = db.verify_login(staff_id, password)
# print("Result: ", ok)
# if ok:
#     print("true")

from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from header.utils.database_control import DatabaseControl
from header.core.employee import Employee
from header.core.account import Account

db = DatabaseControl()


SECRET_KEY = "secret"
ISSUER = "project5_hr"

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

@app.route("/login", methods=["POST"])
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
            e = db.get_employee(staff_id)
            
            payload = {
                "user": {
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

if __name__ == "__main__":
    app.run(port=5000)
