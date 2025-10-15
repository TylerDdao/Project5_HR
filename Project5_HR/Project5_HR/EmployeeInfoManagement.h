#pragma once

#ifndef EMPLOYEE_INFO_MANAGEMENT_H
#define EMPLOYEE_INFO_MANAGEMENT_H

#include "Employee.h"
#include "FileRepository.h"
#include <vector>
#include <string>

using namespace std;

class EmployeeInfoManagement {
private:
    vector<Employee> employees;
    FileRepository* repository;
    string dataFilePath;
    
    Employee* FindById(int id);

public:
    EmployeeInfoManagement();
    EmployeeInfoManagement(FileRepository* repo);
    ~EmployeeInfoManagement();

    // Core CRUD operations
    void AddStaff(const Employee& e);
    void UpdateStaff(int id);
    Employee* GetStaff(int id);
    void RemoveStaff(int id);
    void DisplayAllEmployees() const;
    
    // Check if employee exists
    bool EmployeeExists(int id) const;
    
    // Persistence
    void SaveToFile();
    void LoadFromFile();
    
    // Management UI
    void Management();
};

#endif // EMPLOYEE_INFO_MANAGEMENT_H

