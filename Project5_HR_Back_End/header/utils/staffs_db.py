from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional
import random
from datetime import datetime

from header.core.staff import Staff

from dotenv import load_dotenv
import os
load_dotenv()

CONECTION_STRING = os.getenv("CONECTION_STRING") | "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9"
DB_NAME=os.getenv("DB_NAME") | "project5_hr"

class StaffsDatabase:
    def __init__(self, uri=CONECTION_STRING, database_name: str = DB_NAME):
        """

        @brief Constructor for StaffsDatabse.
            Initialize database connection properties but does not open connection until required.

        @param uri MongoDB connection URI.
        @param database_name Name of db that store staff collection.

        """
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

    def verify_login(self, staff_id: int, password: str) -> Optional[dict]:
        """

         @brief Verify staff login credentials.
             Search for staff record that match provided staff id and password stored inside nested account.password field.

             If match found
             -> MOngoDB ObjectId converted to string.
             -> hire_date field converted to ISO format.

         @param staff_id UniqueID associated iwth staff memeber.
         @param password Password to authenticate staff account.

        @return Staff document dic if authentication succeed and None if credentials are invalid or if error occur.

        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
        try:
            query = {"staff_id": int(staff_id), "account.password": password}
            staff = self._staffs.find_one(query)
            if staff:
                staff["_id"] = str(staff["_id"])
                staff["hire_date"] = staff["hire_date"].isoformat()

            return staff
        except Exception as e:
            print(f"Error querying staff: {e}")
            return None

    def get_staff_by_id(self, staff_id) -> Optional[dict]:
        """

        @brief Retrieve staff record by staff ID.
            Find staff document that match provided staff id.
            Convert database-specific field into JSON-friendly value
            -> ObjectId converted to string.
            -> hire_date field converted to ISO format.

        @param staff_id UniqueID associated iwth staff memeber.

        @return Staff document dic if found and None if no match or if error occur.

        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
        try:
            query = {
                "staff_id": int(staff_id),
            }
            staff = self._staffs.find_one(query)
            if staff:
                staff["_id"] = str(staff["_id"])  # make JSON serializable
                staff["hire_date"] = staff["hire_date"].isoformat()

            return staff
        except Exception as e:
            print(f"Error querying staff: {e}")
            return None

    def get_staffs_by_ids(self, staff_ids: list[int]) -> list[dict]:
        """
        @brief Retrieve multiple staff records by list of staffIDs.
             This method query staffs collection for all documents when staff_id is in the list.
             -> return simplified document with staff_id, name, position and hire_date (hire-date converted to ISO string when shown).

        @param staff_ids List of int staff id to look up.
        @return List of staff document dictionaries
                return empty list if no record or if error.

        """

        if self._client is None or self._database is None:
            if self.connect():
                return []

        try:
            cursor = self._staffs.find(
                {"staff_id": {"$in": staff_ids}},
                {"_id": 0, "staff_id": 1, "name": 1, "position": 1, "hire_date": 1},
            )

            staffs = []
            for staff in cursor:
                if "hire_date" in staff:
                    staff["hire_date"] = staff["hire_date"].isoformat()
                staffs.append(staff)

            return staffs

        except Exception as e:
            print("Error querying staffs:", e)
            return []

    def get_staffs(self, page: int) -> Optional[list[dict]]:
        """

        @brief Retrieve list of staff record from given page number.
            This method connect to MongoDB and
            -> calculate how many records to skip based on page
            -> get up to 100 staff record
            -> format data to send as JSON

        @param page Page number to get (each page 100 staff records).
        @return List of staff dictionaries, or None if no staff or error.

        """

        try:
            self.connect()

            skip = (page - 1) * 100
            cursor = self._staffs.find({}, skip=skip, limit=100)

            staffs = []
            for r in cursor:
                staffs.append(
                    {
                        "staff_id": r.get("staff_id"),
                        "name": r.get("name"),
                        "position": r.get("position"),
                        "phone_number": r.get("phone_number"),
                        "hire_date": (
                            r.get("hire_date").isoformat()
                            if r.get("hire_date")
                            else None
                        ),
                        "_id": str(r["_id"]),
                    }
                )

            return staffs if staffs else None

        except Exception as e:
            print(f"Error retrieving staffs: {e}")
            return None

    def set_clock_in(self, staff_id: int) -> bool:
        """

        @bried Mark staff member as clocked in.
             This method clock the current is_working status for given staff and set True if not clocked in yet.
             If staff already clocked in, raise exception.

        @param staff_id Unique id of staff member used to clock in.
        @return Trye if document updated, False if no document or connection fail and None if exception.

        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:
            query = {"staff_id": int(staff_id)}
            found = self._staffs.find_one(query)
            if found["is_working"] == True:
                raise Exception("The staff already clocked in")

            update_data = {"$set": {"is_working": True}}

            result = self._staffs.update_one(query, update_data)

            # RETURN TRUE ONLY IF SOMETHING WAS UPDATED
            return result.modified_count > 0

        except Exception as e:
            print(f"Error updating staffs: {e}")
            return None

    def set_clock_out(self, staff_id: int) -> bool:
        """

        @bried Mark staff member as clocked out.
             This method check the current is_working status for given staff and set False if already working.
             If staff already clocked out, raise exception.

        @param staff_id Unique id of staff member used to clock out.
        @return Trye if document updated, False if no document or connection fail and None if exception.

        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:
            query = {"staff_id": int(staff_id)}
            found = self._staffs.find_one(query)
            if found["is_working"] == False:
                raise Exception("The staff already clocked out")

            update_data = {"$set": {"is_working": False}}

            result = self._staffs.update_one(query, update_data)

            # RETURN TRUE ONLY IF SOMETHING WAS UPDATED
            return result.modified_count > 0

        except Exception as e:
            print(f"Error updating staffs: {e}")
            return None

    def get_total_staffs(self) -> Optional[int]:
        """
        @brief Get total number of staff document in collection.

        @return Int count of staff document or None if error.

        """

        try:
            self.connect()
            return self._staffs.count_documents({})
        except Exception as e:
            print(f"Error retrieving total staffs: {e}")
            return None

    def insert_staff(self, staff: Staff) -> Optional[str]:
        """
        @brief Insert new staff record into database.
            This method generate unique random staff_id, map field from staff domain object into MongoDB document struture and insert it into staff collection.
            return newly generated staff_id.

        @param stff Staff domain object containinh staff's attribute.
        @return Generated staff_id as string or int if insert successful or None if error.

        """
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:

            id = random.randint(10000, 99999)
            while self.get_staff_by_id(id) is not None:
                id = random.randint(10000, 99999)

            doc = {
                "staff_id": int(id),
                "hire_date": datetime.fromisoformat(staff.get_hire_date()),
                "phone_number": staff.get_phone_num(),
                "position": staff.get_position(),
                "name": staff.get_name(),
                "wage_rate": float(staff.get_wage_rate()),
                "account": {
                    "account_type": staff.get_account_type(),
                    "password": staff.get_password(),
                },
                "is_working": False,
            }

            self._staffs.insert_one(doc)
            return id

        except Exception as e:
            print(f"Error inserting staff: {e}")
            return None

    def update_staff(self, staff: Staff) -> bool:
        """

        @brief Update existing staff record.
            This method locate staff document by staff_id and update the fields using values from the provided staff domai object.
            reset is_worling to False as a part of the update.

        @param staff Staff domain object containing updated info.
        @return True if document modified, False if not updated or connection fail and None if exception.

        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:
            query = {
                "staff_id": staff.get_staff_id()
            }

            doc = {
                "$set": {
                    "hire_date": datetime.fromisoformat(staff.get_hire_date()),
                    "phone_number": staff.get_phone_num(),
                    "position": staff.get_position(),
                    "name": staff.get_name(),
                    "wage_rate": float(staff.get_wage_rate()),
                    "account": {
                        "account_type": staff.get_account_type(),
                        "password": staff.get_password(),
                    },
                    "is_working": False,
                }
            }

            result = self._staffs.update_one(query, doc)
            return result.modified_count > 0

        except Exception as e:
            print(f"Error inserting staff: {e}")
            return None

    def delete_staff(self, staff_id: int) -> bool:
        """

        @brief Delete staff document by staff_id.
            This method remove single staff document matching the provided staff_id from collection.

        @param staff_id Unique id of staff memeber for deletion.
        @return True if document deleted, False if else or error.

        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:
            # Convert to int if your staff_id is stored as integer
            staff_id = int(staff_id)
            result = self._staffs.delete_one({"staff_id": staff_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting staff: {e}")
            return False

    def update_password(self, staff_id: int, old_password: str, new_password: str):
        """

        @brief Update staff member's account password.
            This method verifies current credentials using verufy_login.
            if old password is correct -> update account.password to new value for staff member.

        @param staff_id Unique id of staff to update password.
        @param old_password Existing password used for verification.
        @param new_password New password to be stored.
        @return True if password updated, False if no modification or verification fail, and None if exception.

        """

        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return False
        try:
            staff = self.verify_login(staff_id=staff_id, password=old_password)
            if staff is None:
                return False
            query = {"staff_id": staff_id}
            doc = {"$set": {"account.password": new_password}}

            result = self._staffs.update_one(query, doc)
            return result.modified_count > 0

        except Exception as e:
            print(f"Error updating staff: {e}")
            return None
