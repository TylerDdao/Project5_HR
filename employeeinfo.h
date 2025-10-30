#pragma once

#ifndef EMPLOYEE_H
#define EMPLOYEE_H

#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Employee {
private:
    int staffId;
    string name;
    string position;
    string phoneNum;
    string hireDate;

public:
    Employee();
    Employee(int id, const string& n, const string& p,
        const string& num, const string& d);

    int getStaffId() const;
    void setName(const string& n);
    string getName() const;
    void setPosition(const string& p);
    string getPosition() const;
    void setPhoneNum(const string& num);
    string getPhoneNum() const;
    void setHireDate(const string& d);
    string getHireDate() const;

    void display() const;
};

class EmployeeInfoManagement {
private:
    vector<Employee> employees;

    int readInt(const string& prompt);

    Employee* findById(int id);

public:
    EmployeeInfoManagement();

    void addStaff(const Employee& e);
    void updateStaff(int id);
    Employee* getStaff(int id);
    void removeStaff(int id);
    void displayAllEmployees() const;
    void management();
    void saveToFile() const;
    void loadFromFile();
};

#endif //EMPLOYEE_H
