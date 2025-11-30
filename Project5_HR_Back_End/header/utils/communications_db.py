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
    def __init__(self, uri="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9", database_name: str = "project5_hr"):
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
                    "recipient_id": communication.get_recipient_id() if communication.get_recipient_id() is not None else None,
                    "subject": communication.get_subject(),
                    "body": communication.get_body(),
                    "type": communication.get_type(),
                    "sent_at": datetime.fromisoformat(communication.get_sent_at())
                }
            
            else:
                print(communication.get_recipient_id())
                query = {
                    "communication_id": int(id),
                    "sender_id": int(communication.get_sender_id()),
                    "recipient_id": communication.get_recipient_id() if communication.get_recipient_id() is not None else None,
                    "subject": communication.get_subject(),
                    "body": communication.get_body(),
                    "type": communication.get_type(),
                    "sent_at": datetime.fromisoformat(communication.get_sent_at())
                }

            self._communications.insert_one(query)
            return id

        except Exception as e:
            print(f"Error querying communication: {e}")
            return None
        
    def get_announcements(self) -> Optional[list[dict]]:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            two_months_ago = datetime.now() - timedelta(days=60)

            query = {
                "type": "announcement",
                "sent_at": { "$gte": two_months_ago }  # <-- filter
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
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            query = {
                "type": "mail",
                "recipient_id": int(staff_id)
            }
            
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
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            query = {
                "type": "mail",
                "sender_id": int(staff_id)
            }
            
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