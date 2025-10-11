#include "../../include/core/Account.h"

using namespace std;

Account::Account() : staffId(0), password("") {}

Account::Account(int id, const string& pwd) : staffId(id), password(pwd) {}

Account::~Account() {}

int Account::getStaffId() const {
    return staffId;
}

string Account::getPassword() const {
    return password;
}

void Account::setStaffId(int id) {
    staffId = id;
}

void Account::setPassword(const string& pwd) {
    password = pwd;
}

bool Account::authenticate(int id, const string& pwd) const {
    return (staffId == id && password == pwd);
}

