#pragma once

#ifndef EMPLOYEE_H
#define EMPLOYEE_H

#include <iostream>
#include <string>
#include <vector>

using namespace std;

/// @brief This is the Employee Class
class Employee {
private:
    int staffId;
    string name;
    string position;
    string phoneNum;
    string hireDate;

public:
    /// @brief Default constructor
    Employee();

    /// @brief Parameterized constructor
    /// @param id Employee ID
    /// @param n Employee name
    /// @param p Employee position
    /// @param num Employee phone number
    /// @param d Employee hire date
    Employee(int id, const string& n, const string& p, const string& num, const string& d);

    //=========
    // Getters
    //========= 

    /// @brief Get employee ID
    /// @return staffId:int
    int GetStaffId() const;

    /// @brief Get employee name
    /// @return name:string
    string GetName() const;

    /// @brief Get employee position
    /// @return position:string
    string GetPosition() const;

    /// @brief Get employee phone number
    /// @return phoneNum:string
    string GetPhoneNum() const;

    /// @brief Get employee hire date
    /// @return hireDate:string
    string GetHireDate() const;
    
    //=========
    // Setters
    //=========

    /// @brief Set employee name
    /// @param n Employee name
    void SetName(const string& n);

    /// @brief Set employee position
    /// @param p Employee position
    void SetPosition(const string& p);

    /// @brief Set employee phone number
    /// @param num Employee phone number
    void SetPhoneNum(const string& num);

    /// @brief Set employee hire date
    /// @param d Employee hire date
    void SetHireDate(const string& d);

    /// @brief Display employee details
    void Display() const;
    
    /// @brief Convert employee data into CSV string format
    /// @return Serialized employee data
    string Serialize() const;

    /// @brief Create an Employee object from a CSV string
    /// @param data CSV data string
    /// @return Employee object
    static Employee Deserialize(const string& data);
};

#endif // EMPLOYEE_H

