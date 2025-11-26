from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional

# uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9"
# client = MongoClient(uri)
# try:
#     database = client.get_database("project5_hr")
#     staffs = database.get_collection("staffs")
#     # Query for a movie that has the title 'Back to the Future'
#     query = { "name": { "$regex": "Alice", "$options": "i" } }
#     movie = staffs.find_one(query)
#     print(movie)
#     client.close()
# except Exception as e:
#     raise Exception("Unable to find the document due to the following error: ", e)

class DatabaseControl:
    def __init__(self, uri="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9", database_name: str = "project5_hr"):
        self._uri = uri
        self._database_name = database_name
        self._client = None
        self._database = None

    def connect(self) -> Optional[Exception]:
        """Connect to MongoDB and keep the client open."""
        try:
            self._client = MongoClient(self._uri)
            self._client.admin.command("ping")
            self._database = self._client[self._database_name]
            return None
        except (ServerSelectionTimeoutError, ConnectionFailure) as err:
            print(f"Connection error: {err}")
            return err
        except Exception as err:
            print(f"Unexpected error: {err}")
            return err

    def check_staff(self, name: str) -> Optional[dict]:
        """Query for a staff member by name."""
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None

        try:
            staffs = self._database["staffs"]
            query = {"name": {"$regex": name, "$options": "i"}}
            staff = staffs.find_one(query)
            return staff
        except Exception as e:
            print(f"Error querying staff: {e}")
            return None
        
    def verify_login(self, staff_id: str, password: str)->bool:
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
            
        try:
            staffs = self._database["staffs"]
            query = {
                "$and": [
                    {"staff_id": staff_id},
                    {"account.password": password}
                ]
            }
            staff = staffs.find_one(query)
            return staff
        except Exception as e:
            print(f"Error querying staff: {e}")
            return None
