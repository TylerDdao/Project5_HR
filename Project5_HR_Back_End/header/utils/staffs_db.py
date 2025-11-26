from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional, List
from datetime import datetime

from header.core.staff import Staff

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
    
    def update_staff(self, staff_id: int, staff: Staff) -> bool:
        #update sfaff doc by staff_id using data from staff obj
        if self.client is None or self._database is None:
            error = self.connect()
            if error:
                return False
            
        try:
            update_doc = {
                "$set:" {
                    "name": staff.get_name(),
                    "position": staff.get_position(),
                    "phone_number": staff.get_phone_num(),
                }
            }
            
            #stored as datetime, staff keep as string
            hire_date_str = staff.get_hite_date()
            if hire_date_str:
                try:
                    update_doc["$set"]["hire_date"] = datetime.fromisoformat(
                        hire_date_str.replace("Z", "+00:00")
                    ) 
                except ValueError: #if parse fail, skip update
                    pass
                
            result = self._staffs.update_one({"staff_id": staff_id}, update_doc)
            return result.matched_count > 0
        
        except Exception as e:
            print(f"Error updating staff: {e}")
            return False
    
    def delete_staff(self, staffid: int) -> bool:
        #delete staff doc by id
        if self._client is None or self._databse is None:
            error =self.connect()
            if error:
                return False
        try:
            result = self._staffs.delete_one({"staff_id": staff_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting staff: {e}")
            return False
    
    def get_staff_by_role(self, role: str) -> Optional[List[dict]]:
        #return None: list of staff doc or None if no match 
        if self._client is None or self._database is None:  
            error = self.connect()
            if error:
                return None
            
        try:
            cursor = self._satffs.find({"position": role})
            staffs: List[dict] = list(cursor)
            
            if not staffs:
                return None
            
            for staff in staffs:
                  staff["_id"] = str(staff["_id"])
                  if "hire_date" in staff and staff["hire_date"] is not None:
                      staff["hire_date"] = staff["hire_date"].isoformat()
                      
            return staffs
        
        except Exception as e:
            print(f"Error querying staff by role: {e}")
            return None