#include "../../include/core/Employee.h"
#include <sstream>
#include <iostream>

using namespace std;

Employee::Employee() : staffId(0), name(), position(), phoneNum(), hireDate() {}

Employee::Employee(int id, const string& n, const string& p, const string& num, const string& d)
    : staffId(id), name(n), position(p), phoneNum(num), hireDate(d) {}

int Employee::GetStaffId() const {
    return staffId;
}

string Employee::GetName() const {
    return name;
}

string Employee::GetPosition() const {
    return position;
}

string Employee::GetPhoneNum() const {
    return phoneNum;
}

string Employee::GetHireDate() const {
    return hireDate;
}

void Employee::SetName(const string& n) {
    name = n;
}

void Employee::SetPosition(const string& p) {
    position = p;
}

void Employee::SetPhoneNum(const string& num) {
    phoneNum = num;
}

void Employee::SetHireDate(const string& d) {
    hireDate = d;
}

void Employee::Display() const {
    cout << "Employee ID: " << staffId << "\n"
         << "Name: " << name << "\n"
         << "Position: " << position << "\n"
         << "Phone Number: " << phoneNum << "\n"
         << "Hire Date: " << hireDate << "\n" << endl;
}

string Employee::Serialize() const {
    stringstream ss;
    ss << staffId << "," << name << "," << position << "," << phoneNum << "," << hireDate;
    return ss.str();
}

Employee Employee::Deserialize(const string& data) {
    stringstream ss(data);
    string idStr, name, position, phone, date;
    
    getline(ss, idStr, ',');
    getline(ss, name, ',');
    getline(ss, position, ',');
    getline(ss, phone, ',');
    getline(ss, date, ',');
    
    if (!idStr.empty()) {
        return Employee(stoi(idStr), name, position, phone, date);
    }
    
    return Employee();
}

