from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional
from datetime import datetime, timezone, timedelta
import random

from header.core.shift import Shift
from header.utils.staffs_db import StaffsDatabase

from dotenv import load_dotenv
import os
load_dotenv()

CONECTION_STRING = os.getenv("CONECTION_STRING") | "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9"
DB_NAME=os.getenv("DB_NAME") | "project5_hr"

class ShiftsDatabase:
    """

    \brief Handles MongoDB operation for shifts collection.
        This class is responsible for 
        -> connecting to MOngoDB instance 
        -> performing read and update operations on shift documents
        in the shifts collection within database.

    """

    def __init__(self, uri=CONECTION_STRING, database_name: str = DB_NAME):
        """
    
        \brief Construtor for ShiftsDB.
        \param uri MongoDB connection URI.
        \param database_name -> name of the db that stores shifts collection.
        
        """
        self._uri = uri
        self._database_name = database_name
        self._client = None
        self._database = None
        self._shifts = None

    def connect(self) -> Optional[Exception]:
        """
        
        \brief Establish connection to MongoDB
            Initialize MongoDB client, ping server to verify connection
            set up reference to database and shifts collection
        \return None if connection is successful, else raised Exception.
        
        """
        try:
            self._client = MongoClient(self._uri)
            self._client.admin.command("ping")
            self._database = self._client[self._database_name]
            self._shifts =  self._database["shifts"]
            return None
        except (ServerSelectionTimeoutError, ConnectionFailure) as err:
            print(f"Connection error: {err}")
            return err
        except Exception as err:
            print(f"Unexpected error: {err}")
            return err
        
    def get_shift_by_id(self, id: int) -> Optional[dict]:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            shift = self._shifts.find_one({"shift_id": int(id)})
            if not shift:
                return None   # FIXED

            staffDb = StaffsDatabase()
            staff_docs = staffDb.get_staffs_by_ids(shift.get("staffs", []))
            print(staff_docs)
            shift["staffs"] = staff_docs
            shift["_id"] = str(shift["_id"])
            return shift

        except Exception as e:
            print("Error loading shift:", e)
            return None

    def get_active_shifts(self) -> Optional[list[dict]]:
        """
        
        \brief Get all current active shifts.
            Shift is active if
            -> start_time -> current UTC time
            -> end_time -> current UTC time

        \return list of active shift documents with stringified ObjectIds 
            or None if error occur or database cannot be reached.
            
        """
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            now = datetime.now(timezone.utc)
            query = {
                "$and":[
                    {"start_time": {"$lte": now}},
                    {"end_time": {"$gt": now}}
                ]
            }

            shifts = list(self._shifts.find(query).sort("start_time", 1))

            # Convert ObjectId to string for JSON
            for shift in shifts:
                shift["_id"] = str(shift["_id"])
            return shifts
                
                
        except Exception as e:
            print(f"Error querying shifts: {e}")
            return None

    def get_scheduled_shifts(self) -> Optional[list[dict]]:
        """
    
        \brief Get all shifts scheduled for future.
            Shift considered scheduled if
            -> start_time -> current UTC time
            
        
        \return list of active shift documents with stringified ObjectIds 
            or None if error occur or database cannot be reached.
        
        """
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            now = datetime.now(timezone.utc)  # timezone-aware UTC
            query = {
                "start_time": {"$gt": now}
            }

            shifts = list(self._shifts.find(query).sort("start_time", 1))

            # Convert ObjectId to string for JSON
            for shift in shifts:
                shift["_id"] = str(shift["_id"])

            return shifts

        except Exception as e:
            print(f"Error querying shifts: {e}")
            return None
        
    def get_assigned_shifts(self, staff_id: int) -> Optional[list[dict]]:
        """
            
        \brief Get shifts assigned to given staff member for this week and next week.
            Calculates the start and end of the current week and next week (in UTC)
            -> return all shifts assigned to given staff_id in those time ranges .
        
        \param staff_id ID of staff member.
        \return dictionary with two keys
            -> this_week_shifts -> list of shift documets for current week
            -> next_week_shifts -> list of shift documents for the next week
            All documents have objectid converted to string
            returns None if error occur or database cannot be reached.
        
        """ 
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
        try:
            # Get this week
            now = datetime.now(timezone.utc)

            start_of_this_week = now - timedelta(days=now.weekday())
            start_of_this_week = start_of_this_week.replace(hour=0, minute=0, second=0)
            end_of_this_week = start_of_this_week + timedelta(days=6, hours=23, minutes=59, seconds=59)

            query = {
                "staffs": int(staff_id),
                "start_time": {"$gte": start_of_this_week, "$lte": end_of_this_week}
            }

            this_week_shifts = list(self._shifts.find(query).sort("start_time", 1))
            for shift in this_week_shifts:
                shift["_id"] = str(shift["_id"])

            # Get next week
            now = datetime.now(timezone.utc)
            start_of_next_week = start_of_this_week + timedelta(days=7)
            end_of_next_week = start_of_next_week + timedelta(days=6, hours=23, minutes=59, seconds=59)

            query = {
                "staffs": staff_id,
                "start_time": {"$gte": start_of_next_week, "$lte": end_of_next_week}
            }

            next_week_shifts = list(self._shifts.find(query).sort("start_time", 1))
            for shift in next_week_shifts:
                shift["_id"] = str(shift["_id"])

            shifts = {
                # "active_shifts": active_shifts,
                "this_week_shifts": this_week_shifts,
                "next_week_shifts": next_week_shifts
            }

            return shifts

        except Exception as e:
            print(f"Error querying shifts: {e}")
            return None
        
    def get_done_shifts(self) -> Optional[list[dict]]:
        try:
            self.connect()  # Ensure Mongo connection

            # Query: end_time < now()
            now = datetime.now()
            cursor = self._shifts.find(
                {"end_time": {"$lt": now}},
                {"_id": 0, "shift_id": 1, "start_time": 1, "end_time": 1}
            ).sort("start_time", 1).limit(1000)

            shifts = []
            for doc in cursor:
                shifts.append({
                    "shift_id": doc["shift_id"],
                    "start_time": doc["start_time"].isoformat(),
                    "end_time": doc["end_time"].isoformat()
                })

            return shifts if shifts else None

        except Exception as e:
            print(f"Error retrieving shifts: {e}")
            return None

    def update_shift(self, shift: Shift) -> bool:
        """
        \brief Update start and end time of existing shift.
            Find shift document by shift_id and update start time and end time using values from provided shift object.
            Timesatmp in Shift object to be ISO string ending with 'Z' for UTC.
            
        \param shift domain object contain updated infomation
        \return True if existing shift document was modified, False if no document was update or None if exception occur.
        
        """
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False

        try:
            query = {"shift_id": int(shift.get_shift_id())}
            # found = self._shifts.find_one(query)
            # print(found)
            update_data = {
                "$set": {
                    "start_time": datetime.fromisoformat(shift.get_start_time()),
                    "end_time": datetime.fromisoformat(shift.get_end_time()),
                    "staffs": shift.get_staffs()
                }
            }

            result = self._shifts.update_one(query, update_data)

            # RETURN TRUE ONLY IF SOMETHING WAS UPDATED
            return result.modified_count > 0

        except Exception as e:
            print(f"Error updating shift: {e}")
            return False
        
    def insert_shift(self, shift: Shift) -> Optional[str]:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:

            id = random.randint(10000, 99999)
            while self.get_shift_by_id(id) is not None:
                id = random.randint(10000, 99999)

            doc = {
                "shift_id": id,
                "staffs": shift.get_staffs() or [],
                "start_time": datetime.fromisoformat(shift.get_start_time()),
                "end_time": datetime.fromisoformat(shift.get_end_time()),
            }

            self._shifts.insert_one(doc)
            # Return stringified ObjectId
            return id

        except Exception as e:
            print(f"Error inserting shift: {e}")
            return None
        
    def delete_shift(self, shift_id: int) -> bool:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:
            # Convert to int if your staff_id is stored as integer
            shift_id = int(shift_id)
            result = self._shifts.delete_one({"shift_id": shift_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting shift: {e}")
            return False