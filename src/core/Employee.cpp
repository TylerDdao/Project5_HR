#include "../../include/core/Employee.h"
#include <sstream>
#include <iostream>

using namespace std;

Employee::Employee() : staffId(0), name(), position(), phoneNum(), hireDate() {}

Employee::Employee(int id, const string& n, const string& p, const string& num, const string& d)
    : staffId(id), name(n), position(p), phoneNum(num), hireDate(d) {}

int Employee::getStaffId() const {
    return staffId;
}

string Employee::getName() const {
    return name;
}

string Employee::getPosition() const {
    return position;
}

string Employee::getPhoneNum() const {
    return phoneNum;
}

string Employee::getHireDate() const {
    return hireDate;
}

void Employee::setName(const string& n) {
    name = n;
}

void Employee::setPosition(const string& p) {
    position = p;
}

void Employee::setPhoneNum(const string& num) {
    phoneNum = num;
}

void Employee::setHireDate(const string& d) {
    hireDate = d;
}

void Employee::display() const {
    cout << "Employee ID: " << staffId << "\n"
         << "Name: " << name << "\n"
         << "Position: " << position << "\n"
         << "Phone Number: " << phoneNum << "\n"
         << "Hire Date: " << hireDate << "\n" << endl;
}

string Employee::serialize() const {
    stringstream ss;
    ss << staffId << "," << name << "," << position << "," << phoneNum << "," << hireDate;
    return ss.str();
}

Employee Employee::deserialize(const string& data) {
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

