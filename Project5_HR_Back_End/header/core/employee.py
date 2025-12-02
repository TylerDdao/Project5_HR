"""
@brief This module defines the Employee class.
"""

class Employee:
    """
    @brief This is the Employee Class
    """

    def __init__(self, staff_id=0, name="", position="", phone_num="", hire_date=""):
        """
        @brief Constructor for Employee
        @param staff_id Employee ID
        @param name Employee name
        @param position Employee position
        @param phone_num Employee phone number
        @param hire_date Employee hire date
        """
        self._staff_id = staff_id
        self._name = name
        self._position = position
        self._phone_num = phone_num
        self._hire_date = hire_date

    # =========
    # Getters
    # =========

    def get_staff_id(self):
        """
        @brief Get employee ID
        @return staffId:int
        """
        return self._staff_id

    def get_name(self):
        """
        @brief Get employee name
        @return name:string
        """
        return self._name

    def get_position(self):
        """
        @brief Get employee position
        @return position:string
        """
        return self._position

    def get_phone_num(self):
        """
        @brief Get employee phone number
        @return phoneNum:string
        """
        return self._phone_num

    def get_hire_date(self):
        """
        @brief Get employee hire date
        @return hireDate:string
        """
        return self._hire_date

    # =========
    # Setters
    # =========

    def set_name(self, name):
        """
        @brief Set employee name
        @param name Employee name
        """
        self._name = name

    def set_position(self, position):
        """
        @brief Set employee position
        @param position Employee position
        """
        self._position = position

    def set_phone_num(self, phone_num):
        """
        @brief Set employee phone number
        @param phone_num Employee phone number
        """
        self._phone_num = phone_num

    def set_hire_date(self, hire_date):
        """
        @brief Set employee hire date
        @param hire_date Employee hire date
        """
        self._hire_date = hire_date

    # =========
    # Methods
    # =========

    def display(self):
        """
        @brief Display employee details
        """
        print(f"Employee ID: {self._staff_id}")
        print(f"Name: {self._name}")
        print(f"Position: {self._position}")
        print(f"Phone Number: {self._phone_num}")
        print(f"Hire Date: {self._hire_date}")
        print()

    def serialize(self):
        """
        @brief Convert employee data into CSV format
        @return Serialized employee data
        """
        return f"{self._staff_id},{self._name},{self._position},{self._phone_num},{self._hire_date}"

    @staticmethod
    def deserialize(data):
        """
        @brief Create an Employee object from a CSV string
        @param data CSV data string
        @return Employee object
        """
        parts = data.split(",")

        if len(parts) < 5:
            return Employee()

        staff_id = int(parts[0]) if parts[0].isdigit() else 0
        name, position, phone_num, hire_date = parts[1:5]

        return Employee(staff_id, name, position, phone_num, hire_date)
