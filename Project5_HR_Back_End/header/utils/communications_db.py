from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional
from datetime import datetime, timezone, timedelta
import random
import calendar


from header.core.shift_record import ShiftRecord
from header.core.payroll import Payroll
from header.core.communication import Communication

from header.utils.staffs_db import StaffsDatabase


class CommunicationsDatabase:
    """

    @brief Handle MongoDB operation for communication collection.
        The class manage all communication data (announcement and staff mail) including insert new messages and query sent or received communications.
        Results post-procesed to add readable staff name from StaffsDatabase.

    """

    def __init__(
        self,
        uri="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9",
        database_name: str = "project5_hr",
    ):
        """

        @brief Constructr for StaffsDatabse.
            Initialize database connection properties but does not open connection until required.

        @param uri MongoDB connection URI.
        @param database_name Name of db that contain communications collection.

        """

        self._uri = uri
        self._database_name = database_name
        self._client = None
        self._database = None
        self._communications = None

    def connect(self) -> Optional[Exception]:
        """Connect to MongoDB and keep the client open."""

        try:
            self._client = MongoClient(self._uri)
            self._client.admin.command("ping")
            self._database = self._client[self._database_name]
            self._communications = self._database["communications"]
            return None
        except (ServerSelectionTimeoutError, ConnectionFailure) as err:
            print(f"Connection error: {err}")
            return err
        except Exception as err:
            print(f"Unexpected error: {err}")
            return err

    def get_communication_by_id(self, communication_id: int) -> Optional[dict]:
        """

        @brief Retrieve single communication record by ID.
            Convert MongoDB ObjectID to string if record found.

        @param communication_id Unique communication identifier.

        @return communication document dic if found, else None.


        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            query = {
                "communication_id": int(communication_id),
            }

            communication = self._communications.find_one(query)
            if communication:
                communication["_id"] = str(communication["_id"])
            return communication

        except Exception as e:
            print("Error loading payroll:", e)
            return None

    def insert_communication(self, communication: Communication) -> int:
        """

        @brief Insert new communication into database.
            Generate random 5-digit communication ID and ensure uniqueness.
            Communication object value are serialized and stored in MongoDB.

        @param communication Communication domain object contain message data.

        @return generated communication_id if insertion succeed, else None.


        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
        try:
            id = random.randint(10000, 99999)
            while self.get_communication_by_id(id) is not None:
                id = random.randint(10000, 99999)

            if communication.get_recipient_id() is not None:
                query = {
                    "communication_id": int(id),
                    "sender_id": int(communication.get_sender_id()),
                    "recipient_id": (
                        communication.get_recipient_id()
                        if communication.get_recipient_id() is not None
                        else None
                    ),
                    "subject": communication.get_subject(),
                    "body": communication.get_body(),
                    "type": communication.get_type(),
                    "sent_at": datetime.fromisoformat(communication.get_sent_at()),
                }

            else:
                print(communication.get_recipient_id())
                query = {
                    "communication_id": int(id),
                    "sender_id": int(communication.get_sender_id()),
                    "recipient_id": (
                        communication.get_recipient_id()
                        if communication.get_recipient_id() is not None
                        else None
                    ),
                    "subject": communication.get_subject(),
                    "body": communication.get_body(),
                    "type": communication.get_type(),
                    "sent_at": datetime.fromisoformat(communication.get_sent_at()),
                }

            self._communications.insert_one(query)
            return id

        except Exception as e:
            print(f"Error querying communication: {e}")
            return None

    def get_announcements(self) -> Optional[list[dict]]:
        """

        @brief Retrieve all announcements posted within last two months.
            Filter communication where
            -> type == announcemnet
            -> sent_at -> current date

            Look up sender namde from staff databse and insert into each return record.

        @return list of announcement document or None if fail.


        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            two_months_ago = datetime.now() - timedelta(days=60)

            query = {
                "type": "announcement",
                "sent_at": {"$gte": two_months_ago},  # <-- filter
            }

            announcements = list(self._communications.find(query).sort("start_time", 1))
            if announcements:
                staff_db = StaffsDatabase()
                for announcement in announcements:
                    announcement["_id"] = str(announcement["_id"])
                    staff = staff_db.get_staff_by_id(announcement["sender_id"])
                    announcement["sender_name"] = staff["name"]
            return announcements

        except Exception as e:
            print("Error loading payroll:", e)
            return None

    def get_received_mail(self, staff_id: int) -> Optional[list[dict]]:
        """

        @brief Retrieve all mail message received by staffmember.

            Filter communication where
            -> type == mail
            -> recipient_id == staff_id

            Add sender name from staff db to each message record.

        @param staff_id Staff member ID.

        @return List of received mail documents or None if fail.


        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            query = {"type": "mail", "recipient_id": int(staff_id)}

            mails = list(self._communications.find(query).sort("start_time", 1))
            if mails:
                staff_db = StaffsDatabase()
                for mail in mails:
                    mail["_id"] = str(mail["_id"])
                    staff = staff_db.get_staff_by_id(mail["sender_id"])
                    mail["sender_name"] = staff["name"]
            return mails

        except Exception as e:
            print("Error loading payroll:", e)
            return None

    def get_sent_mail(self, staff_id: int) -> Optional[list[dict]]:
        """

        @brief Retrieve all mail sent by staff member.

            Filter communication where
            -> type == mail
            -> sender_id == staff_id

            Add recipient name from staff db to each message record.

        @param staff_id Staff member ID

        @return List of sent mail documents or None if fail.


        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            query = {"type": "mail", "sender_id": int(staff_id)}

            mails = list(self._communications.find(query).sort("start_time", 1))
            if mails:
                staff_db = StaffsDatabase()
                for mail in mails:
                    mail["_id"] = str(mail["_id"])
                    staff = staff_db.get_staff_by_id(mail["recipient_id"])
                    mail["recipient_name"] = staff["name"]

            return mails

        except Exception as e:
            print("Error loading payroll:", e)
            return None
