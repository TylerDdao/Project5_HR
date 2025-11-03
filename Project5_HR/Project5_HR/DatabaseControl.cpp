#include "DatabaseControl.h"
#include <iostream>
using namespace pqxx;

DatabaseControl::DatabaseControl()
{
}

DatabaseControl::DatabaseControl(std::string user, std::string password, std::string host, std::string port, std::string databaseName)
{
	this->user = user;
	this->password = password;
	this->host = host;
	this->port = port;
	this->databaseName = databaseName;
	this->connectionString = "user=" + user + " password=" + password + " host=" + host + " port=" + port + " dbname=" + databaseName;
}

bool DatabaseControl::setConnection()
{
    try
    {
        std::cout << connectionString << std::endl;
        c = std::make_unique<pqxx::connection>(connectionString);
        if (c->is_open())
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    catch (const std::exception& e)
    {
        std::cerr << "Connection error: " << e.what() << std::endl;
        return false;
    }
}

bool DatabaseControl::verifyLogin(int staff_id, string password)
{
    try
    {
        setConnection();
        if (!c || !c->is_open())
        {
            std::cerr << "Database connection not open.\n";
            return false;
        }

        pqxx::work txn(*c);

        pqxx::result r = txn.exec_params(
            "SELECT * FROM accounts WHERE staff_id = $1 AND password = $2;",
            staff_id, password
        );

        txn.commit();

        if (!r.empty() && r[0]["staff_id"].as<int>() == staff_id) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (const std::exception& e)
    {
        std::cerr << "Error inserting employee: " << e.what() << std::endl;
        return false;
    }
}

int DatabaseControl::insertAccount(Account account)
{
    try
    {
        setConnection();
        if (!c || !c->is_open())
        {
            std::cerr << "Database connection is not open.\n";
            return false;
        }

        pqxx::work txn(*c);

        std::string query =
            "INSERT INTO accounts (staff_id, password, account_type) VALUES (" +
            txn.quote(account.getStaffId()) + ", " +
            txn.quote(account.getPassword()) + ", " +
            txn.quote(account.getAccountType()) +
            ") RETURNING account_id;";

        pqxx::result r = txn.exec(query);

        int accountId = r[0][0].as<int>();

        txn.commit();
        return accountId;
    }
    catch (const std::exception& e)
    {
        std::cerr << "Error inserting payroll: " << e.what() << std::endl;
        return false;
    }
}

int DatabaseControl::insertPayroll(Payroll payroll)
{
    try
    {
        setConnection();
        if (!c || !c->is_open())
        {
            std::cerr << "Database connection is not open.\n";
            return false;
        }

        pqxx::work txn(*c);

        std::string query =
            "INSERT INTO payrolls (staff_id, wage_rate, hour_worked, bonus, deduction) VALUES (" +
            txn.quote(payroll.getStaffId()) + ", " +
            txn.quote(payroll.getWageRate()) + ", " +
            txn.quote(payroll.getHourWorked()) + ", " +
            txn.quote(payroll.getBonus()) + ", " +
            txn.quote(payroll.getDeduction()) +
            ") RETURNING payroll_id;";

        pqxx::result r = txn.exec(query);

        int newPayrollId = r[0][0].as<int>();

        txn.commit();
        return newPayrollId;
    }
    catch (const std::exception& e)
    {
        std::cerr << "Error inserting payroll: " << e.what() << std::endl;
        return false;
    }
}

int DatabaseControl::insertEmployee(Employee employee)
{
    try
    {
        setConnection();
        if (!c || !c->is_open())
        {
            std::cerr << "Database connection not open.\n";
            return false;
        }

        pqxx::work txn(*c);

        std::string query =
            "INSERT INTO employees (name, position, phone_number, hire_date) VALUES (" +
            txn.quote(employee.GetName()) + ", " +
            txn.quote(employee.GetPosition()) + ", " +
            txn.quote(employee.GetPhoneNum()) + ", " +
            txn.quote(employee.GetHireDate()) +
            ") RETURNING staff_id;";

        pqxx::result r = txn.exec(query);

        int newStaffId = r[0][0].as<int>();

        txn.commit();
        return newStaffId;
    }
    catch (const std::exception& e)
    {
        std::cerr << "Error inserting employee: " << e.what() << std::endl;
        return false;
    }
}

bool DatabaseControl::getAccount(int staff_id, Account& account)
{
    try
    {
        setConnection();
        if (!c || !c->is_open())
        {
            std::cerr << "Database connection not open.\n";
            return false;
        }

        pqxx::work txn(*c);

        pqxx::result r = txn.exec_params(
            "SELECT * FROM accounts WHERE staff_id = $1;",
            staff_id
        );

        int accountId = r[0]["account_id"].as<int>();
        int staffId = r[0]["staff_id"].as<int>();
        string password = r[0]["password"].as<string>();
        string accountType = r[0]["account_type"].as<string>();

        txn.commit();
        account.setAccountId(accountId);
        account.setAccountType(accountType);
        account.setPassword(password);
        account.setStaffId(staffId);

        return true;
    }
    catch (const std::exception& e)
    {
        std::cerr << "Error inserting employee: " << e.what() << std::endl;
        return false;
    }
}

DatabaseControl::~DatabaseControl()
{
}