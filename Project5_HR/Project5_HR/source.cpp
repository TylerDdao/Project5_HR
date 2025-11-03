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

//#include <iostream>
//#include <pqxx/pqxx>
//
//int main() {
//    try {
//        std::string conn_str =
//            "user=postgres "
//            "password=Nam@326389 "
//            "host=127.0.0.1 "
//            "port=5432 "
//            "dbname=test";
//        std::string conn="host=host.docker.internal port=5432 dbname=test user=postgres password=ChangeYourPassWord";
//
//
//        pqxx::connection c(conn_str);
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


//#include <crow.h>
//#include <iostream>
//#include "Payroll.h"
//#include "DatabaseControl.h"
//
//int main()
//{
//    Payroll payroll(1, 18, 5, 0, 0);
//    DatabaseControl db("postgres", "Nam@326389", "127.0.0.1", "5432", "test");
//    bool result = db.insertPayroll(payroll);
//    std::cout << result << std::endl;
//    //crow::SimpleApp app;
//
//    //CROW_ROUTE(app, "/")([]() {
//    //    return "Hello world";
//    //    });
//
//    //app.port(18080).run();
//}

#include <iostream>
#include <crow.h>
#include "Payroll.h"
#include "DatabaseControl.h"
int main()
{
    DatabaseControl db("postgres", "Nam@326389", "127.0.0.1", "5432", "project5_hr");


    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([]() {
        return "Hello world";
        });

    CROW_ROUTE(app, "/login").methods(crow::HTTPMethod::Post)([&db](const crow::request& req) {
        try {
            // Parse JSON body
            auto body = crow::json::load(req.body);
            if (!body) {
                return crow::response(400, "Invalid JSON");
            }

            // Extract staff_id and password
            int staff_id = body["staff_id"].i();
            std::string password = body["password"].s();

            // Call your database check
            bool ok = db.verifyLogin(staff_id, password);

            // Return JSON response
            crow::json::wvalue result;
            if (ok) {
                result["success"] = true;
                result["message"] = "Login successful";
                return crow::response(200, result);
            }
            else {
                result["success"] = false;
                result["message"] = "Invalid staff ID or password";
                return crow::response(401, result);
            }

        }
        catch (const std::exception& e) {
            crow::json::wvalue result;
            result["success"] = false;
            result["message"] = e.what();
            return crow::response(500, result);
            //return crow::response(500, std::string("Server error: ") + e.what());
        }
        });

    app.port(18080).run();


    //Employee employee;
    //employee.SetName("Tyler");
    //employee.SetPosition("Manager");
    //employee.SetHireDate("2025-10-31");
    //employee.SetPhoneNum("5483843681");

    ////db.setConnection();
    //int staffId = db.insertEmployee(employee);
    //std::cout <<"Staff ID: "<< staffId << std::endl;

    //Account account;
    //account.setStaffId(staffId);
    //account.setAccountType("Manager");
    //account.setPassword("123");
    //int accountId = db.insertAccount(account);
    //std::cout << "Account ID: " << accountId << std::endl;

    //Payroll payroll(staffId, 18, 5, 0, 0);
    //int payrollId = db.insertPayroll(payroll);
    //std::cout << "Payroll ID: " << payrollId << std::endl;
    //return 0;
}