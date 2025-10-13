#pragma once

#include "employeeinfo.h"
#include <iostream>
#include <limits>
#include <fstream>
#include <sstream>

using namespace std;

Employee::Employee() : staffId(0), name(), position(), phoneNum(), hireDate() {}
Employee::Employee(int id, const string& n, const string& p, const string& num, const string& d)
    : staffId(id), name(n), position(p), phoneNum(num), hireDate(d) {}

int Employee::GetStaffId() const 
{ 
    return staffId;
}

void Employee::SetName(const string& n) 
{ 
    name = n; 
}

string Employee::GetName() const 
{ 
    return name; 
}

void Employee::SetPosition(const string& p) 
{ 
    position = p; 
}

string Employee::GetPosition() const 
{ 
    return position; 
}

void Employee::SetPhoneNum(const string& num) 
{ 
    phoneNum = num; 
}

string Employee::GetPhoneNum() const 
{ 
    return phoneNum; 
}

void Employee::SetHireDate(const string& d) 
{ 
    hireDate = d; 
}

string Employee::GetHireDate() const 
{ 
    return hireDate; 
}

void Employee::Display() const {
    cout << "EmployeeID: " << staffId << "\n"
        << "Name: " << name << "\n"
        << "Position: " << position << "\n"
        << "PhoneNumber: " << phoneNum << "\n"
        << "HireDate: " << hireDate << "\n" << endl;
}

EmployeeInfoManagement::EmployeeInfoManagement() : employees() { }

int EmployeeInfoManagement::ReadInt(const string& prompt) {
    int value;
    while (true) {
        cout << prompt;
        if (cin >> value) {
            
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            return value;
        }
        else {
            cout << "Invalid. Please try again.\n";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
        }
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
        cout << "\nWhat do you want to update for employee " << e->GetName() << " (ID " << e->GetStaffId() << ")?\n";
        cout << "1. Name\n";
        cout << "2. Position\n";
        cout << "3. Phone Number\n";
        cout << "4. Hire Date\n";
        cout << "0. Done/Cancel\n";
        choice = ReadInt("Enter your choice: ");

        if (choice == 1) {
            string n;
            cout << "Enter new name: ";
            getline(cin, n);
            e->SetName(n);
            cout << "Name updated.\n";
        }
        else if (choice == 2) {
            string p;
            cout << "Enter new position: ";
            getline(cin, p);
            e->SetPosition(p);
            cout << "Position updated.\n";
        }
        else if (choice == 3) {
            string num;
            cout << "Enter new phone number: ";
            getline(cin, num);
            e->SetPhoneNum(num);
            cout << "Phone number updated.\n";
        }
        else if (choice == 4) {
            string d;
            cout << "Enter new hire date (YYYY-MM-DD): ";
            getline(cin, d);
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
    for (const auto& e : employees) e.Display();
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
        cout << "0. Exit\n";
        choice = ReadInt("Enter your choice: ");

        if (choice == 1) {
            int id = ReadInt("Enter id (number only): ");
            if (FindById(id)) {
                cout << "Employee with ID " << id << " already exists. Add cancelled.\n";
                continue;
            }
            string n, p, num, d;
            cout << "Enter name: ";
            getline(cin, n);
            cout << "Enter position: ";
            getline(cin, p);
            cout << "Enter phone number: ";
            getline(cin, num);
            cout << "Enter hire date (YYYY-MM-DD): ";
            getline(cin, d);
            AddStaff(Employee(id, n, p, num, d));
        }
        else if (choice == 2) {
            int id = ReadInt("Enter id to update: ");
                UpdateStaff(id);
        }
        else if (choice == 3) {
            int id = ReadInt("Enter id to get: ");
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
            int id = ReadInt("Enter id to remove: ");
            RemoveStaff(id);
        }
        else if (choice == 5) {
            DisplayAllEmployees();
        }
        else if (choice == 0) {
            cout << "Exiting ...\n";
        }
        else {
            cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 0);
}

void EmployeeInfoManagement::SaveToFile() const
{
    ofstream file("employees.txt");
    if (!file)
    {
        cout << "Error. Cannot open file.\n";
        return;
        }
    for (const auto& e : employees)
    {
            file << e.GetStaffId() << "," << e.GetName() << "," << e.GetPosition() << "," << e.GetPhoneNum() << "," << e.GetHireDate() << "\n";
    }
    file.close();
    cout << "Management info updated.\n";
}

void EmployeeInfoManagement::LoadFromFile()
{
    ifstream file("employees.txt");
    if (!file) {
        cout << "Employee does not exist.\n";
        return;
    }

    employees.clear();
    string line;
    while (getline(file, line)) {
        stringstream ss(line);
        string idStr, name, position, phone, date;

        getline(ss, idStr, ',');
        getline(ss, name, ',');
        getline(ss, position, ',');
        getline(ss, phone, ',');
        getline(ss, date, ',');

        if (!idStr.empty()) {
            int id = stoi(idStr);
            employees.emplace_back(id, name, position, phone, date);
        }
    }

    file.close();
    cout << "Data load success.\n";
}


