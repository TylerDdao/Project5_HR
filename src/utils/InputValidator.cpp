#include "../../include/utils/InputValidator.h"
#include <iostream>
#include <limits>

using namespace std;

int InputValidator::readInt(const string& prompt) {
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

string InputValidator::readString(const string& prompt) {
    string value;
    cout << prompt;
    getline(cin, value);
    return value;
}

bool InputValidator::isValidInput() {
    return cin.good();
}

