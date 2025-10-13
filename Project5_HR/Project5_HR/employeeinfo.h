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

    int GetStaffId() const;
    void SetName(const string& n);
    string GetName() const;
    void SetPosition(const string& p);
    string GetPosition() const;
    void SetPhoneNum(const string& num);
    string GetPhoneNum() const;
    void SetHireDate(const string& d);
    string GetHireDate() const;

    void Display() const;
};

class EmployeeInfoManagement {
private:
    vector<Employee> employees;

    int ReadInt(const string& prompt);

    Employee* FindById(int id);

public:
    EmployeeInfoManagement();

    void AddStaff(const Employee& e);
    void UpdateStaff(int id);
    Employee* GetStaff(int id);
    void RemoveStaff(int id);
    void DisplayAllEmployees() const;
    void Management();
    void SaveToFile() const;
    void LoadFromFile();
};

#endif //EMPLOYEE_H
