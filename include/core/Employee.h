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
    int getStaffId() const;
    string getName() const;
    string getPosition() const;
    string getPhoneNum() const;
    string getHireDate() const;
    
    // Setters
    void setName(const string& n);
    void setPosition(const string& p);
    void setPhoneNum(const string& num);
    void setHireDate(const string& d);

    // Display
    void display() const;
    
    // Serialization
    string serialize() const;
    static Employee deserialize(const string& data);
};

#endif // EMPLOYEE_H

