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

    def __init__(self, staff_id=0, wage_rate=0.0, hour_worked=0.0, bonus=0.0, deduction=0.0):
        """
        Constructor for Payroll class.

        Args:
            staff_id (int): Staff ID.
            wage_rate (float): Wage rate.
            hour_worked (float): Hours worked.
            bonus (float): Bonus value.
            deduction (float): Deduction value.
        """
        self.payroll_id = 0
        self.staff_id = staff_id
        self.wage_rate = wage_rate
        self.hour_worked = hour_worked
        self.bonus = bonus
        self.deduction = deduction
        self.total_earned = (hour_worked * wage_rate) + bonus - deduction

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

    def set_hour_worked(self, hour_worked: float) -> bool:
        """Set the number of hours worked."""
        self.hour_worked = hour_worked
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

    def set_total_earned(self) -> bool:
        """Recalculate and update the total earned amount."""
        self.total_earned = (self.hour_worked * self.wage_rate) + self.bonus - self.deduction
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

    def get_hour_worked(self) -> float:
        """Return hours worked."""
        return self.hour_worked

    def get_bonus(self) -> float:
        """Return the bonus."""
        return self.bonus

    def get_deduction(self) -> float:
        """Return the deduction."""
        return self.deduction

    def get_total_earned(self) -> float:
        """Return the total earned."""
        return self.total_earned
