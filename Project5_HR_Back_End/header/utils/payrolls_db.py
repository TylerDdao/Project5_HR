from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional
from datetime import datetime, timezone, timedelta
import random
import calendar


from header.core.shift_record import ShiftRecord
from header.core.payroll import Payroll
from header.utils.staffs_db import StaffsDatabase

class PayrollDatabase:
    def __init__(self, uri="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9", database_name: str = "project5_hr"):
        self._uri = uri
        self._database_name = database_name
        self._client = None
        self._database = None
        self._payrolls = None

    def connect(self) -> Optional[Exception]:
        """Connect to MongoDB and keep the client open."""
        try:
            self._client = MongoClient(self._uri)
            self._client.admin.command("ping")
            self._database = self._client[self._database_name]
            self._payrolls = self._database["payrolls"]
            return None
        except (ServerSelectionTimeoutError, ConnectionFailure) as err:
            print(f"Connection error: {err}")
            return err
        except Exception as err:
            print(f"Unexpected error: {err}")
            return err
        
    def get_my_payroll(self, staff_id:int) -> Optional[list[dict]]:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            now = datetime.now()
            start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

            query = {
                "staff_id": int(staff_id),
                "created_at": {"$gte": start_of_month}
            }

            this_month_payrolls = list(self._payrolls.find(query))
            if this_month_payrolls:
                for payroll in this_month_payrolls:
                    payroll["_id"] = str(payroll["_id"])

            query = {
                "staff_id": int(staff_id)
            }
            all_payrolls = list(self._payrolls.find(query))
            if all_payrolls:
                for payroll in all_payrolls:
                    payroll["_id"] = str(payroll["_id"])

            if all_payrolls is None and this_month_payrolls is None:
                return None

            payload ={
                "this_month": this_month_payrolls,
                "all": all_payrolls
            }

            return payload

        except Exception as e:
            print("Error loading payrolls:", e)
            return None
        
    def get_payroll_by_id(self, payroll_id:int) -> Optional[list[dict]]:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            query = {
                "payroll_id": int(payroll_id),
            }
            
            payroll = self._payrolls.find_one(query)
            if payroll:
                payroll["_id"] = str(payroll["_id"])
                staffDb = StaffsDatabase()
                staff = staffDb.get_staff_by_id(payroll["staff_id"])
                payroll["receiver"] = staff["name"]
            return payroll

        except Exception as e:
            print("Error loading payroll:", e)
            return None
        
    def cancel_payroll(self, payroll_id:int) -> bool:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:
            query = {"payroll_id": int(payroll_id)}

            update_data = {
                "$set": {
                    "is_canceled": True,
                }
            }
            result = self._payrolls.update_one(query, update_data)

            return result.modified_count > 0

        except Exception as e:
            print(f"Error mdifying payroll: {e}")
            return None
                
    def insert_payroll(self, payroll: Payroll) ->bool:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
        try:
            id = random.randint(10000, 99999)
            while self.get_payroll_by_id(id) is not None:
                id = random.randint(10000, 99999)
            
            print(payroll.get_wage_rate())

            query = {
                "payroll_id": id,
                "staff_id": payroll.get_staff_id(),
                "start_date":  datetime.fromisoformat(payroll.get_start_date()),
                "end_date":  datetime.fromisoformat(payroll.get_end_date()),
                "hours_worked": payroll.get_hours_worked(),
                "wage_rate": payroll.get_wage_rate(),
                "bonus": payroll.get_bonus(),
                "deduction": payroll.get_deduction(),
                "created_at": datetime.utcnow(),
                "is_canceled": False
            }

            self._payrolls.insert_one(query)
            
            return id

        except Exception as e:
            print(f"Error querying shifts: {e}")
            return None
        
    def get_all_payrolls(self) -> list[dict]:
        """Fetch all payroll documents from the database."""
        try:
            self.connect()
            cursor = self._payrolls.find({})
            payrolls = []
            staff_db = StaffsDatabase()
            for doc in cursor:
                staff = staff_db.get_staff_by_id(doc["staff_id"])
                doc["_id"] = str(doc["_id"])
                doc["receiver"] = staff["name"]
                payrolls.append(doc)
            return payrolls
        except Exception as e:
            print(f"Error fetching payrolls: {e}")
            return []