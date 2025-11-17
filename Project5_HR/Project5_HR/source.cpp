#define _CRT_SECURE_NO_WARNINGS
#include <jwt-cpp/jwt.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <crow.h>
#include <crow/middlewares/cors.h>
#include <cstdlib>
#include "Payroll.h"
#include "DatabaseControl.h"

bool tokenChecker(auto auth) {
    try {
        if (auth.empty() || auth.substr(0, 7) != "Bearer ") {
            return false;
        }

        std::string token = auth.substr(7);

        auto decoded = jwt::decode(token);

        jwt::verify()
            .allow_algorithm(jwt::algorithm::hs256{ "my_secret_key" })
            .with_issuer("project5_hr")
            .verify(decoded);
        return true;
    }
    catch (const std::exception& e) {
        return false;
    }
}

auto tokenDeconder(auto auth) {
    std::string token = auth.substr(7);
    auto decoded = jwt::decode(token);
    return decoded;
}

int main()
{
    DatabaseControl db("postgres", "Nam@326389", "127.0.0.1", "5432", "project5_hr");

    //Employee e;
    //db.getEmployee(1, e);
    //cout << e.GetHireDate();

    //dotenv::init();

    //std::cout << std::getenv("SECRET_KEY") << std::endl;

    crow::App<crow::CORSHandler> app;

    auto& cors = app.get_middleware<crow::CORSHandler>();
   /* cors.global()
        .origin("http://localhost:5173");*/

    cors.global()
        .origin("http://localhost:5173")  //frontend host
        .allow_credentials();

    CROW_ROUTE(app, "/")([]() {
        return "Hello world";
        });

    CROW_ROUTE(app, "/token")([] {
        //using json = nlohmann::json;

        //json user = { {"name", "Tyler"}, {"phone", "0987654321"} };
        //json account = { {"role", "Manager"}, {"id", "1"} };
        crow::json::wvalue result;
        result["user"]["name"] = "Tyler";
        result["user"]["phone"] = "0987654321";
        result["account"]["role"] = "Manager";
        result["account"]["id"] = "1";

        auto token = jwt::create()
            .set_issuer("project5_hr")
            .set_payload_claim("user", jwt::claim(result["user"].dump()))
            .set_payload_claim("account", jwt::claim(result["account"].dump()))
            .sign(jwt::algorithm::hs256{ "my_secret_key"});
        
        result["token"] = token;
        

        return crow::response(result);  // <--- must return
    });

    CROW_ROUTE(app, "/verify-token").methods("GET"_method)([](const crow::request& req) {
        try {
            auto auth = req.get_header_value("Authorization");
            if (tokenChecker(auth)) {
                auto decoded = tokenDeconder(auth);

                nlohmann::json user = nlohmann::json::parse(decoded.get_payload_claim("user").as_string());
                nlohmann::json account = nlohmann::json::parse(decoded.get_payload_claim("account").as_string());

                std::cout << user["name"] << std::endl;
                std::cout << account["id"] << std::endl;

                return crow::response(200, "ok");
            }
            else {
                throw exception("Invalid token");
            }
        }
        catch (const std::exception& e) {
            crow::json::wvalue err;
            err["success"] = false;
            err["message"] = e.what();
            return crow::response(401, err);
        }
    });

    CROW_ROUTE(app, "/login").methods(crow::HTTPMethod::Post)([&db](const crow::request& req) {
        try {
            auto body = crow::json::load(req.body);
            if (!body) {
                return crow::response(400, "Invalid JSON");
            }

            int staff_id = body["staff_id"].i();
            std::string password = body["password"].s();

            bool ok = db.verifyLogin(staff_id, password);

            crow::json::wvalue result;
            if (ok) {
                Account a;
                Employee e;
                db.getAccount(staff_id, a);
                db.getEmployee(staff_id, e);
                result["success"] = true;
                result["message"] = "Login successful";
                result["user"]["id"] = e.GetStaffId();
                result["user"]["name"] = e.GetName();
                result["user"]["hire_date"] = e.GetHireDate();
                result["user"]["phone_number"] = e.GetPhoneNum();
                result["account"]["id"] = a.getAccountId();
                result["account"]["role"] = a.getAccountType();

                auto token = jwt::create()
                    .set_issuer("project5_hr")
                    .set_payload_claim("user", jwt::claim(result["user"].dump()))      // serialize to string
                    .set_payload_claim("account", jwt::claim(result["account"].dump())) // serialize to string
                    .sign(jwt::algorithm::hs256{ "secret" });

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
    app.port(5000).run();
}