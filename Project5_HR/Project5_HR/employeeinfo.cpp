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

int Employee::getStaffId() const 
{ 
    return staffId;
}

void Employee::setName(const string& n) 
{ 
    name = n; 
}

string Employee::getName() const 
{ 
    return name; 
}

void Employee::setPosition(const string& p) 
{ 
    position = p; 
}

string Employee::getPosition() const 
{ 
    return position; 
}

void Employee::setPhoneNum(const string& num) 
{ 
    phoneNum = num; 
}

string Employee::getPhoneNum() const 
{ 
    return phoneNum; 
}

void Employee::setHireDate(const string& d) 
{ 
    hireDate = d; 
}

string Employee::getHireDate() const 
{ 
    return hireDate; 
}

void Employee::display() const {
    cout << "EmployeeID: " << staffId << "\n"
        << "Name: " << name << "\n"
        << "Position: " << position << "\n"
        << "PhoneNumber: " << phoneNum << "\n"
        << "HireDate: " << hireDate << "\n" << endl;
}

EmployeeInfoManagement::EmployeeInfoManagement() : employees() { }

int EmployeeInfoManagement::readInt(const string& prompt) {
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
        cout << "\nWhat do you want to update for employee " << e->getName() << " (ID " << e->getStaffId() << ")?\n";
        cout << "1. Name\n";
        cout << "2. Position\n";
        cout << "3. Phone Number\n";
        cout << "4. Hire Date\n";
        cout << "0. Done/Cancel\n";
        choice = readInt("Enter your choice: ");

        if (choice == 1) {
            string n;
            cout << "Enter new name: ";
            getline(cin, n);
            e->setName(n);
            cout << "Name updated.\n";
        }
        else if (choice == 2) {
            string p;
            cout << "Enter new position: ";
            getline(cin, p);
            e->setPosition(p);
            cout << "Position updated.\n";
        }
        else if (choice == 3) {
            string num;
            cout << "Enter new phone number: ";
            getline(cin, num);
            e->setPhoneNum(num);
            cout << "Phone number updated.\n";
        }
        else if (choice == 4) {
            string d;
            cout << "Enter new hire date (YYYY-MM-DD): ";
            getline(cin, d);
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
    for (const auto& e : employees) e.display();
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
        cout << "0. Exit\n";
        choice = readInt("Enter your choice: ");

        if (choice == 1) {
            int id = readInt("Enter id (number only): ");
            if (findById(id)) {
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
            addStaff(Employee(id, n, p, num, d));
        }
        else if (choice == 2) {
            int id = readInt("Enter id to update: ");
            updateStaff(id);
        }
        else if (choice == 3) {
            int id = readInt("Enter id to get: ");
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
            int id = readInt("Enter id to remove: ");
            removeStaff(id);
        }
        else if (choice == 5) {
            displayAllEmployees();
        }
        else if (choice == 0) {
            cout << "Exiting ...\n";
        }
        else {
            cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 0);
}

void EmployeeInfoManagement::saveToFile() const
{
    ofstream file("employees.txt");
    if (!file)
    {
        cout << "Error. Cannot open file.\n";
        return;
        }
    for (const auto& e : employees)
    {
        file << e.getStaffId() << "," << e.getName() << "," << e.getPosition() << "," << e.getPhoneNum() << "," << e.getHireDate() << "\n";
    }
    file.close();
    cout << "Management info updated.\n";
}

void EmployeeInfoManagement::loadFromFile()
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


