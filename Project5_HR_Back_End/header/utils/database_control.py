import psycopg2
from psycopg2 import sql
from typing import Optional
from header.core.account import Account
from header.core.employee import Employee
from header.core.payroll import Payroll
from header.core.shift import Shift


class DatabaseControl:
    def __init__(self, user: str = "postgres", password: str = "Nam@326389", host: str = "localhost",
                 port: str = "5432", database_name: str = "project5_hr"):
        """@brief Initialize DatabaseControl"""
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.database_name = database_name
        self.connection = None

    def set_connection(self) -> bool:
        """@brief Establish a connection to the database"""
        try:
            self.connection = psycopg2.connect(
                user=self.user,
                password=self.password,
                host=self.host,
                port=self.port,
                dbname=self.database_name
            )
            return True
        except Exception as e:
            print(f"Connection error: {e}")
            return False

    def verify_login(self, staff_id: str, password: str) -> bool:
        """@brief Verify login credentials"""
        try:
            self.set_connection()
            if not self.connection:
                print("Set connection failed")
                return False

            with self.connection.cursor() as cur:
                cur.execute(
                    "SELECT password FROM accounts WHERE staff_id = %s;",
                    (staff_id,)
                )
                result = cur.fetchone()
                if result[0] == password:
                    return True
                
                else:
                    return False
                
        except Exception as e:
            print(f"Error verifying login: {e}")
            return False

    def insert_account(self, account: Account) -> Optional[int]:
        """@brief Insert a new account into the database"""
        try:
            self.set_connection()
            if not self.connection:
                return None

            with self.connection.cursor() as cur:
                cur.execute(
                    "INSERT INTO accounts (staff_id, password, account_type) "
                    "VALUES (%s, %s, %s) RETURNING account_id;",
                    (account.staff_id, account.password, account.account_type)
                )
                account_id = cur.fetchone()[0]
                self.connection.commit()
                return account_id
        except Exception as e:
            print(f"Error inserting account: {e}")
            return None

    def insert_payroll(self, payroll: Payroll) -> Optional[int]:
        """@brief Insert a new payroll record"""
        try:
            self.set_connection()
            if not self.connection:
                return None

            with self.connection.cursor() as cur:
                cur.execute(
                    "INSERT INTO payrolls (staff_id, wage_rate, hour_worked, bonus, deduction) "
                    "VALUES (%s, %s, %s, %s, %s) RETURNING payroll_id;",
                    (payroll.staff_id, payroll.wage_rate, payroll.hour_worked,
                     payroll.bonus, payroll.deduction)
                )
                payroll_id = cur.fetchone()[0]
                self.connection.commit()
                return payroll_id
        except Exception as e:
            print(f"Error inserting payroll: {e}")
            return None

    def insert_staff(self, staff: Employee) -> Optional[int]:
        """@brief Insert a new employee"""
        try:
            self.set_connection()
            if not self.connection:
                return None

            with self.connection.cursor() as cur:
                cur.execute(
                    "INSERT INTO employees (name, position, phone_number, hire_date) "
                    "VALUES (%s, %s, %s, %s) RETURNING staff_id;",
                    (staff.name, staff.position, staff.phone_num, staff.hire_date)
                )
                staff_id = cur.fetchone()[0]
                self.connection.commit()
                return staff_id
        except Exception as e:
            print(f"Error inserting employee: {e}")
            return None

    def get_account(self, staff_id: int) -> Optional[Account]:
        """@brief Retrieve an account by staff_id"""
        try:
            self.set_connection()
            if not self.connection:
                return None

            with self.connection.cursor() as cur:
                cur.execute("SELECT * FROM accounts WHERE staff_id = %s;", (staff_id,))
                row = cur.fetchone()
                if row:
                    return Account(row[0], row[1], row[2], row[3])
            return None
        except Exception as e:
            print(f"Error retrieving account: {e}")
            return None

    def get_staff(self, staff_id: int) -> Optional[Employee]:
        """@brief Retrieve an employee by staff_id"""
        try:
            self.set_connection()
            if not self.connection:
                return None

            with self.connection.cursor() as cur:
                cur.execute("SELECT * FROM employees WHERE staff_id = %s;", (staff_id,))
                row = cur.fetchone()
                if row:
                    return Employee(row[0], row[1], row[2], row[3], row[4].isoformat())
            return None
        except Exception as e:
            print(f"Error retrieving employee: {e}")
            return None
        
    def get_staffs_by_shift_id(self, shift_id: int) -> Optional[list[dict]]:
        try:
            self.set_connection()
            if not self.connection:
                return None
            
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT e.staff_id, e.name, e.position, e.phone_number, e.hire_date
                    FROM employees e
                    JOIN shifts_staffs ss ON e.staff_id = ss.staff_id
                    WHERE ss.shift_id = %s
                """, (shift_id,))
                
                rows = cur.fetchall()
                if not rows:
                    return None

                # Convert to list of dicts
                staffs = []
                for r in rows:
                    staffs.append({
                        "staff_id": r[0],
                        "name": r[1],
                        "position": r[2],
                        "phone_number": r[3],
                        "hire_date": r[4].isoformat()
                    })
                return staffs

        except Exception as e:
            print(f"Error retrieving staffs: {e}")
            return None

    def get_shift_by_id(self, shift_id: int) -> Optional[dict]:
        try:
            self.set_connection()
            if not self.connection:
                return None
            
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT shift_id, start_time, end_time
                    FROM shifts
                    WHERE shift_id = %s
                """, (shift_id,))
                
                row = cur.fetchone()
                if not row:
                    return None

                # Convert to dict
                return {
                    "shift_id": row[0],
                    "start_time": row[1].isoformat(),
                    "end_time": row[2].isoformat()
                }

        except Exception as e:
            print(f"Error retrieving shift: {e}")
            return None
        
    def get_all_shifts(self) -> Optional[list[dict]]:
        try:
            self.set_connection()
            if not self.connection:
                return None
            
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT shift_id, start_time, end_time
                    FROM shifts
                    ORDER BY start_time;
                """,)
                
                rows = cur.fetchall()
                if not rows:
                    return None

                shifts = []
                for r in rows:
                    shifts.append({
                        "shift_id": r[0],
                        "start_time": r[1].isoformat(),
                        "end_time": r[2].isoformat()
                    })
                
                return shifts

        except Exception as e:
            print(f"Error retrieving shift: {e}")
            return None

    def __del__(self):
        """@brief Destructor to close connection"""
        if self.connection:
            self.connection.close()
