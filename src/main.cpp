#include <iostream>
#include "../include/core/EmployeeInfoManagement.h"
#include "../include/communication/CommunicationHub.h"
#include "../include/utils/InputValidator.h"

using namespace std;

void displayMainMenu() {
    cout << "\n========================================\n";
    cout << "   HR Management & Communication System\n";
    cout << "========================================\n";
    cout << "1. Employee Management\n";
    cout << "2. Communication System\n";
    cout << "3. Display All Employees\n";
    cout << "4. Display All Conversations\n";
    cout << "0. Exit\n";
    cout << "========================================\n";
}

int main() {
    cout << "========================================\n";
    cout << "  Welcome to HR Management System\n";
    cout << "========================================\n\n";
    
    // Initialize systems
    EmployeeInfoManagement employeeManager;
    CommunicationHub commHub;
    
    // Load data
    cout << "Loading employee data...\n";
    employeeManager.loadFromFile();
    
    cout << "Loading conversation data...\n";
    commHub.loadFromFile();
    
    // For demo purposes, we'll use a default user ID
    // In a real system, you would have authentication
    int currentUserId = 0;
    
    cout << "\nEnter your Employee ID for this session: ";
    currentUserId = InputValidator::readInt("");
    
    if (!employeeManager.employeeExists(currentUserId)) {
        cout << "\nWarning: Employee ID " << currentUserId 
             << " not found in system. You can still use the system,\n"
             << "but some features may not work properly.\n";
    }
    else {
        Employee* currentEmployee = employeeManager.getStaff(currentUserId);
        if (currentEmployee) {
            cout << "\nWelcome, " << currentEmployee->getName() << "!\n";
        }
    }
    
    int choice;
    do {
        displayMainMenu();
        choice = InputValidator::readInt("Enter your choice: ");
        
        switch (choice) {
            case 1:
                employeeManager.management();
                break;
                
            case 2:
                commHub.manageCommunication(currentUserId);
                break;
                
            case 3:
                employeeManager.displayAllEmployees();
                break;
                
            case 4:
                commHub.displayAllConversations();
                break;
                
            case 0:
                cout << "\nSaving all data...\n";
                employeeManager.saveToFile();
                commHub.saveToFile();
                cout << "Thank you for using HR Management System. Goodbye!\n";
                break;
                
            default:
                cout << "Invalid choice! Please try again.\n";
                break;
        }
        
    } while (choice != 0);
    
    return 0;
}

