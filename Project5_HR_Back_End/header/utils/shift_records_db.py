from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional
from datetime import datetime, timezone, timedelta
import random

from header.core.shift_record import ShiftRecord

from dotenv import load_dotenv
import os
load_dotenv()

CONECTION_STRING = os.getenv("CONECTION_STRING") | "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9"
DB_NAME=os.getenv("DB_NAME") | "project5_hr"

class ShiftRecordDatabase:
    """

    @brief Handles MongoDB operation for shift_records collection.
        This class manage creation and retrieval od staff shift attendance records
        -> starting new shift
        -> ending shift
        -> query weekly or date-range records
        -> fetching individual shift records by ID

        Payroll query with staff info retrieved from staff database when applicable.

    """

    def __init__(self, uri=CONECTION_STRING, database_name: str = DB_NAME):
        """

        @brief Constructor for ShiftRecordDatabase.
            Initialize database config with no connection established.

        @param uri MongoDB connection URI.
        @param database_name Name of db that contain shift record

        """

        self._uri = uri
        self._database_name = database_name
        self._client = None
        self._database = None
        self._shift_records = None

    def connect(self) -> Optional[Exception]:
        try:
            self._client = MongoClient(self._uri)
            self._client.admin.command("ping")
            self._database = self._client[self._database_name]
            self._shift_records = self._database["shift_records"]
            return None
        except (ServerSelectionTimeoutError, ConnectionFailure) as err:
            print(f"Connection error: {err}")
            return err
        except Exception as err:
            print(f"Unexpected error: {err}")
            return err

    def get_shift_record_by_id(self, id: int) -> Optional[dict]:
        """

        @brief Retrieve shift record by ID.
            Convert MongoDB ObjectId to string if matching record exist.

        @param if Unique shift record identifier.

        @return Shift record document dic or None if not found or fail.


        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            shift_record = self._shift_records.find_one({"shift_record_id": int(id)})
            if not shift_record:
                return None  # FIXED

            shift_record["_id"] = str(shift_record["_id"])
            return shift_record

        except Exception as e:
            print("Error loading shift record:", e)
            return None

    def start_shift_record(self, shift_record: ShiftRecord) -> int:
        """

        @brief Start new shift record.
            Generate unique shift record ID and store
            -> staff ID
            -> check in time
            -> pending shift completion

        @param shift_record ShiftRecord object contain Staff ID and checkin timestamp.

        @return Generated shift_record_id if insertion successful or None if fail.


        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:

            id = random.randint(10000, 99999)
            while self.get_shift_record_by_id(id) is not None:
                id = random.randint(10000, 99999)

            doc = {
                "shift_record_id": id,
                "staff_id": shift_record.get_staff_id(),
                "check_in": datetime.fromisoformat(shift_record.get_check_in()),
                "check_out": None,
            }

            self._shift_records.insert_one(doc)

            # Return stringified ObjectId
            return id

        except Exception as e:
            print(f"Error inserting shift: {e}")
            return None

    def end_shift_record(self, shift_record: ShiftRecord) -> bool:
        """

        @brief End shift record.
            Find existing shift record by ID and set checkout timestamp.

        @param shift_record ShiftRecord object contain shift_record_if and checkout timestamp.

        @return True if record updated or else False.

        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:
            query = {"shift_record_id": int(shift_record.get_shift_record_id())}

            update_data = {
                "$set": {
                    "check_out": datetime.fromisoformat(shift_record.get_check_out()),
                }
            }
            result = self._shift_records.update_one(query, update_data)

            # RETURN TRUE ONLY IF SOMETHING WAS UPDATED
            return result.modified_count > 0

        except Exception as e:
            print(f"Error inserting shift: {e}")
            return None

    def get_this_week_shift_records(self, staff_id: int) -> Optional[list[dict]]:
        """

        @brief Retrieve all shift records for current week for staff.
            Week calculated from Monday 00:00 UTC to Sunday 23:59:59 UTC.

        @param staff_id Staff member identifier.

        @return List of shift records sorted by checkin time or None if fail.


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
            end_of_this_week = start_of_this_week + timedelta(
                days=6, hours=23, minutes=59, seconds=59
            )

            query = {
                "staff_id": int(staff_id),
                "check_in": {"$gte": start_of_this_week, "$lte": end_of_this_week},
            }

            this_week_records = list(
                self._shift_records.find(query).sort("check_in", 1)
            )
            for record in this_week_records:
                record["_id"] = str(record["_id"])

            return this_week_records

        except Exception as e:
            print(f"Error querying shifts: {e}")
            return None

    def get_shift_records_in_range(
        self, staff_id: int, start_date, end_date
    ) -> Optional[list[dict]]:
        """

        @brief  Get all shift records for a staff ID where:
                -> check_in >= start_date
                -> check_out <= end_date
                -> chek_out must exist

                Accept datetime objects or ISO formatted date strings.

        @param staff_id Staff member identifier.
        @param start_date Start of date range (datetime or ISO string).
        @param end_date End of date range (datetime or ISO string).

        @return List of matching shift records sorted by check_in or None if fail.

        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            # Convert incoming values to datetime if they are strings
            if isinstance(start_date, str):
                start_date = datetime.fromisoformat(start_date)

            if isinstance(end_date, str):
                end_date = datetime.fromisoformat(end_date)

            query = {
                "staff_id": int(staff_id),
                "check_in": {"$gte": start_date},
                "check_out": {
                    "$ne": None,
                    "$lte": end_date,
                },  # ensure check_out exists and is before end_date
            }

            records = list(self._shift_records.find(query).sort("check_in", 1))

            # Convert ObjectId to string
            for record in records:
                record["_id"] = str(record["_id"])

            return records

        except Exception as e:
            print(f"Error querying shift records in range: {e}")
            return None
