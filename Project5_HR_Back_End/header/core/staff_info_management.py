from typing import List, Optional
from header.core.staff import Staff
from persistence.file_repository import FileRepository


class StaffInfoManagement:
    """
    StaffInfoManagement class for managing staff records.

    Attributes:
        staff (list[Staff]): List of staff objects.
        repository (FileRepository): Handles saving/loading data.
        data_file_path (str): Path to staff data file.
    """

    def __init__(self, repo: FileRepository = None):
        """
        Constructor for StaffInfoManagement.

        Args:
            repo (FileRepository, optional): Existing repository instance.
        """
        self.staffs: List[Staff] = []
        self.repository = repo if repo else FileRepository()
        self.data_file_path = "employees.txt"

    # ----------------------------
    # Internal helper
    # ----------------------------
    def _find_by_id(self, staff_id: int) -> Optional[Staff]:
        """
        Find staff by ID.

        Args:
            staff_id (int): Staff ID.

        Returns:
            Employee | None: Employee object if found.
        """
        for staff in self.staffs:
            if staff.get_staff_id() == staff_id:
                return staff
        return None

    # ----------------------------
    # CRUD Operations
    # ----------------------------
    def add_staff(self, s: Staff) -> None:
        """Add a new employee."""
        if self._find_by_id(s.get_staff_id()):
            print(f"Employee with ID {s.get_staff_id()} already exists. Add cancelled.")
            return

        self.staffs.append(s)
        print(f"Employee {s.get_name()} added successfully.")
        self.save_to_file()

    def update_staff(self, staff_id: int):
        """Update employee details."""
        s = self._find_by_id(staff_id)
        if not s:
            print(f"Employee with ID {staff_id} not found.")
            return

        while True:
            print(f"\nUpdating employee {s.get_name()} (ID {s.get_staff_id})")
            print("1. Name")
            print("2. Position")
            print("3. Phone Number")
            print("4. Hire Date")
            print("0. Done/Cancel")

            choice = input("Enter your choice: ")

            if choice == "1":
                staff_name = input("Enter new name: ")
                s.set_name(staff_name)
                print("Name updated.")
            elif choice == "2":
                staff_position = input("Enter new position: ")
                s.set_position(staff_position)
                print("Position updated.")
            elif choice == "3":
                staff_phone_num = input("Enter new phone number: ")
                s.set_phone_num(staff_phone_num)
                print("Phone number updated.")
            elif choice == "4":
                staff_hire_date = input("Enter new hire date (YYYY-MM-DD): ")
                s.set_hire_date(staff_hire_date)
                print("Hire date updated.")
            elif choice == "0":
                print("Exiting update menu.")
                break
            else:
                print("Invalid choice. Try again.")

        self.save_to_file()

    def get_staff(self, staff_id: int) -> Optional[Staff]:
        """Return an Employee object by ID."""
        return self._find_by_id(staff_id)

    def remove_staff(self, staff_id: int) -> None:
        """Remove employee by ID."""
        for i, s in enumerate(self.staffs):
            if s.get_staff_id() == staff_id:
                print(f"Employee {s.get_name()} removed.")
                del self.staffs[i]
                self.save_to_file()
                return
        print(f"Employee with ID {staff_id} not found.")

    def display_all_employees(self):
        """Print all employee records."""
        print("\n==== Employee List ====")
        if not self.employees:
            print("No employees in the system.")
            return
        for e in self.employees:
            e.display()

    def employee_exists(self, emp_id: int) -> bool:
        """Check if employee exists."""
        return self._find_by_id(emp_id) is not None

    # ----------------------------
    # File Persistence
    # ----------------------------
    def save_to_file(self):
        """Save all employee data to file."""
        if not self.repository:
            print("Error: Repository not initialized.")
            return

        content = "\n".join(emp.serialize() for emp in self.employees)
        self.repository.save_to_file(content, self.data_file_path)
        print("Employee data saved successfully.")

    def load_from_file(self):
        """Load employees from file."""
        if not self.repository.file_exists(self.data_file_path):
            print("No existing employee data found.")
            return

        self.staffs.clear()
        lines = self.repository.read_lines(self.data_file_path)

        for ln in lines:
            if ln.strip():
                staff = Staff.deserialize(ln.strip())
                if staff.get_staff_id() != 0:
                    self.staffs.append(staff)

        print(f"Loaded {len(self.staffs)} employees from file.")

    # ----------------------------
    # Management Menu
    # ----------------------------
    def management(self):
        """Run interactive console menu."""
        while True:
            print("\n==== Employee Info Management System ====")
            print("1. Add Employee")
            print("2. Update Employee")
            print("3. Get Employee")
            print("4. Remove Employee")
            print("5. Display All Employees")
            print("0. Back to Main Menu")

            choice = input("Enter your choice: ")

            if choice == "1":
                try:
                    emp_id = int(input("Enter Employee ID: "))
                except ValueError:
                    print("Invalid number.")
                    continue

                if self._find_by_id(emp_id):
                    print("Employee already exists.")
                    continue

                name = input("Enter name: ")
                pos = input("Enter position: ")
                phone = input("Enter phone number: ")
                date = input("Enter hire date (YYYY-MM-DD): ")

                self.add_staff(Staff(emp_id, name, pos, phone, date))

            elif choice == "2":
                emp_id = int(input("Enter Employee ID to update: "))
                self.update_staff(emp_id)

            elif choice == "3":
                emp_id = int(input("Enter Employee ID: "))
                emp = self.get_staff(emp_id)
                if emp:
                    emp.display()
                else:
                    print("Employee not found.")

            elif choice == "4":
                emp_id = int(input("Enter Employee ID to remove: "))
                self.remove_staff(emp_id)

            elif choice == "5":
                self.display_all_employees()

            elif choice == "0":
                print("Returning to main menu...")
                break

            else:
                print("Invalid choice, try again.")
