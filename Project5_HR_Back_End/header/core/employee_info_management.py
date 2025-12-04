from typing import List, Optional
from employee import Employee
from persistence.file_repository import FileRepository


class EmployeeInfoManagement:
    """
    EmployeeInfoManagement class for managing employee records.

    Attributes:
        employees (list[Employee]): List of employee objects.
        repository (FileRepository): Handles saving/loading data.
        data_file_path (str): Path to employee data file.
    """

    def __init__(self, repo: FileRepository = None):
        """
        Constructor for EmployeeInfoManagement.

        Args:
            repo (FileRepository, optional): Existing repository instance.
        """
        self.employees: List[Employee] = []
        self.repository = repo if repo else FileRepository()
        self.data_file_path = "employees.txt"

    # ----------------------------
    # Internal helper
    # ----------------------------
    def _find_by_id(self, emp_id: int) -> Optional[Employee]:
        """
        Find employee by ID.

        Args:
            emp_id (int): Employee ID.

        Returns:
            Employee | None: Employee object if found.
        """
        for emp in self.employees:
            if emp.staff_id == emp_id:
                return emp
        return None

    # ----------------------------
    # CRUD Operations
    # ----------------------------
    def add_staff(self, e: Employee) -> None:
        """Add a new employee."""
        if self._find_by_id(e.staff_id):
            print(f"Employee with ID {e.staff_id} already exists. Add cancelled.")
            return

        self.employees.append(e)
        print(f"Employee {e.name} added successfully.")
        self.save_to_file()

    def update_staff(self, emp_id: int):
        """Update employee details."""
        e = self._find_by_id(emp_id)
        if not e:
            print(f"Employee with ID {emp_id} not found.")
            return

        while True:
            print(f"\nUpdating employee {e.name} (ID {e.staff_id})")
            print("1. Name")
            print("2. Position")
            print("3. Phone Number")
            print("4. Hire Date")
            print("0. Done/Cancel")

            choice = input("Enter your choice: ")

            if choice == "1":
                e.name = input("Enter new name: ")
                print("Name updated.")
            elif choice == "2":
                e.position = input("Enter new position: ")
                print("Position updated.")
            elif choice == "3":
                e.phone_num = input("Enter new phone number: ")
                print("Phone number updated.")
            elif choice == "4":
                e.hire_date = input("Enter new hire date (YYYY-MM-DD): ")
                print("Hire date updated.")
            elif choice == "0":
                print("Exiting update menu.")
                break
            else:
                print("Invalid choice. Try again.")

        self.save_to_file()

    def get_staff(self, emp_id: int) -> Optional[Employee]:
        """Return an Employee object by ID."""
        return self._find_by_id(emp_id)

    def remove_staff(self, emp_id: int) -> None:
        """Remove employee by ID."""
        for i, e in enumerate(self.employees):
            if e.staff_id == emp_id:
                print(f"Employee {e.name} removed.")
                del self.employees[i]
                self.save_to_file()
                return
        print(f"Employee with ID {emp_id} not found.")

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

        self.employees.clear()
        lines = self.repository.read_lines(self.data_file_path)

        for ln in lines:
            if ln.strip():
                emp = Employee.deserialize(ln.strip())
                if emp.staff_id != 0:
                    self.employees.append(emp)

        print(f"Loaded {len(self.employees)} employees from file.")

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

                self.add_staff(Employee(emp_id, name, pos, phone, date))

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
