from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional
from datetime import datetime
import random

from header.core.shift_record import ShiftRecord
from header.core.payroll import Payroll
from header.utils.staffs_db import StaffsDatabase

from dotenv import load_dotenv
import os
load_dotenv()

CONECTION_STRING = os.getenv("CONECTION_STRING") | "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9"
DB_NAME=os.getenv("DB_NAME") | "project5_hr"

class PayrollDatabase:
    """

    @brief Handles MongoDB operation for payroolls collection.
        This class manage all payroll-related database functionality
        -> inserting payroll records
        -> retrieveing individual or multiple payrolls
        -> cancelling existing payroll entries
        -> fetching monthly payroll summaried for staff
        Payrool query with staff info retrieved from staff database when applicable.

    """
    
    def __init__(self, uri=CONECTION_STRING, database_name: str = DB_NAME):
        
        """

        @brief Constructor for PayrollDatabse.
            Initialize database connection properties but does not open connection until required.

        @param uri MongoDB connection URI.
        @param database_name Name of db that contain payroll record.

        """

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

    def get_my_payroll(self, staff_id: int) -> Optional[list[dict]]:
        """

        @brief Retrieve payroll information for specific staff member.

           return
           -> payroll from current month.
           -> all payroll for staff meber employment history.

           MongoDB document Id converted to string for JSON.

        @param staff_id Unique staff identifier.

        @return Dictionay payload
                ->this_month - list of payroll records for current month
                -> all = list of all payroll records for staff or None in fail.

        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
        try:
            now = datetime.now()
            start_of_month = now.replace(
                day=1, hour=0, minute=0, second=0, microsecond=0
            )
            query = {"staff_id": int(staff_id), "created_at": {"$gte": start_of_month}}
            this_month_payrolls = list(self._payrolls.find(query))
            if this_month_payrolls:
                for payroll in this_month_payrolls:
                    payroll["_id"] = str(payroll["_id"])
            query = {"staff_id": int(staff_id)}
            all_payrolls = list(self._payrolls.find(query))
            if all_payrolls:
                for payroll in all_payrolls:
                    payroll["_id"] = str(payroll["_id"])
            if all_payrolls is None and this_month_payrolls is None:
                return None
            payload = {"this_month": this_month_payrolls, "all": all_payrolls}
            return payload
        except Exception as e:
            print("Error loading payrolls:", e)
            return None

    def get_payroll_by_id(self, payroll_id: int) -> Optional[list[dict]]:
        """

        @brief Retrieve payroll entry by payroll ID.
            Add recepient staff member name to returned payroll record.

        @param payroll_id Unique payroll identifier.

        @return Payroll document dic with receiver field added or None if fail.


        """
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

    def cancel_payroll(self, payroll_id: int) -> bool:
        """

        @brief Cancel existing payroll entry.
            Mark payroll record as cancelled by setting is_cancelled field to True

        @param payroll_id Unique communication identifier.

        @return True if payroll successfully updated or False if no payroll match found or error.


        """

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

    def insert_payroll(self, payroll: Payroll) -> bool:
        """

        @brief Insert new payroll into database.
            Generate unique 5-digit payroll ID and store all relevant payroll field from Payroll object.

        @param payroll Payroll domain object contain payment data.

        @return generated payroll_id if insertion succeed, else None.


        """

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
                "start_date": datetime.fromisoformat(payroll.get_start_date()),
                "end_date": datetime.fromisoformat(payroll.get_end_date()),
                "hours_worked": payroll.get_hours_worked(),
                "wage_rate": payroll.get_wage_rate(),
                "bonus": payroll.get_bonus(),
                "deduction": payroll.get_deduction(),
                "created_at": datetime.utcnow(),
                "is_canceled": False,
            }
            self._payrolls.insert_one(query)

            return id
        except Exception as e:
            print(f"Error querying shifts: {e}")
            return None

    def get_all_payrolls(self) -> list[dict]:
        """

        @brief Fetch all payrolls reocrds from database.
            Each payroll document return include
            -> Srringified MongoDB onjectid
            -> staff receiver name retrieved using staffdb.

        @return list of payroll documents.


        """

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
