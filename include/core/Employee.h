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
    Employee(int id, const string& n, const string& p, const string& num, const string& d);

    // Getters
    int GetStaffId() const;
    string GetName() const;
    string GetPosition() const;
    string GetPhoneNum() const;
    string GetHireDate() const;
    
    // Setters
    void SetName(const string& n);
    void SetPosition(const string& p);
    void SetPhoneNum(const string& num);
    void SetHireDate(const string& d);

    // Display
    void Display() const;
    
    // Serialization
    string Serialize() const;
    static Employee Deserialize(const string& data);
};

#endif // EMPLOYEE_H

