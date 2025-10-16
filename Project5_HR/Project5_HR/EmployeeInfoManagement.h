#pragma once

#ifndef EMPLOYEE_INFO_MANAGEMENT_H
#define EMPLOYEE_INFO_MANAGEMENT_H

#include "Employee.h"
#include "FileRepository.h"
#include <vector>
#include <string>

using namespace std;

/// @brief This is the EmployeeInfoManagement Class
class EmployeeInfoManagement {
private:
    vector<Employee> employees;  ///< List of all employees
    FileRepository* repository;  ///< Pointer to file repository for saving/loading
    string dataFilePath;         ///< File path for employee data
    
    /// @brief Find an employee by ID
    /// @param id Employee ID
    /// @return Pointer to Employee if found, otherwise nullptr
    Employee* FindById(int id);

public:
    /// @brief Default constructor
    EmployeeInfoManagement();

    /// @brief Constructor that accepts an existing repository
    /// @param repo Pointer to FileRepository
    EmployeeInfoManagement(FileRepository* repo);

    /// @brief Destructor
    ~EmployeeInfoManagement();

    // Core CRUD operations
    /// @brief Add a new employee to the system
    /// @param e Employee object
    void AddStaff(const Employee& e);

    /// @brief Update an employee’s details
    /// @param id Employee ID
    void UpdateStaff(int id);

    /// @brief Get an employee by ID
    /// @param id Employee ID
    /// @return Pointer to Employee if found, otherwise nullptr
    Employee* GetStaff(int id);

    /// @brief Remove an employee by ID
    /// @param id Employee ID
    void RemoveStaff(int id);

    /// @brief Display all employee records
    void DisplayAllEmployees() const;
    
    /// @brief Check if an employee exists by ID
    /// @param id Employee ID
    /// @return true if employee exists, false otherwise
    bool EmployeeExists(int id) const;
    
    // Persistence
    /// @brief Save all employee data to file
    void SaveToFile();

    /// @brief Load employee data from file
    void LoadFromFile();
    
    /// @brief Run the management menu interface
    void Management();
};

#endif // EMPLOYEE_INFO_MANAGEMENT_H

