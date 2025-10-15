//#include "../../include/utils/InputValidator.h"
#include "InputValidator.h"
#include <iostream>
#include <limits>

using namespace std;

int InputValidator::ReadInt(const string& prompt) {
    int value;
    while (true) {
        cout << prompt;
        if (cin >> value) {
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            return value;
        }
        else {
            cout << "Invalid input. Please enter a valid number.\n";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
        }
    }
}

string InputValidator::ReadString(const string& prompt) {
    string value;
    cout << prompt;
    getline(cin, value);
    return value;
}

bool InputValidator::IsValidInput() {
    return cin.good();
}

