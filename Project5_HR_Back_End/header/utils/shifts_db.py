from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional
from datetime import datetime, timezone, timedelta

from header.core.shift import Shift
class ShiftsDatabase:
    
    """
    
    \brief Handles MongoDB operation for shifts collection.
        This class is responsible for 
        -> connecting to MOngoDB instance 
        -> performing read and update operations on shift documents
        in the shifts collection within database.
    
    """
    
    def __init__(self, uri="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9", database_name: str = "project5_hr"):
       
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
            now = datetime.now(timezone.utc)  # timezone-aware UTC
            query = {
                "$and":[
                    {"start_time": {"$lte": now}},
                    {"end_time": {"$gt": now}}
                ]
            }

            shifts = list(self._shifts.find(query))

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

            shifts = list(self._shifts.find(query))

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
                "staffs": staff_id,
                "start_time": {"$gte": start_of_this_week, "$lte": end_of_this_week}
            }

            this_week_shifts = list(self._shifts.find(query))
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

            next_week_shifts = list(self._shifts.find(query))
            for shift in next_week_shifts:
                shift["_id"] = str(shift["_id"])

            shifts = {
                "this_week_shifts": this_week_shifts,
                "next_week_shifts": next_week_shifts
            }

            return shifts

        except Exception as e:
            print(f"Error querying shifts: {e}")
            return None
        
    def update_shift(self, shift: Shift)->bool:
        
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
                return None

        try:
            original_shift = {
                "shift_id": shift.get_shift_id()
            }
            updated_shift = {'$set':
                {"start_time": datetime.fromisoformat(shift.get_start_time().replace("Z", "+00:00")),
                "end_time": datetime.fromisoformat(shift.get_end_time().replace("Z", "+00:00"))}
            }
            result = self._shifts.update_one(original_shift, updated_shift)

            return result

        except Exception as e:
            print(f"Error querying shifts: {e}")
            return None