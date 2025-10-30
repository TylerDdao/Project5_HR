//#include <iostream>
//#include "Employee.h"
//
//using namespace std;
////int add(int x, int y) {
////	return y + x;
////}
////
////int minus(int a, int b) {
////	return a - b;
////}
//
//int main() {
//	//cout << add(2, 6) << endl;
//
//	cout << "Hello World";
//
//	//EmployeeInfoManagement manage;
//	//manage.LoadFromFile();
//	//manage.Management();
//	//manage.SaveToFile();
//
//
//	return 0;
//}

#include <iostream>
#include <pqxx/pqxx>

int main() {
    try {
        std::string conn_str =
            "user=postgres "
            "password=password "
            "host=127.0.0.1 "
            "port=5432 "
            "dbname=test";

        pqxx::connection c(conn_str);

        if (c.is_open()) {
            std::cout << "Connected to " << c.dbname() << " successfully.\n";
        }

        pqxx::work txn(c);
        pqxx::result r = txn.exec("SELECT version();");
        std::cout << "PostgreSQL version: " << r[0][0].as<std::string>() << std::endl;
        txn.commit();
    }
    catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
        return 1;
    }

    return 0;
}
