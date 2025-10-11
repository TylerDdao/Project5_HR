#include "../../include/core/EmployeeInfoManagement.h"
#include "../../include/utils/InputValidator.h"
#include <iostream>
#include <fstream>
#include <sstream>

using namespace std;

EmployeeInfoManagement::EmployeeInfoManagement() 
    : employees(), repository(new FileRepository()), dataFilePath("data/employees.txt") {}

EmployeeInfoManagement::EmployeeInfoManagement(FileRepository* repo)
    : employees(), repository(repo), dataFilePath("data/employees.txt") {}

EmployeeInfoManagement::~EmployeeInfoManagement() {
    if (repository) {
        delete repository;
    }
}

Employee* EmployeeInfoManagement::findById(int id) {
    for (auto& e : employees) {
        if (e.getStaffId() == id) return &e;
    }
    return nullptr;
}

void EmployeeInfoManagement::addStaff(const Employee& e) {
    if (findById(e.getStaffId())) {
        cout << "Employee with ID " << e.getStaffId() << " already exists. Add cancelled.\n";
        return;
    }
    employees.push_back(e);
    cout << "Employee " << e.getName() << " added successfully.\n";
    saveToFile();
}

void EmployeeInfoManagement::updateStaff(int id) {
    Employee* e = findById(id);
    if (!e) {
        cout << "Employee with ID " << id << " not found.\n";
        return;
    }

    int choice;
    do {
        cout << "\nWhat do you want to update for employee " << e->getName() 
             << " (ID " << e->getStaffId() << ")?\n";
        cout << "1. Name\n";
        cout << "2. Position\n";
        cout << "3. Phone Number\n";
        cout << "4. Hire Date\n";
        cout << "0. Done/Cancel\n";
        
        choice = InputValidator::readInt("Enter your choice: ");

        if (choice == 1) {
            string n = InputValidator::readString("Enter new name: ");
            e->setName(n);
            cout << "Name updated.\n";
        }
        else if (choice == 2) {
            string p = InputValidator::readString("Enter new position: ");
            e->setPosition(p);
            cout << "Position updated.\n";
        }
        else if (choice == 3) {
            string num = InputValidator::readString("Enter new phone number: ");
            e->setPhoneNum(num);
            cout << "Phone number updated.\n";
        }
        else if (choice == 4) {
            string d = InputValidator::readString("Enter new hire date (YYYY-MM-DD): ");
            e->setHireDate(d);
            cout << "Hire date updated.\n";
        }
        else if (choice == 0) {
            cout << "Exiting update menu.\n";
        }
        else {
            cout << "Invalid choice. Try again.\n";
        }
    } while (choice != 0);
    
    saveToFile();
}

Employee* EmployeeInfoManagement::getStaff(int id) {
    return findById(id);
}

void EmployeeInfoManagement::removeStaff(int id) {
    for (auto it = employees.begin(); it != employees.end(); ++it) {
        if (it->getStaffId() == id) {
            cout << "Employee " << it->getName() << " removed.\n";
            employees.erase(it);
            saveToFile();
            return;
        }
    }
    cout << "Employee with ID " << id << " not found.\n";
}

void EmployeeInfoManagement::displayAllEmployees() const {
    cout << "\n==== Employee List ====\n";
    if (employees.empty()) {
        cout << "No employees in the system.\n";
        return;
    }
    for (const auto& e : employees) {
        e.display();
    }
}

bool EmployeeInfoManagement::employeeExists(int id) const {
    for (const auto& e : employees) {
        if (e.getStaffId() == id) return true;
    }
    return false;
}

void EmployeeInfoManagement::saveToFile() {
    if (!repository) {
        cerr << "Error: Repository not initialized.\n";
        return;
    }
    
    stringstream ss;
    for (const auto& e : employees) {
        ss << e.serialize() << "\n";
    }
    
    repository->saveToFile(ss.str(), dataFilePath);
    cout << "Employee data saved successfully.\n";
}

void EmployeeInfoManagement::loadFromFile() {
    if (!repository) {
        cerr << "Error: Repository not initialized.\n";
        return;
    }
    
    if (!repository->fileExists(dataFilePath)) {
        cout << "No existing employee data found.\n";
        return;
    }
    
    employees.clear();
    vector<string> lines = repository->readLines(dataFilePath);
    
    for (const auto& line : lines) {
        if (!line.empty()) {
            Employee e = Employee::deserialize(line);
            if (e.getStaffId() != 0) {
                employees.push_back(e);
            }
        }
    }
    
    cout << "Loaded " << employees.size() << " employees from file.\n";
}

void EmployeeInfoManagement::management() {
    int choice;
    do {
        cout << "\n==== Employee Info Management System ====\n";
        cout << "1. Add Employee\n";
        cout << "2. Update Employee\n";
        cout << "3. Get Employee\n";
        cout << "4. Remove Employee\n";
        cout << "5. Display All Employees\n";
        cout << "0. Back to Main Menu\n";
        
        choice = InputValidator::readInt("Enter your choice: ");

        if (choice == 1) {
            int id = InputValidator::readInt("Enter Employee ID (number only): ");
            if (findById(id)) {
                cout << "Employee with ID " << id << " already exists. Add cancelled.\n";
                continue;
            }
            
            string n = InputValidator::readString("Enter name: ");
            string p = InputValidator::readString("Enter position: ");
            string num = InputValidator::readString("Enter phone number: ");
            string d = InputValidator::readString("Enter hire date (YYYY-MM-DD): ");
            
            addStaff(Employee(id, n, p, num, d));
        }
        else if (choice == 2) {
            int id = InputValidator::readInt("Enter Employee ID to update: ");
            updateStaff(id);
        }
        else if (choice == 3) {
            int id = InputValidator::readInt("Enter Employee ID to get: ");
            Employee* e = getStaff(id);
            if (e) {
                cout << "\nEmployee Found:\n";
                e->display();
            }
            else {
                cout << "Employee with ID " << id << " not found.\n";
            }
        }
        else if (choice == 4) {
            int id = InputValidator::readInt("Enter Employee ID to remove: ");
            removeStaff(id);
        }
        else if (choice == 5) {
            displayAllEmployees();
        }
        else if (choice == 0) {
            cout << "Returning to main menu...\n";
        }
        else {
            cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 0);
}

