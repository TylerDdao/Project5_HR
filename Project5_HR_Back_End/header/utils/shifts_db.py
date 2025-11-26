from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional
from datetime import datetime, timezone, timedelta

from header.core.shift import Shift

class ShiftsDatabase:
    def __init__(self, uri="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9", database_name: str = "project5_hr"):
        self._uri = uri
        self._database_name = database_name
        self._client = None
        self._database = None
        self._shifts = None

    def connect(self) -> Optional[Exception]:
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