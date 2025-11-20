import psycopg2
from psycopg2 import sql
from typing import Optional
from header.core.account import Account
from header.core.staff import Staff
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
                    (account.get_staff_id(), account.get_password(), account.get_account_type())
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

    def insert_staff(self, staff: Staff) -> Optional[int]:
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
        
    def insert_shift(self, shift: Shift) -> Optional[int]:
        """@brief Insert a new shift"""
        try:
            self.set_connection()
            if not self.connection:
                return None

            with self.connection.cursor() as cur:
                cur.execute(
                    "INSERT INTO shifts (start_time, end_time) "
                    "VALUES (%s, %s) RETURNING shift_id;",
                    (shift.get_start_time(), shift.get_end_time(),)
                )
                shift_id = cur.fetchone()[0]
                staff_ids = shift.get_staffs()
                for staff_id in staff_ids:
                    cur.execute("INSERT INTO shifts_staffs (shift_id, staff_id) VALUES (%s, %s)", (shift_id, staff_id,))
                self.connection.commit()
                return shift_id
        except Exception as e:
            print(f"Error inserting employee: {e}")
            return None
        
    def update_shift(self, shift: Shift) -> Optional[int]:
        try:
            self.set_connection()
            if not self.connection:
                return None
            
            with self.connection.cursor() as cur:
                shift_id = shift.get_shift_id()
                start_time = shift.get_start_time()
                end_time = shift.get_end_time()

                cur.execute("""
                    UPDATE shifts
                    SET start_time = %s, end_time = %s
                    WHERE shift_id = %s;
                """, (start_time, end_time, shift_id,))

                cur.execute("DELETE FROM shifts_staffs WHERE shift_id = %s", (shift_id,))
                staff_ids = shift.get_staffs()
                for staff_id in staff_ids:
                    cur.execute("INSERT INTO shifts_staffs (shift_id, staff_id) VALUES (%s, %s)", (shift_id, staff_id,))
                self.connection.commit()
                return True
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

    def get_staff_by_id(self, staff_id: int) -> Optional[Staff]:
        """@brief Retrieve an employee by staff_id"""
        try:
            self.set_connection()
            if not self.connection:
                return None

            with self.connection.cursor() as cur:
                cur.execute("SELECT * FROM employees WHERE staff_id = %s;", (staff_id,))
                row = cur.fetchone()
                if row:
                    return Staff(row[0], row[1], row[2], row[3], row[4].isoformat())
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
        
    def get_scheduled_and_active_shifts(self) -> Optional[list[dict]]:
        try:
            self.set_connection()
            if not self.connection:
                return None
            
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT shift_id, start_time, end_time
                    FROM shifts
                    WHERE start_time > NOW() OR (start_time < NOW() AND end_time > NOW())
                    ORDER BY start_time
                    LIMIT 1000;
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
        
    def get_done_shifts(self) -> Optional[list[dict]]:
        try:
            self.set_connection()
            if not self.connection:
                return None
            
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT shift_id, start_time, end_time
                    FROM shifts
                    WHERE end_time < NOW()
                    ORDER BY start_time
                    LIMIT 1000;
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
        
    def get_this_week_shifts(self, staff_id: int) -> Optional[list[dict]]:
        try:
            self.set_connection()
            if not self.connection:
                return None
            with self.connection.cursor() as cur:
                cur.execute("""SELECT s.*
                                FROM shifts s
                                JOIN shifts_staffs ss ON s.shift_id = ss.shift_id
                                WHERE ss.staff_id = %s  -- replace 1 with the staff ID you want
                                AND s.start_time >= date_trunc('week', CURRENT_DATE)
                                AND s.start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days';
                            """, (staff_id,))
                rows =cur.fetchall()
                if not rows:
                    return None
                
                shifts=[]
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
        
    def get_next_week_shifts(self, staff_id: int) -> Optional[list[dict]]:
        try:
            self.set_connection()
            if not self.connection:
                return None
            with self.connection.cursor() as cur:
                cur.execute("""SELECT s.*
                                FROM shifts s
                                JOIN shifts_staffs ss ON s.shift_id = ss.shift_id
                                WHERE ss.staff_id = %s  -- replace 1 with the staff ID
                                AND s.start_time >= date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
                                AND s.start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '2 week';
                            """, (staff_id,))
                rows =cur.fetchall()
                if not rows:
                    return None
                
                shifts=[]
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
        
    def get_staffs(self, page:int)-> Optional[list[dict]]:
        try:
            self.set_connection()
            if not self.connection:
                return None
            with self.connection.cursor() as cur:
                cur.execute("""SELECT * FROM employees LIMIT 100 OFFSET %s
                            """,((page-1)*100,))
                rows =cur.fetchall()
                if not rows:
                    return None
                
                staffs=[]
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
            print(f"Error retrieving shift: {e}")
            return None
        
    def get_total_staffs(self):
        try:
            self.set_connection()
            if not self.connection:
                return None
            with self.connection.cursor() as cur:
                cur.execute("""SELECT COUNT(*) FROM employees
                            """,)
                row =cur.fetchone()
                return row[0]
        except Exception as e:
            print(f"Error retrieving shift: {e}")
            return None
        
    def verify_shift_id(self, shift_id: int)->bool:
        try:
            self.set_connection()
            if not self.connection:
                return None
            with self.connection.cursor() as cur:
                cur.execute("""SELECT COUNT(*) FROM shifts WHERE shift_id = %s""", (shift_id,))
                row =cur.fetchone()
                if row is None:
                    return True
                else:
                    return False
        except Exception as e:
            print(f"Error retrieving shift: {e}")
            return None

    def __del__(self):
        """@brief Destructor to close connection"""
        if self.connection:
            self.connection.close()
