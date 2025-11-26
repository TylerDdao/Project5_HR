from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import jwt

SECRET_KEY = "secret"
ISSUER = "project5_hr"

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

DEPARTMENT = {
    "staff": "/staff",
    "shift": "/shift",
    "account": "/account",
    "payroll": "payroll"
}

# @app.route("/api/<service>/<path:endpoint>", methods=["GET", "POST", "PUT", "DELETE"])
# def gateway(service, endpoint):
#     if service not in SERVICES:
#         return jsonify({"error": "Service not found"}), 404
    
#     service_url = f"{SERVICES[service]}/{endpoint}"

#     # Forward request
#     try:
#         resp = requests.request(
#             method=request.method,
#             url=service_url,
#             headers=request.headers,
#             params=request.args,
#             json=request.get_json(silent=True),
#         )

#         return (resp.text, resp.status_code, resp.headers.items())

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/api/<department>/<service>", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
# def map_service(department, service):
#     if department not in DEPARTMENT:
#         return jsonify({"success": False, "message": "Department not fount"}), 404
    
#     url = f"/api/{}"
#     try:
#         resp = requests.request(method=request.method, url=)
#         return jsonify({"success": True, "service": service, "department": department}), 200

#     except Exception as e:
#             return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000)