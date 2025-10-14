#pragma once

#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <iostream>
#include <string>

using namespace std;

class Account {
private:
    int staffId;
    string password;

public:
    Account();
    Account(int id, const string& pwd);
    ~Account();
    
    // Getters
    int getStaffId() const;
    string getPassword() const;
    
    // Setters
    void setStaffId(int id);
    void setPassword(const string& pwd);
    
    // Authentication
    bool authenticate(int id, const string& pwd) const;
};

#endif // ACCOUNT_H

