class ShiftRecord:
    def __init__(self, shift_record_id: int = 0, staff_id: int = 0, shift_id: int = 0, check_in: str | None = None, check_out: str | None = None):
        """@brief Initialize a ShiftRecord object"""
        self._shift_record_id = shift_record_id
        self._staff_id = staff_id
        self._shift_id = shift_id
        self._check_in = check_in
        self._check_out = check_out

    def set_shift_id(self, shift_record_id: int) -> bool:
        self._shift_record_id = shift_record_id
        return True

    def set_shift_id(self, shift_id: int) -> bool:
        """@brief Set the shift ID"""
        self._shift_id = shift_id
        return True

    def set_staff_id(self, staff_id: int) -> bool:
        """@brief Set the staff ID"""
        self._staff_id = staff_id
        return True

    def set_check_in(self, check_in: str) -> bool:
        """@brief Set check-in time"""
        self._check_in = check_in
        return True

    def set_check_out(self, check_out: str) -> bool:
        """@brief Set check-out time"""
        self._check_out = check_out
        return True
    
    def get_shift_record_id(self) -> int:
        return self._shift_record_id

    def get_shift_id(self) -> int:
        """@brief Get the shift ID"""
        return self._shift_id

    def get_staff_id(self) -> int:
        """@brief Get the staff ID"""
        return self._staff_id

    def get_check_in(self):
        """@brief Get check-in time"""
        return self._check_in

    def get_check_out(self):
        """@brief Get check-out time"""
        return self._check_out
