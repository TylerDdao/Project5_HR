#pragma once

#ifndef EMPLOYEE_INFO_MANAGEMENT_H
#define EMPLOYEE_INFO_MANAGEMENT_H

#include "Employee.h"
#include "../persistence/FileRepository.h"
#include <vector>
#include <string>

using namespace std;

class EmployeeInfoManagement {
private:
    vector<Employee> employees;
    FileRepository* repository;
    string dataFilePath;
    
    Employee* findById(int id);

public:
    EmployeeInfoManagement();
    EmployeeInfoManagement(FileRepository* repo);
    ~EmployeeInfoManagement();

    // Core CRUD operations
    void addStaff(const Employee& e);
    void updateStaff(int id);
    Employee* getStaff(int id);
    void removeStaff(int id);
    void displayAllEmployees() const;
    
    // Check if employee exists
    bool employeeExists(int id) const;
    
    // Persistence
    void SaveToFile();
    void LoadFromFile();
    
    // Management UI
    void management();
};

#endif // EMPLOYEE_INFO_MANAGEMENT_H

