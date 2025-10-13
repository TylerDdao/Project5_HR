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

Employee* EmployeeInfoManagement::FindById(int id) {
    for (auto& e : employees) {
        if (e.GetStaffId() == id) return &e;
    }
    return nullptr;
}

void EmployeeInfoManagement::AddStaff(const Employee& e) {
    if (FindById(e.GetStaffId())) {
        cout << "Employee with ID " << e.GetStaffId() << " already exists. Add cancelled.\n";
        return;
    }
    employees.push_back(e);
    cout << "Employee " << e.GetName() << " added successfully.\n";
    SaveToFile();
}

void EmployeeInfoManagement::UpdateStaff(int id) {
    Employee* e = FindById(id);
    if (!e) {
        cout << "Employee with ID " << id << " not found.\n";
        return;
    }

    int choice;
    do {
        cout << "\nWhat do you want to update for employee " << e->GetName() 
             << " (ID " << e->GetStaffId() << ")?\n";
        cout << "1. Name\n";
        cout << "2. Position\n";
        cout << "3. Phone Number\n";
        cout << "4. Hire Date\n";
        cout << "0. Done/Cancel\n";
        
        choice = InputValidator::ReadInt("Enter your choice: ");

        if (choice == 1) {
            string n = InputValidator::ReadString("Enter new name: ");
            e->SetName(n);
            cout << "Name updated.\n";
        }
        else if (choice == 2) {
            string p = InputValidator::ReadString("Enter new position: ");
            e->SetPosition(p);
            cout << "Position updated.\n";
        }
        else if (choice == 3) {
            string num = InputValidator::ReadString("Enter new phone number: ");
            e->SetPhoneNum(num);
            cout << "Phone number updated.\n";
        }
        else if (choice == 4) {
            string d = InputValidator::ReadString("Enter new hire date (YYYY-MM-DD): ");
            e->SetHireDate(d);
            cout << "Hire date updated.\n";
        }
        else if (choice == 0) {
            cout << "Exiting update menu.\n";
        }
        else {
            cout << "Invalid choice. Try again.\n";
        }
    } while (choice != 0);
    
    SaveToFile();
}

Employee* EmployeeInfoManagement::GetStaff(int id) {
    return FindById(id);
}

void EmployeeInfoManagement::RemoveStaff(int id) {
    for (auto it = employees.begin(); it != employees.end(); ++it) {
        if (it->GetStaffId() == id) {
            cout << "Employee " << it->GetName() << " removed.\n";
            employees.erase(it);
            SaveToFile();
            return;
        }
    }
    cout << "Employee with ID " << id << " not found.\n";
}

void EmployeeInfoManagement::DisplayAllEmployees() const {
    cout << "\n==== Employee List ====\n";
    if (employees.empty()) {
        cout << "No employees in the system.\n";
        return;
    }
    for (const auto& e : employees) {
        e.Display();
    }
}

bool EmployeeInfoManagement::EmployeeExists(int id) const {
    for (const auto& e : employees) {
        if (e.GetStaffId() == id) return true;
    }
    return false;
}

void EmployeeInfoManagement::SaveToFile() {
    if (!repository) {
        cerr << "Error: Repository not initialized.\n";
        return;
    }
    
    stringstream ss;
    for (const auto& e : employees) {
        ss << e.Serialize() << "\n";
    }
    
    repository->SaveToFile(ss.str(), dataFilePath);
    cout << "Employee data saved successfully.\n";
}

void EmployeeInfoManagement::LoadFromFile() {
    if (!repository) {
        cerr << "Error: Repository not initialized.\n";
        return;
    }
    
    if (!repository->FileExists(dataFilePath)) {
        cout << "No existing employee data found.\n";
        return;
    }
    
    employees.clear();
    vector<string> lines = repository->ReadLines(dataFilePath);
    
    for (const auto& line : lines) {
        if (!line.empty()) {
            Employee e = Employee::Deserialize(line);
            if (e.GetStaffId() != 0) {
                employees.push_back(e);
            }
        }
    }
    
    cout << "Loaded " << employees.size() << " employees from file.\n";
}

void EmployeeInfoManagement::Management() {
    int choice;
    do {
        cout << "\n==== Employee Info Management System ====\n";
        cout << "1. Add Employee\n";
        cout << "2. Update Employee\n";
        cout << "3. Get Employee\n";
        cout << "4. Remove Employee\n";
        cout << "5. Display All Employees\n";
        cout << "0. Back to Main Menu\n";
        
        choice = InputValidator::ReadInt("Enter your choice: ");

        if (choice == 1) {
            int id = InputValidator::ReadInt("Enter Employee ID (number only): ");
            if (FindById(id)) {
                cout << "Employee with ID " << id << " already exists. Add cancelled.\n";
                continue;
            }
            
            string n = InputValidator::ReadString("Enter name: ");
            string p = InputValidator::ReadString("Enter position: ");
            string num = InputValidator::ReadString("Enter phone number: ");
            string d = InputValidator::ReadString("Enter hire date (YYYY-MM-DD): ");
            
            AddStaff(Employee(id, n, p, num, d));
        }
        else if (choice == 2) {
            int id = InputValidator::ReadInt("Enter Employee ID to update: ");
            UpdateStaff(id);
        }
        else if (choice == 3) {
            int id = InputValidator::ReadInt("Enter Employee ID to get: ");
            Employee* e = GetStaff(id);
            if (e) {
                cout << "\nEmployee Found:\n";
                e->Display();
            }
            else {
                cout << "Employee with ID " << id << " not found.\n";
            }
        }
        else if (choice == 4) {
            int id = InputValidator::ReadInt("Enter Employee ID to remove: ");
            RemoveStaff(id);
        }
        else if (choice == 5) {
            DisplayAllEmployees();
        }
        else if (choice == 0) {
            cout << "Returning to main menu...\n";
        }
        else {
            cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 0);
}

