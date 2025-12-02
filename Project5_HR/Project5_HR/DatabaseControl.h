#pragma once
#include <pqxx/pqxx>
#include <string>
#include "Payroll.h"
#include "Employee.h"
#include "Account.h"

class DatabaseControl
{
public:
	DatabaseControl();
	DatabaseControl(std::string user, std::string password, std::string host, std::string port, std::string databaseName);
	bool setConnection();

	bool verifyLogin(int staff_id, string password);

	//Inserters
	int insertAccount(Account account);
	int insertPayroll(Payroll payroll);
	int insertEmployee(Employee employee);

	//Selecters
	bool getAccount(int staff_id, Account& account);
	bool getEmployee(int staff_id, Employee& employee);

	~DatabaseControl();

private:
	std::string user;
	std::string password;
	std::string host;
	std::string port;
	std::string databaseName;
	std::string connectionString;

	std::unique_ptr<pqxx::connection> c;
};

//#include <iostream>
//#include <pqxx/pqxx>
//#include "crow.h"
//
//int main() {
//    try {
//        //std::string conn_str =
//        //    "user=postgres "
//        //    "password=Nam@326389 "
//        //    "host=127.0.0.1 "
//        //    "port=5432 "
//        //    "dbname=test";
//        std::string conn="host=host.docker.internal port=5432 dbname=test user=postgres password=ChangeYourPassWord";
//
//
//        pqxx::connection c(conn);
//
//        if (c.is_open()) {
//            std::cout << "Connected to " << c.dbname() << " successfully.\n";
//        }
//
//        pqxx::work txn(c);
//        pqxx::result r = txn.exec("SELECT version();");
//        std::cout << "PostgreSQL version: " << r[0][0].as<std::string>() << std::endl;
//        txn.commit();
//    }
//    catch (const std::exception& e) {
//        std::cerr << e.what() << std::endl;
//        return 1;
//    }
//
//    return 0;
//}