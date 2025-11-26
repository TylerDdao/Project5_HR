from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional

class StaffsDatabase:
    def __init__(self, uri="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9", database_name: str = "project5_hr"):
        self._uri = uri
        self._database_name = database_name
        self._client = None
        self._database = None
        self._staffs = None

    def connect(self) -> Optional[Exception]:
        """Connect to MongoDB and keep the client open."""
        try:
            self._client = MongoClient(self._uri)
            self._client.admin.command("ping")
            self._database = self._client[self._database_name]
            self._staffs = self._database["staffs"]
            return None
        except (ServerSelectionTimeoutError, ConnectionFailure) as err:
            print(f"Connection error: {err}")
            return err
        except Exception as err:
            print(f"Unexpected error: {err}")
            return err
        
    def verify_login(self, staff_id: str, password: str) -> Optional[dict]:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
        try:
            query = {
                "$and":[
                    {"staff_id": staff_id,},
                    {"account.password" : password}
                ]
            }
            staff = self._staffs.find_one(query)
            if staff:
                staff["_id"] = str(staff["_id"])
                staff["hire_date"] = staff["hire_date"].isoformat()
            return staff
        except Exception as e:
            print(f"Error querying staff: {e}")
            return None
    
    def get_staff(self, staff_id) -> Optional[dict]:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
        try:
            query = {
                "staff_id": staff_id,
            }
            staff = self._staffs.find_one(query)
            if staff:
                staff["_id"] = str(staff["_id"])  # make JSON serializable
                staff["hire_date"] = staff["hire_date"].isoformat()
            return staff
        except Exception as e:
            print(f"Error querying staff: {e}")
            return None
    