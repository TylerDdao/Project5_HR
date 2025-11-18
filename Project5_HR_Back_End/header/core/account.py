# header/core/account.py

class Account:
    """
    @brief This is the Account class
    """

    def __init__(self, account_id:int=None, staff_id: int =None, password: str ="", account_type: str=""):
        """
        @brief Constructor for Account
        @param account_id int: The account ID
        @param staff_id int: The staff ID
        @param password str: The password
        @param account_type str: Type of account (e.g., "Manager", "Staff")
        """
        self._account_id = account_id
        self._staff_id = staff_id
        self._password = password
        self._account_type = account_type

    # --- Setters ---
    def set_account_id(self, account_id: int) -> bool:
        """
        @brief Set account ID
        @param account_id int: New account ID
        @return bool: True if successful
        """
        self._account_id = account_id
        return True

    def set_staff_id(self, staff_id: int) -> bool:
        """
        @brief Set staff ID
        @param staff_id int: New staff ID
        @return bool: True if successful
        """
        self._staff_id = staff_id
        return True

    def set_password(self, password: str) -> bool:
        """
        @brief Set password
        @param password str: New password
        @return bool: True if successful
        """
        self._password = password
        return True

    def set_account_type(self, account_type: str) -> bool:
        """
        @brief Set account type
        @param account_type str: New account type
        @return bool: True if successful
        """
        self._account_type = account_type
        return True

    # --- Getters ---
    def get_account_id(self) -> int:
        """
        @brief Get account ID
        @return int: Current account ID
        """
        return self._account_id

    def get_staff_id(self) -> int:
        """
        @brief Get staff ID
        @return int: Current staff ID
        """
        return self._staff_id

    def get_password(self) -> str:
        """
        @brief Get password
        @return str: Current password
        """
        return self._password

    def get_account_type(self) -> str:
        """
        @brief Get account type
        @return str: Current account type
        """
        return self._account_type
