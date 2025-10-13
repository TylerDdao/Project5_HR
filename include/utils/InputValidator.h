#pragma once

#ifndef INPUT_VALIDATOR_H
#define INPUT_VALIDATOR_H

#include <string>

using namespace std;

class InputValidator {
public:
    static int ReadInt(const string& prompt);
    static string ReadString(const string& prompt);
    static bool IsValidInput();
};

#endif // INPUT_VALIDATOR_H

