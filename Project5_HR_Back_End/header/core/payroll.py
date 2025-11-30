class Payroll:
    """
    Payroll class used to store and calculate payroll information.

    Attributes:
        payroll_id (int): Unique payroll ID.
        staff_id (int): Staff member's ID.
        wage_rate (float): Hourly wage rate.
        hour_worked (float): Total hours worked.
        bonus (float): Additional bonus earned.
        deduction (float): Deductions applied.
        total_earned (float): Final payroll amount after calculation.
    """

    def __init__(self, staff_id=0, wage_rate=0.0, hours_worked=0.0, bonus=0.0, deduction=0.0, start_date: str | None = None, end_date: str | None = None):
        """
        Constructor for Payroll class.

        Args:
            staff_id (int): Staff ID.
            wage_rate (float): Wage rate.
            hour_worked (float): Hours worked.
            bonus (float): Bonus value.
            deduction (float): Deduction value.
        """
        self._payroll_id = 0
        self._staff_id = staff_id
        self._wage_rate = wage_rate
        self._hours_worked = hours_worked
        self._bonus = bonus
        self._deduction = deduction
        self._start_date = start_date
        self.end_date = end_date

    # ------------------------
    # Setters
    # ------------------------

    def set_payroll_id(self, payroll_id: int) -> bool:
        """Set the payroll ID."""
        self.payroll_id = payroll_id
        return True

    def set_staff_id(self, staff_id: int) -> bool:
        """Set the staff ID."""
        self.staff_id = staff_id
        return True

    def set_hours_worked(self, hours_worked: float) -> bool:
        """Set the number of hours worked."""
        self.hours_worked = hours_worked
        return True

    def set_wage_rate(self, wage_rate: float) -> bool:
        """Set the wage rate."""
        self.wage_rate = wage_rate
        return True

    def set_bonus(self, bonus: float) -> bool:
        """Set the bonus."""
        self.bonus = bonus
        return True

    def set_deduction(self, deduction: float) -> bool:
        """Set the deduction."""
        self.deduction = deduction
        return True
    
    def set_start_date(self, start_date: str) -> bool:
        self._start_date = start_date
        return True
    
    def set_end_date(self, end_date: str) -> bool:
        self.end_date = end_date
        return True

    # ------------------------
    # Getters
    # ------------------------

    def get_payroll_id(self) -> int:
        """Return the payroll ID."""
        return self.payroll_id

    def get_staff_id(self) -> int:
        """Return the staff ID."""
        return self.staff_id

    def get_wage_rate(self) -> float:
        """Return the wage rate."""
        return self.wage_rate

    def get_hours_worked(self) -> float:
        """Return hours worked."""
        return self.hours_worked

    def get_bonus(self) -> float:
        """Return the bonus."""
        return self.bonus

    def get_deduction(self) -> float:
        """Return the deduction."""
        return self.deduction
    
    def get_start_date(self) -> str:
        return self._start_date
    
    def get_end_date(self) -> str:
        return self.end_date
