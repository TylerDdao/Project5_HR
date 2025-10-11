#pragma once

#ifndef INPUT_VALIDATOR_H
#define INPUT_VALIDATOR_H

#include <string>

using namespace std;

class InputValidator {
public:
    static int readInt(const string& prompt);
    static string readString(const string& prompt);
    static bool isValidInput();
};

#endif // INPUT_VALIDATOR_H

