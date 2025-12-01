from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional

class StaffsDatabase:
    
    """
    
    \brief Handle MongoDB operations for staffs collection.
    The class manage database connectivivty and provide functionality for staff authentication and staff record retrieval from staffs collection.
    
    """
    
    def __init__(self, uri="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9", database_name: str = "project5_hr"):
       
        """
        
        \brief Constructor for StaffsDatabse.
            Initialize database connection properties but does not open connection until required.
            
        \param uri MongoDB connection URI.
        \param database_name Name of db that store staff collection.
        
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
        
    def verify_login(self, staff_id: str, password: str) -> Optional[dict]:
        
        """
        
        \brief Verify staff login credentials.
            Search for staff record that match provided staff id and password stored inside nested account.password field.
            
            If match found
            -> MOngoDB ObjectId converted to string.
            -> hire_date field converted to ISO format.
        
        \param staff_id UniqueID associated iwth staff memeber.
        \param password Password to authenticate staff account.

       \return Staff document dic if authentication succeed and None if credentials are invalid or if error occur.
       
        """
        
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
        try:
            query = {
                "$and":[
                    {"staff_id": staff_id,},
                    {"account.password" : password}
                ]
            }
            staff = self._staffs.find_one(query)
            if staff:
                staff["_id"] = str(staff["_id"])
                staff["hire_date"] = staff["hire_date"].isoformat()
            return staff
        except Exception as e:
            print(f"Error querying staff: {e}")
            return None
    
    def get_staff(self, staff_id) -> Optional[dict]:
        
        """
        
        \brief Retrieve staff record by staff ID.
            Find staff document that match provided staff id.
            Convert database-specific field into JSON-friendly value
            -> ObjectId converted to string.
            -> hire_date field converted to ISO format.
        
        \param staff_id UniqueID associated iwth staff memeber.

       \return Staff document dic if found and None if no match or if error occur.
       
        """
        
        if self._client is None or self._database is None:
            error = self.connect()
            if error:
                return None
        try:
            query = {
                "staff_id": staff_id,
            }
            staff = self._staffs.find_one(query)
            if staff:
                staff["_id"] = str(staff["_id"])  # make JSON serializable
                staff["hire_date"] = staff["hire_date"].isoformat()
            return staff
        except Exception as e:
            print(f"Error querying staff: {e}")
            return None
    