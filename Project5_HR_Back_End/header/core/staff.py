class Staff:
    """
    @brief This Staff Class represent individual employee and store both personal and
           employement related details such as identification information, job role, contact
           data, hire date, wage rate, login credentials and account type. It provides
           getter and setter methods for managing staff attributes as well as utility functions
           for displaying staff details and serializing/deserialiaing records for file or database storage.

           This class is used throughout the system for staff management, authentication, shift scheduling,
           payroll processing and attendance tracking.

    """

    def __init__(
        self,
        staff_id=0,
        name="",
        position="",
        phone_num="",
        hire_date="",
        wage_rate: float = 0,
        account_type="employee",
        password="employee",
    ):
        """
        @brief Constructor for Staff
        @param staff_id Staff ID
        @param name Staff name
        @param position Staff position
        @param phone_num Staff phone number
        @param hire_date Staff hire date
        """
        self._staff_id = staff_id
        self._name = name
        self._position = position
        self._phone_num = phone_num
        self._hire_date = hire_date
        self._wage_rate = wage_rate
        self._account_type = account_type
        self._password = password

    # =========
    # Getters
    # =========
    def get_password(self):
        return self._password

    def get_account_type(self):
        return self._account_type

    def get_wage_rate(self):
        return self._wage_rate

    def get_staff_id(self):
        """
        @brief Get staff ID
        @return staffId:int
        """
        return self._staff_id

    def get_name(self):
        """
        @brief Get staff name
        @return name:string
        """
        return self._name

    def get_position(self):
        """
        @brief Get staff position
        @return position:string
        """
        return self._position

    def get_phone_num(self):
        """
        @brief Get staff phone number
        @return phoneNum:string
        """
        return self._phone_num

    def get_hire_date(self):
        """
        @brief Get staff hire date
        @return hireDate:string
        """
        return self._hire_date

    # =========
    # Setters
    # =========
    def set_password(self, password):
        self._password = password

    def set_account_type(self, account_type):
        self._account_type = account_type

    def set_wage_rate(self, wage_rate):
        self._wage_rate = wage_rate

    def set_staff_id(self, id):
        self._staff_id = id

    def set_name(self, name):
        """
        @brief Set staff name
        @param name Staff name
        """
        self._name = name

    def set_position(self, position):
        """
        @brief Set staff position
        @param position Staff position
        """
        self._position = position

    def set_phone_num(self, phone_num):
        """
        @brief Set staff phone number
        @param phone_num Staff phone number
        """
        self._phone_num = phone_num

    def set_hire_date(self, hire_date):
        """
        @brief Set staff hire date
        @param hire_date Staff hire date
        """
        self._hire_date = hire_date

    # =========
    # Methods
    # =========

    def display(self):
        """
        @brief Display staff details
        """
        print(f"Staff ID: {self._staff_id}")
        print(f"Name: {self._name}")
        print(f"Position: {self._position}")
        print(f"Phone Number: {self._phone_num}")
        print(f"Hire Date: {self._hire_date}")
        print()

    def serialize(self):
        """
        @brief Convert staff data into CSV format
        @return Serialized staff data
        """
        return f"{self._staff_id},{self._name},{self._position},{self._phone_num},{self._hire_date}"

    @staticmethod
    def deserialize(data):
        """
        @brief Create an staff object from a CSV string
        @param data CSV data string
        @return Staff object
        """
        parts = data.split(",")

        if len(parts) < 5:
            return Staff()

        staff_id = int(parts[0]) if parts[0].isdigit() else 0
        name, position, phone_num, hire_date = parts[1:5]

        return Staff(staff_id, name, position, phone_num, hire_date)
